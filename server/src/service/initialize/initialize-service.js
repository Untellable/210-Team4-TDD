import { Heap } from 'heap-js';

/**
 * Creates a structured account information object from raw data.
 * @param {object} data - Raw data from which account information is extracted.
 * @returns {object} Structured account information.
 */
function createAccountInfo(data) {
    return {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        followingCount: data.following_count,
        followersCount: data.followers_count,
        statusesCount: data.statuses_count,
    };
}

/**
 * Retrieves account followers either from the database or the API.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account related api calls.
 * @param {string} id - Identifier of the account for which followers are to be retrieved.
 * @param {DAO} db - An instance of the DAO to perform database operations.
 *
 * @returns {Promise<object|null>} Object mapping follower IDs to their account info, or null if no data is available.
 */
async function accountFollowersService(api, id, db) {
    // First, attempt to get followers from the database
    const followers = await db.getFollowers(id);
    if (followers) {
        console.log(`Getting followers from db`);
        return followers;
    }

    // If not in the database, fetch from the API
    console.log(`Getting followers from API`);
    const { data } = await api.getAccountFollowers(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            await db.addFollower(id, data[i].id, accountInfo); // Storing fetched data in the database
        }
        return response;
    }
}

/**
 * Retrieves accounts that a specific account is following.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account related api calls.
 * @param {string} id - Identifier of the account to check for followings.
 * @param {DAO} db - An instance of the DAO to perform database operations.
 *
 * @returns {Promise<object|null>} Object mapping following IDs to their account info, or null if no data is available.
 */
async function accountFollowingService(api, id, db) {
    // Attempt to get the followings from the database
    const followings = await db.getFollowings(id);
    if (followings) {
        console.log(`Getting followings from db`);
        return followings;
    }

    // If not in the database, fetch from the API
    const { data } = await api.getAccountFollowing(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            await db.addFollowing(id, data[i].id, accountInfo); // Storing fetched data in the database
        }
        return response;
    }
}

/**
 * Returns a list of node information objects selected through a greedy search starting from the id provided.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account related api calls.
 * @param {string} mainId - Identifier of the account to check for followings.
 * @param {DAO} db - An instance of the DAO to perform database operations.
 * @param {integer} maxNodes - Max number of nodes to return.
 * @param {string} nodeRank - Node parameter to rank nodes based on. Options are: "followers", "posts", "random"
 * @param {integer} locality - Exponential decay of node rank based on distance from mainId. Higher values prioritize closer nodes.
 *
 * @returns {Promise<array|null>} List of account info objects.
 *      The 'following' property contains the nodes in this list that the account follows. Null if no data is available.
 */
async function accountInitializeService(
    api,
    mainId,
    db,
    maxNodes = 10,
    nodeRank = 'followers',
    locality = 2
) {
    let mainNodeInfoRaw;
    try {
        mainNodeInfoRaw = await api.getAccountInfo(mainId);
    } catch (e) {
        return new Array(); // TODO Specifically catch axios errors somewhere else and case on return being null here
    } // TODO: how to handle slow axios responses giving errors? Auto retry in api?
    if (!mainNodeInfoRaw || !mainNodeInfoRaw['data']) {
        return new Array();
    }
    const mainNodeInfo = createAccountInfo(mainNodeInfoRaw['data']);

    const seenNodes = new Set([mainId]); // Track seen nodes
    const accountInfoMap = new Map(); // Track info of selected nodes
    accountInfoMap.set(mainId, { ...mainNodeInfo, depth: 0, priority: 1 });

    // Sort nodes by priority using custom max heap
    const heapComparator = (a, b) => b.priority - a.priority;
    const nodeHeap = new Heap(heapComparator);
    nodeHeap.init([accountInfoMap.get(mainId)]);

    let rankFun; // Choose parameter to rank nodes by
    if (nodeRank == 'followers') {
        rankFun = (nodeInfo) => nodeInfo['followersCount'];
    } else if (nodeRank == 'posts') {
        rankFun = (nodeInfo) => nodeInfo['statusesCount'];
    } else if (nodeRank == 'random') {
        rankFun = (nodeInfo) => Math.random();
    } else {
        throw new RangeError( // TODO: need to deal with this case in handler
            'nodeRank must be one of: "followers", "posts", or "random".'
        );
    }

    // Calculate node priority based on rank and locality
    const calcPriority = (nodeInfo) =>
        rankFun(nodeInfo) / locality ** nodeInfo['depth'];

    while (!nodeHeap.isEmpty() && accountInfoMap.size < maxNodes) {
        // TODO move single step to helper function for testing?
        console.log(`Node ${accountInfoMap.size} of ${maxNodes}`);
        const curNodeInfo = nodeHeap.pop();

        let curFollowing;
        let curFollowers;
        try {
            curFollowing = new Map(
                Object.entries(
                    await accountFollowingService(api, curNodeInfo['id'], db)
                )
            );
            curFollowers = new Map(
                Object.entries(
                    await accountFollowersService(api, curNodeInfo['id'], db)
                )
            );
        } catch (e) {
            continue; // TODO:
        }

        const curNeighbors = [...curFollowing, ...curFollowers];

        const newNeighbors = new Map();
        for (const [nodeId, nodeInfo] of curNeighbors) {
            if (!seenNodes.has(nodeId)) {
                newNeighbors.set(nodeId, nodeInfo);
                seenNodes.add(nodeId);
            } else if (accountInfoMap.has(nodeId)) {
                // update depth if shorter path is found
                curNodeInfo['depth'] = Math.min(
                    curNodeInfo['depth'],
                    accountInfoMap.get(nodeId)['depth'] + 1
                );
            } // TODO: same as earlier try/catch
        }

        // Update current node info
        curNodeInfo['following'] = new Set(curFollowing.keys());
        accountInfoMap.set(curNodeInfo['id'], curNodeInfo);

        for (const [nodeId, nodeInfo] of newNeighbors) {
            nodeInfo['depth'] = curNodeInfo['depth'] + 1;
            const nodePriority = calcPriority(nodeInfo);
            nodeHeap.push({ ...nodeInfo, priority: nodePriority });
        }
    }

    // Update node follower info to only contain nodes in accountInfoMap
    const selectedNodes = new Set(accountInfoMap.keys());
    for (const [nodeId, nodeInfo] of accountInfoMap) {
        const removeUnusedFollower = (nodeId) =>
            !selectedNodes.has(nodeId)
                ? nodeInfo['following'].delete(nodeId)
                : null;
        nodeInfo['following'].forEach(removeUnusedFollower);

        // convert to array for json conversion
        nodeInfo['following'] = Array.from(nodeInfo['following']);
    }

    const accountInfoList = Array.from(accountInfoMap.values());
    return accountInfoList;
}

export {
    accountFollowersService,
    accountFollowingService,
    accountInitializeService,
};

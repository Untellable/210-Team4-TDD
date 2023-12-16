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
 *
 * @returns {Promise<object|null>} Object mapping follower IDs to their account info, or null if no data is available.
 */
async function accountFollowersService(api, id) {
    const followerInfoRaw = await api.getAccountFollowers(id);
    if (!followerInfoRaw || !followerInfoRaw.data) {
        return null;
    }

    const data = followerInfoRaw.data;
    let response = {};
    for (let i = 0; i < data.length; i++) {
        response[data[i].id] = createAccountInfo(data[i]);
    }
    return response;
}

/**
 * Retrieves accounts that a specific account is following.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account related api calls.
 * @param {string} id - Identifier of the account to check for followings.
 *
 * @returns {Promise<object|null>} Object mapping following IDs to their account info, or null if no data is available.
 */
async function accountFollowingService(api, id) {
    const followingInfoRaw = await api.getAccountFollowing(id);
    if (!followingInfoRaw || !followingInfoRaw.data) {
        return null;
    }

    const data = followingInfoRaw.data;
    let response = {};
    for (let i = 0; i < data.length; i++) {
        response[data[i].id] = createAccountInfo(data[i]);
    }
    return response;
}

/**
 * Returns a list of node information objects selected through a greedy search starting from the id provided.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account related api calls.
 * @param {string} mainId - Identifier of the account to check for followings.
 * @param {number} maxNodes - Max number of nodes to return.
 * @param {string} nodeRank - Node parameter to rank nodes based on. Options are: "followers", "posts", "random"
 * @param {number} locality - Exponential decay of node rank based on distance from mainId. Higher values prioritize closer nodes.
 *
 * @returns {Promise<array|null>} List of account info objects.
 *      The 'following' property contains the nodes in this list that the account follows. Null if no data is available.
 */
async function accountInitializeService(
    api,
    mainId,
    maxNodes = 10,
    nodeRank = 'followers',
    locality = 2
) {
    let mainNodeInfoRaw;
    try {
        mainNodeInfoRaw = await api.getAccountInfo(mainId);
    } catch (e) {
        return [];
    }
    if (!mainNodeInfoRaw || !mainNodeInfoRaw['data']) {
        return [];
    }
    const mainNodeInfo = createAccountInfo(mainNodeInfoRaw['data']);

    const seenNodes = new Set([mainId]); // Track seen nodes
    const accountInfoMap = new Map(); // Track info of selected nodes
    accountInfoMap.set(mainId, {
        ...mainNodeInfo,
        depth: 0,
        priority: 1,
    });

    // Sort nodes by priority using custom max heap
    const heapComparator = (a, b) => b.priority - a.priority;
    const nodeHeap = new Heap(heapComparator);
    nodeHeap.init([accountInfoMap.get(mainId)]);

    const calcPriority = getPriorityFunction(nodeRank, locality);

    while (!nodeHeap.isEmpty() && accountInfoMap.size < maxNodes) {
        console.log(`Node ${accountInfoMap.size} of ${maxNodes}`);
        const curNodeInfo = nodeHeap.pop();

        let curFollowing;
        let curFollowers; // get info on current node following and followers
        try {
            curFollowing = new Map(
                Object.entries(
                    await accountFollowingService(api, curNodeInfo['id'])
                )
            );
            curFollowers = new Map(
                Object.entries(
                    await accountFollowersService(api, curNodeInfo['id'])
                )
            );
        } catch (e) {
            continue; // Ignore failed requests
        }
        const curFollowingIds = new Set(curFollowing.keys());
        const curFollowersIds = new Set(curFollowers.keys());
        const curNeighbors = [...curFollowing, ...curFollowers];

        const newNeighbors = new Map(); // Filter out seen neighbors which are already in the heap
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
            }
        }

        // Update current node info
        curNodeInfo['following'] = curFollowingIds;
        if ('followingSource' in curNodeInfo) {
            curNodeInfo['following'].add(curNodeInfo['followingSource']);
        }
        accountInfoMap.set(curNodeInfo['id'], curNodeInfo);

        for (const [nodeId, nodeInfo] of newNeighbors) {
            nodeInfo['depth'] = curNodeInfo['depth'] + 1;
            nodeInfo['priority'] = calcPriority(nodeInfo);

            // Need to add this connection directly bc. api only returns a subset of following,
            // which may not contain the account which led to that account and would lead to a
            // disconnected graph.
            if (curFollowersIds.has(nodeId)) {
                nodeInfo['followingSource'] = curNodeInfo['id'];
            }

            nodeHeap.push(nodeInfo);
        }
    }

    // Update node follower info to only contain nodes in accountInfoMap
    const selectedNodes = new Set(accountInfoMap.keys());
    for (const nodeInfo of accountInfoMap.values()) {
        if (nodeInfo['following']) {
            nodeInfo['following']?.forEach((nodeId) => {
                if (!selectedNodes.has(nodeId)) {
                    nodeInfo['following'].delete(nodeId);
                }
            });
            // convert to array for json conversion
            nodeInfo['following'] = Array.from(nodeInfo['following']);
        }
    }

    return Array.from(accountInfoMap.values());
}

function getPriorityFunction(nodeRank, locality) {
    let rankFun; // Choose parameter to rank nodes by
    if (nodeRank === 'followers') {
        rankFun = (nodeInfo) => nodeInfo['followersCount'];
    } else if (nodeRank === 'posts') {
        rankFun = (nodeInfo) => nodeInfo['statusesCount'];
    } else if (nodeRank === 'random') {
        rankFun = () => Math.random();
    } else {
        throw new RangeError(
            'nodeRank must be one of: "followers", "posts", or "random".'
        );
    }

    // Calculate node priority based on rank and locality
    return (nodeInfo) => rankFun(nodeInfo) / locality ** nodeInfo['depth'];
}

export {
    accountFollowersService,
    accountFollowingService,
    accountInitializeService,
    getPriorityFunction,
};

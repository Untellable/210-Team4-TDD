import DAO from "../db/dao.js";
import GunDBAdaptor from "../db/gun/gun-db-adapator.js";
import FediverseAPIFactory from "../fediverse/fediverse-api-factory.js";

const db = new DAO(new GunDBAdaptor());
const api = FediverseAPIFactory.createAdapter('user@mastodon.social');

/**
 * @param {object} data
 */
function createAccountInfo(data) {
    return {
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        following_count: data.following_count,
        followers_count: data.followers_count,
        statuses_count: data.statuses_count,
    };
}

/**
 * @param {string} account
 */
async function accountLookupService(account) {
    try {
        const api = FediverseAPIFactory.createAdapter(account);
        const response = await api.accountLookup(account);
        if (response && response.data) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error during account lookup:', error);
    }
}

/**
 * @param {string} id
 */
async function getAccountInfoService(id) {
    const user = await db.getUser(id);
    if (user) {
        console.log(`getting user from db` + JSON.stringify(user));
        return user;
    }

    try {
        const response = await api.getAccountInfo(id);
        if (!response || !response.data) {
            return null;
        }

        const accountInfo = createAccountInfo(response.data);
        db.addUser(id, accountInfo);
        return accountInfo;
    } catch (error) {
        console.error('Error during getting account info:', error);
    }
}


/**
 * @param {string} id
 */
async function getAccountFollowersService(id) {
    const followers = await db.getFollowers(id);
    if (followers) {
        console.log(`getting followers from db`);
        return followers;
    }

    console.log(`getting followers from api`);
    const { data } = await api.getAccountFollowers(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            // if (i == 3) break;
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            db.addFollower(id, data[i].id, accountInfo);
        }
        return response;
    }
}

async function getAccountFollowingService(id) {
    const followings = await db.getFollowings(id);
    if (followings) {
        console.log(`getting followings from db`);
        return followings;
    }

    const { data } = await api.getAccountFollowing(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            // if (i == 3) break;
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            db.addFollowing(id, data[i].id, accountInfo);
        }
        return response;
    }
}

/*
    * @param {string} id
    * @returns {Promise<{relations: object, accountInfoList: object[]}>}
*/
async function getAccountInitializeService(id) {
    let relations = {};
    let accountInfoMap = new Map();

    // Initialize the relations for the first-level account
    relations[id] = new Set();

    // Function to process followers and followings
    /**
     * @param {any[]} accounts
     * @param {boolean} isFollowerOfId
     */
    async function processAccounts(accounts, isFollowerOfId) {

        for (const accountId in accounts) {
            const account = accounts[accountId];
            // Add account information
            accountInfoMap.set(account.id, account);

            // Update relations
            if (!relations[account.id]) {
                relations[account.id] = new Set();
            }
            if (isFollowerOfId) {
                relations[account.id].add(id);
            } else {
                relations[id].add(account.id);
            }

            // Fetch second-level followers and followings
            const followers = await getAccountFollowersService(account.id);
            const followings = await getAccountFollowingService(account.id);

            for (const followerId in followers) {
                const follower = followers[followerId];
                if (!relations[follower.id]) {
                    relations[follower.id] = new Set();
                }
                relations[follower.id].add(account.id);
                accountInfoMap.set(follower.id, follower);
            }

            for (const followingId in followings) {
                const following = followings[followingId];
                if (!relations[account.id]) {
                    relations[account.id] = new Set();
                }
                relations[account.id].add(following.id);
                accountInfoMap.set(following.id, following);
            }
        }
    }

    // Fetch first-level followers and followings
    const firstLevelFollowers = await getAccountFollowersService(id);
    const firstLevelFollowings = await getAccountFollowingService(id);

    // Process first-level followers and followings
    await processAccounts(firstLevelFollowers, true);
    await processAccounts(firstLevelFollowings, false);

    // Convert Sets to arrays before returning
    Object.keys(relations).forEach(key => {
        relations[key] = Array.from(relations[key]);
    });

    const result = {
        'relations': relations,
        'accountInfoList': Array.from(accountInfoMap.values())
    };

    return result;
}

export {
    accountLookupService,
    getAccountInfoService,
    getAccountFollowersService,
    getAccountFollowingService,
    getAccountInitializeService
};
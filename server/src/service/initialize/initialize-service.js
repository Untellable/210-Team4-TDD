import GUN from "gun";
import DAO from "../../db/dao.js";
import GunDBAdaptor from "../../db/gun/gun-db-adapator.js";

// Create database and API instances
const db = new DAO(new GunDBAdaptor(GUN()));

/**
 * Creates a structured account information object from raw data.
 * @param {object} data - Raw data from which account information is extracted.
 * @returns {object} Structured account information.
 */
function createAccountInfo(data) {
    return {
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        following_count: data.following_count,
        followers_count: data.followers_count,
        statuses_count: data.statuses_count
    };
}

/**
 * Retrieves account followers either from the database or the API.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account lookup.
 * @param {string} id - Identifier of the account for which followers are to be retrieved.
 * @returns {Promise<object|null>} Object mapping follower IDs to their account info, or null if no data is available.
 */
async function accountFollowersService(api, id) {
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
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account lookup.
 * @param {string} id - Identifier of the account to check for followings.
 * @returns {Promise<object|null>} Object mapping following IDs to their account info, or null if no data is available.
 */
async function accountFollowingService(api, id) {
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
 * Initializes account data including relationships and information of followers and followings.
 * @param api
 * @param {string} id - Identifier of the account to initialize data for.
 * @returns {Promise<{relations: object, accountInfoList: object[]}>} Object containing relationship data and a list of account information.
 */
async function accountInitializeService(api, id) {
    let relations = {}; // To store relationships between accounts
    let accountInfoMap = new Map(); // To store account information

    // Initialize the relations for the primary account
    relations[id] = new Set();

    // Function to process followers and followings
    async function processAccounts(accounts, isFollowerOfId) {
        for (const accountId in accounts) {
            const account = accounts[accountId];
            accountInfoMap.set(account.id, account); // Add account information to the map

            // Update relations
            if (!relations[account.id]) {
                relations[account.id] = new Set();
            }
            if (isFollowerOfId) {
                relations[account.id].add(id); // Add relation as a follower
            } else {
                relations[id].add(account.id); // Add relation as following
            }

            // Fetch second-level followers and followings
            const followers = await accountFollowersService(api, account.id);
            const followings = await accountFollowingService(api, account.id);

            // Process followers and followings for the account
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

    // Fetch and process first-level followers and followings
    const firstLevelFollowers = await accountFollowersService(api, id);
    const firstLevelFollowings = await accountFollowingService(api, id);
    await processAccounts(firstLevelFollowers, true);
    await processAccounts(firstLevelFollowings, false);

    // Convert relation sets to arrays for easy handling
    Object.keys(relations).forEach(key => {
        relations[key] = Array.from(relations[key]);
    });

    // Construct the final result
    return {
        "relations": relations,
        "accountInfoList": Array.from(accountInfoMap.values())
    };
}

export {
    accountFollowersService,
    accountFollowingService,
    accountInitializeService
};
// import gun from '../db/index.js';
import { getAccountInfoAPI, getAccountFollowersAPI, getAccountPostsAPI, getAccountFollowingAPI } from '../mastodon/accountAPI.js';
import { createAccountInfo } from '../models/account.js';

/*
    * @param {string} id
*/
async function getAccountInfoService(id) {
    const { data } = await getAccountInfoAPI(id);
    return data;
};

async function getAccountInitializeService(id) {
    let relations = {};
    let accountInfoMap = new Map();

    // Initialize the relations for the first-level account
    relations[id] = new Set();

    // Function to process followers and followings
    async function processAccounts(accounts, isFollowerOfId) {
        for (let account of accounts) {
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

            for (let follower of followers) {
                if (!relations[follower.id]) {
                    relations[follower.id] = new Set();
                }
                relations[follower.id].add(account.id);
                accountInfoMap.set(follower.id, follower);
            }

            for (let following of followings) {
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

/*
    * @param {string} id
*/
async function getAccountPostsService(id) {
    // const account = gun.get('account').get(id);
    // const accountData = await account.once();
    // if (accountData) {
    //     console.log('Get account data from DB');
    // } else {
    console.log('Get account data from API');
    const { data } = await getAccountPostsAPI(id);

    for (let i = 0; i < data.length; i++) {
        const status = {
            created_at: data[i].created_at,
            content: data[i].content,
        };
        // gun.get('account').get(id).get('post').get(data[i].id).put(status);
    }
    // }
    // return gun.get('account').get(id).get('post');
    return data;
};

async function processAccountList(id, data) {
    if (!data) return null;

    let result = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) continue;
        if (i == 10) break; // Limit 10
        const accountInfo = createAccountInfo(data[i]);
        result.push(accountInfo);
    }
    return result;
}

/*
    * @param {string} id
*/
async function getAccountFollowersService(id) {
    const data = await getAccountFollowersAPI(id);
    const result = processAccountList(id, data);
    return result;
};

/*
    * @param {string} id
*/
async function getAccountFollowingService(id) {
    const data = await getAccountFollowersAPI(id);
    const result = processAccountList(id, data);
    return result;
}

export {
    getAccountInitializeService,
    getAccountInfoService,
    getAccountPostsService,
    getAccountFollowersService,
    getAccountFollowingService
};
import {
    getAccountFollowersAPI,
    getAccountFollowingAPI,
    getAccountInfoAPI,
    getAccountPostsAPI
} from '../mastodon/accountAPI.js';
import { dao } from "../db/dao.js";

const db = new dao();

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
 * @param {string} id
 */
async function getAccountInfoService(id) {
    const user = await db.getUser(id);
    if (user) {
        console.log(`getting user from db`+ JSON.stringify(user));
        return user;
    }

    const { data } = await getAccountInfoAPI(id);
    const accountInfo = createAccountInfo(data);
    db.addUser(id, accountInfo);
    return accountInfo;
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

/*
    * @param {string} id
*/
async function getAccountFollowersService(id, level = 1) {
    const followers = await db.getFollowers(id);
    if (followers) {
        console.log(`getting followers from db`);
        return followers;
    }

    const { data } = await getAccountFollowersAPI(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            // if (level === 1) {
            //     const followings = await getAccountFollowingService(data[i].id, level + 1);
            //     const followers = await getAccountFollowersService(data[i].id, level + 1);
            //     accountInfo.following = followings;
            //     accountInfo.follower = followers;
            // }
            response[data[i].id] = accountInfo;
            db.addFollower(id, data[i].id, accountInfo);
        }
        return response;
    }
    // }
    // return gun.get('account').get(id).get('follower');
}

async function getAccountFollowingService(id, level = 1) {
    const followings = await db.getFollowings(id);
    if (followings) {
        console.log(`getting followings from db`);
        return followings;
    }

    const { data } = await getAccountFollowingAPI(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            // if (level === 1) {
            //     const followings = await getAccountFollowingService(data[i].id, level + 1);
            //     const followers = await getAccountFollowersService(data[i].id, level + 1);
            //     accountInfo.following = followings;
            //     accountInfo.follower = followers;
            // }
            response[data[i].id] = accountInfo;
            db.addFollowing(id, data[i].id, accountInfo);
        }
        return response;
    }
}

export {
    getAccountInfoService,
    getAccountPostsService,
    getAccountFollowersService,
    getAccountFollowingService
};
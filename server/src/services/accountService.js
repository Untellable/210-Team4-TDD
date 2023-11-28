// import gun from '../db/index.js';
import { getAccountInfoAPI, getAccountFollowersAPI, getAccountPostsAPI, getAccountFollowingAPI } from '../mastodon/accountAPI.js';


/*
    * @param {string} id
*/
async function getAccountInfoService(id) {
    const { data } = await getAccountInfoAPI(id);
    return data;
};

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
    // const account = gun.get('account').get(id);
    // const accountData = await account.once();

    // if (accountData) {
    // console.log('Get account data from DB');
    // } else {
    const { data } = await getAccountFollowersAPI(id);
    if (!data) {
        return null;
    } else {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            const accountInfo = {
                id: data[i].id,
                username: data[i].username,
                display_name: data[i].display_name,
                following_count: data[i].following_count,
                followers_count: data[i].followers_count,
                statuses_count: data[i].statuses_count,
            };
            if (level == 1) {
                const followings = await getAccountFollowingService(data[i].id, level + 1);
                const followers = await getAccountFollowersService(data[i].id, level + 1);
                accountInfo.following = followings;
                accountInfo.follower = followers;
            }
            result.push(accountInfo);
            // gun.get('account').get(id).get('follower').get(data[i].id).put(accountInfo);
            // gun.get('account').get(data[i].id).put(accountInfo);
        }
        // console.log(gun.get('account').get(id).get('follower'));
        return result;
    }
    // }
    // return gun.get('account').get(id).get('follower');
};

async function getAccountFollowingService(id, level = 1) {
    // const account = gun.get('account').get(id);
    // const accountData = await account.once();
    // if (accountData) {
    //     console.log('Get account data from DB');
    // } else {
    const { data } = await getAccountFollowingAPI(id);
    if (!data) {
        return null;
    } else {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                continue;
            }
            // Limit 10
            if (i == 10) break;
            const accountInfo = {
                id: data[i].id,
                username: data[i].username,
                display_name: data[i].display_name,
                following_count: data[i].following_count,
                followers_count: data[i].followers_count,
                statuses_count: data[i].statuses_count,
            };
            if (level == 1) {
                const followings = await getAccountFollowingService(data[i].id, level + 1);
                const followers = await getAccountFollowersService(data[i].id, level + 1);
                accountInfo.following = followings;
                accountInfo.follower = followers;
            }
            // gun.get('account').get(id).get('following').get(data[i].id).put(accountInfo);
            // gun.get('account').get(data[i].id).put(accountInfo);
            result.push(accountInfo);
        }
        return result;
    }
    // }
    // return gun.get('account').get(id).get('following');
}

export {
    getAccountInfoService,
    getAccountPostsService,
    getAccountFollowersService,
    getAccountFollowingService
};
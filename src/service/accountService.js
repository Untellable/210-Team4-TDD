const gun = require('@/db');
const { getAccountFollowersAPI, getAccountPostsAPI } = require('@/api/accountAPI');

/*
    * @param {string} id
*/
const getAccountInfoService = async (id) => {
    const account = gun.get('account').get(id);
    const accountData = await account.then();
    if (accountData) {
        console.log('Get account data from DB');
        return accountData;
    } else {
        console.log('Get account data from API');
        return null;
    }
};

/*
    * @param {string} id
*/
const getAccountPostsService = async (id) => {
    const account = gun.get('account').get(id);
    const accountData = await account.then();
    if (accountData) {
        console.log('Get account data from DB');
    } else {
        console.log('Get account data from API');
        const { data } = await getAccountPostsAPI(id);

        for (let i = 0; i < data.length; i++) {
            const status = {
                created_at: data[i].created_at,
                content: data[i].content,
            };
            gun.get('account').get(id).get('post').get(data[i].id).put(status);
        }
    }
    return gun.get('account').get(id).get('post');
};

/*
    * @param {string} id
*/
const getAccountFollowersService = async (id) => {
    const account = gun.get('account').get(id);
    const accountData = await account.then();
    if (accountData) {
        console.log('Get account data from DB');
    } else {
        const data = await getAccountFollowersAPI(id);
        if (data) {
        } else {
            console.log('No data from API');
        }

        for (let i = 0; i < data.length; i++) {
            const accountInfo = {
                username: data[i].username,
                display_name: data[i].display_name,
                following_count: data[i].following_count,
                followers_count: data[i].followers_count,
                statuses_count: data[i].statuses_count,
            };
            gun.get('account').get(id).get('follower').get(data[i].id).put(accountInfo);
            gun.get('account').get(data[i].id).put(accountInfo);
        }
        console.log(gun.get('account').get(id).get('follower'));
    }
    return gun.get('account').get(id).get('follower');
}

module.exports = {
    getAccountInfoService,
    getAccountPostsService,
    getAccountFollowersService
};


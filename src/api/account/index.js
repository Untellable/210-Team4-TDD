const gun = require('@/db/index.js');
const axios = require('axios');

// GET https://mastodon.social/api/v1/accounts/:id/statuses
const getAccount = async (id) => {
    const account = gun.get('account').get(id);
    const accountData = await account.then();
    if (accountData) {
        console.log('Get account data from DB');
    } else {
        console.log('Get account data from API');
        const { data } = await axios.get(`https://mastodon.social/api/v1/accounts/${id}/statuses`);

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

module.exports = {
    getAccount,
};

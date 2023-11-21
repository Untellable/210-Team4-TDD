const httpInstance = require('@/utils/http');

// GET https://mastodon.social/api/v1/accounts/:id/statuses
const getAccountPostsAPI = async (id) => {
    try {
        const { data } = await httpInstance.get(`/accounts/${id}/statuses`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

// GET https://mastodon.social/api/v1/accounts/:id/followers
const getAccountFollowersAPI = async (id) => {
    try {
        const { data } = await httpInstance.get(`/accounts/${id}/followers`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAccountPostsAPI,
    getAccountFollowersAPI
};
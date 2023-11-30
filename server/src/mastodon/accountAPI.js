import httpInstance from '../utils/http.js';


// GET https://mastodon.social/api/v1/accounts/:id
async function getAccountInfoAPI(id) {
    try {
        console.log(`GET https://mastodon.social/api/v1/accounts/${id}`);
        const accountInfo = await httpInstance.get(`/accounts/${id}`);
        return accountInfo;
    } catch (error) {
        console.log(error);
    }
};

// GET https://mastodon.social/api/v1/accounts/lookup
// Param: acct
// Example: acct=thomasapowell@fosstodon.org
// TODO: get account info by account name

// GET https://mastodon.social/api/v1/accounts/lookup
async function accountLookup(acct) {
    console.log(`GET https://mastodon.social/api/v1/accounts/lookup`);
    try {
        const data = await httpInstance.get(`/accounts/lookup?acct=${acct}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};


// GET https://mastodon.social/api/v1/accounts/:id/statuses
async function getAccountPostsAPI(id) {
    try {
        const { data: accountPosts } = await httpInstance.get(`/accounts/${id}/statuses`);
        return accountPosts;
    } catch (error) {
        console.log(error);
    }
};

// GET https://mastodon.social/api/v1/accounts/:id/followers
async function getAccountFollowersAPI(id) {
    console.log(`GET https://mastodon.social/api/v1/accounts/${id}/followers`);
    try {
        const {data} = await httpInstance.get(`/accounts/${id}/followers`);
        return data;
    } catch (error) {
        console.log(error);
        // console.log('getAccountFollowersAPI Error:', error.response.data.error);
    }
};

// GET https://mastodon.social/api/v1/accounts/:id/following
async function getAccountFollowingAPI(id) {
    console.log(`GET https://mastodon.social/api/v1/accounts/${id}/following`);
    try {
        const {data} = await httpInstance.get(`/accounts/${id}/following`);
        return data;
    } catch (error) {
        console.log(error);
        // console.log('getAccountFollowingAPI Error:', error.response.data.error);
    }
};

export {
    getAccountInfoAPI,
    getAccountPostsAPI,
    getAccountFollowersAPI,
    getAccountFollowingAPI
};
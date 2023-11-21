const axios = require('axios');
const httpInstance = axios.create({
    baseURL: 'https://mastodon.social/api/v1',
    timeout: 5000
});

module.exports = httpInstance;

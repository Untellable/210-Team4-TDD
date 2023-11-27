import axios from 'axios';
const httpInstance = axios.create({
    baseURL: 'https://mastodon.social/api/v1',
    timeout: 5000
});

export default httpInstance;

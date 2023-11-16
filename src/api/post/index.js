const gun = require('@/db/index.js');
const axios = require('axios');

const getPost = async (id, pid) => {
    const post = gun.get('account').get(id).get('post').get(pid);
    const postData = await post.then();
    if (postData) {
        console.log('Get post data from DB');
        return gun.get('account').get(id).get('post').get(pid);
    } else {
        return null;
    }
}

module.exports = {
    getPost,
};
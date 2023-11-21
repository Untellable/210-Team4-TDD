const gun = require('@/db/index.js');


const getPostListService = async (id) => {
    const posList = gun.get('account').get(id).get('post');
    const posListData = await posList.then();
    if (posListData) {
        return posListData;
    } else {
        return null;
    }
}

const getPostDetailService = async (id, pid) => {
    const post = gun.get('account').get(id).get('post').get(pid);
    const postData = await post.then();
    if (postData) {
        return post;
    } else {
        return null;
    }
}

module.exports = {
    getPostListService,
    getPostDetailService,
};
function createAccountInfo(data) {
    return {
        'id': data.id,
        'username': data.username,
        'display_name': data.display_name,
        'following_count': data.following_count,
        'followers_count': data.followers_count,
        'statuses_count': data.statuses_count,
    };
}

export {
    createAccountInfo
};
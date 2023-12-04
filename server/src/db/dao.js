export default class DAO {
    constructor(dbAdaptor) {
        this.dbAdaptor = dbAdaptor;
    }

    addUser(userId, userData) {
        return this.dbAdaptor.addUser(userId, userData);
    }

    async getUser(userId) {
        return this.dbAdaptor.getUser(userId);
    }

    addFollower(userId, followerId, followerData) {
        return this.dbAdaptor.addFollower(userId, followerId, followerData);
    }

    async getFollowers(userId) {
        return this.dbAdaptor.getFollowers(userId);
    }

    addFollowing(userId, followingId, followingData) {
        return this.dbAdaptor.addFollowing(userId, followingId, followingData);
    }

    async getFollowings(userId) {
        return this.dbAdaptor.getFollowings(userId);
    }
}
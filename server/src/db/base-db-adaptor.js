/**
 * Abstract class for DB adaptor
 */
export default class BaseDBAdaptor {
    /**
     * @param {any} dbInstance
     */
    constructor(dbInstance) {
        if (new.target === BaseDBAdaptor) {
            throw new Error("BaseDBAdaptor is an abstract class and cannot be instantiated directly.");
        }
        this.db = dbInstance;
    }

    /**
     * @param {string} userId
     * @param {object} userData
     */
    addUser(userId, userData) {
        throw new Error('addUser not implemented');
    }

    /**
     * @param {string} userId
     */
    async getUser(userId) {
        throw new Error('getUser not implemented');
    }

    /**
     * @param {string} userId
     * @param {string} followerId
     * @param {object} followerData
     */
    addFollower(userId, followerId, followerData) {
        throw new Error('addFollower not implemented');
    }

    /**
     * @param {string} userId
     */
    async getFollowers(userId) {
        throw new Error('getFollowers not implemented');
    }

    /**
     * @param {string} userId
     * @param {string} followingId
     * @param {object} followingData
     */
    addFollowing(userId, followingId, followingData) {
        throw new Error('addFollowing not implemented');
    }

    /**
     * @param {string} userId
     */
    async getFollowings(userId) {
        throw new Error('getFollowings not implemented');
    }
}

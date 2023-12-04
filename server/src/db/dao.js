/**
 * Data Access Object (DAO) class for abstracting and managing interactions with the database.
 * This class uses a database adaptor to perform db operations and is intended to create an extra layer
 * of abstraction between the db and the main logic. This creates flexibility for migrating to a different
 * db in the future.
 */
export default class DAO {
    /**
     * Creates an instance of the DAO class.
     *
     * @param {BaseDBAdaptor} dbAdaptor - The database adaptor instance to interact with the database.
     */
    constructor(dbAdaptor) {
        this.dbAdaptor = dbAdaptor;
    }

    /**
     * Adds a user to the database.
     *
     * @param {string} userId - The ID of the user to be added.
     * @param {object} userData - The data of the user to be added.
     * @return {Promise<void>}
     */
    async addUser(userId, userData) {
        await this.dbAdaptor.addUser(userId, userData);
    }

    /**
     * Retrieves a user from the database.
     *
     * @param {string} userId - The ID of the user to retrieve.
     * @return {Promise<any>} - A promise that resolves to the user data.
     */
    async getUser(userId) {
        return this.dbAdaptor.getUser(userId);
    }

    /**
     * Adds a follower to a user in the database.
     *
     * @param {string} userId - The ID of the user who is getting a follower.
     * @param {string} followerId - The ID of the follower to add.
     * @param {object} followerData - The data of the follower.
     * @return {Promise<void>}
     */
    async addFollower(userId, followerId, followerData) {
        await this.dbAdaptor.addFollower(userId, followerId, followerData);
    }

    /**
     * Retrieves followers of a user from the database.
     *
     * @param {string} userId - The ID of the user whose followers are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to the user's followers.
     */
    async getFollowers(userId) {
        return this.dbAdaptor.getFollowers(userId);
    }

    /**
     * Adds a following to a user in the database.
     *
     * @param {string} userId - The ID of the user who is following another user.
     * @param {string} followingId - The ID of the user being followed.
     * @param {object} followingData - The data of the following.
     * @return {Promise<void>}
     */
    async addFollowing(userId, followingId, followingData) {
        await this.dbAdaptor.addFollowing(userId, followingId, followingData);
    }

    /**
     * Retrieves followings of a user from the database.
     *
     * @param {string} userId - The ID of the user whose followings are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to the user's followings.
     */
    async getFollowings(userId) {
        return this.dbAdaptor.getFollowings(userId);
    }
}

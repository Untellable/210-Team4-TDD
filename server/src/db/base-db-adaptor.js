/**
 * Abstract class representing a database adaptor.
 * This class provides a template for database operations such as adding users, getting user information,
 * managing followers and followings. It should be extended by concrete database adaptors.
 * @abstract
 */
export default class BaseDBAdaptor {
    /**
     * Constructor for the BaseDBAdaptor class.
     * Throws an error if an attempt is made to instantiate this abstract class directly.
     *
     * @param {any} dbInstance - The instance of the database to be used by the adaptor.
     */
    constructor(dbInstance) {
        if (new.target === BaseDBAdaptor) {
            throw new Error(
                'BaseDBAdaptor is an abstract class and cannot be instantiated directly.'
            );
        }
        this.db = dbInstance;
    }

    /**
     * Abstract method to add a user to the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user to be added.
     * @param {object} userData - The data of the user to be added.
     * @return {Promise<void>} - A promise that resolves when the user is added.
     */
    async addUser(userId, userData) {
        throw new Error('addUser not implemented');
    }

    /**
     * Abstract method to retrieve a user from the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user to retrieve.
     * @return {Promise<any>} - A promise that resolves to the user data.
     */
    async getUser(userId) {
        throw new Error('getUser not implemented');
    }

    /**
     * Abstract method to add a follower to a user in the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user who is getting a follower.
     * @param {string} followerId - The ID of the follower to add.
     * @param {object} followerData - The data of the follower.
     * @return {Promise<void>} - A promise that resolves when the follower is added.
     */
    async addFollower(userId, followerId, followerData) {
        throw new Error('addFollower not implemented');
    }

    /**
     * Abstract method to retrieve followers of a user from the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user whose followers are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to the user's followers.
     */
    async getFollowers(userId) {
        throw new Error('getFollowers not implemented');
    }

    /**
     * Abstract method to add a following to a user in the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user who is following another user.
     * @param {string} followingId - The ID of the user being followed.
     * @param {object} followingData - The data of the following.
     * @return {Promise<void>} - A promise that resolves when the following is added.
     */
    async addFollowing(userId, followingId, followingData) {
        throw new Error('addFollowing not implemented');
    }

    /**
     * Abstract method to retrieve followings of a user from the database.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} userId - The ID of the user whose followings are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to the user's followings.
     */
    async getFollowings(userId) {
        throw new Error('getFollowings not implemented');
    }
}

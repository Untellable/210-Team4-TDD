import BaseDBAdaptor from '../base-db-adaptor.js';

const USER_COLLECTION = 'users';
const FOLLOWER_COLLECTION = 'followers';
const FOLLOWING_COLLECTION = 'followings';

/**
 * GunDBAdaptor class extends BaseDBAdaptor to implement database operations using the GUN database.
 * It includes methods to manage users and their followers and following relationships.
 */
export default class GunDBAdaptor extends BaseDBAdaptor {
    constructor(gunInstance) {
        super(gunInstance);
    }

    /**
     * Adds a user to the database.
     *
     * @param {string} userId - The ID of the user to be added.
     * @param {object} userData - The data of the user to be stored in the database.
     */
    async addUser(userId, userData) {
        this.db.get(USER_COLLECTION).get(userId).put(userData);
    }

    /**
     * Retrieves a user's data from the database by their ID.
     *
     * @param {string} userId - The ID of the user to be retrieved.
     * @return {Promise<object|null>} - A promise that resolves to the user data if found, or null if not found.
     */
    async getUser(userId) {
        return new Promise((resolve) => {
            this.db
                .get(USER_COLLECTION)
                .get(userId)
                .once(
                    (data) => {
                        console.log(data);
                        if (data) {
                            const { _, ...user } = data;
                            resolve(user);
                        } else {
                            // Resolve with null if user not found
                            resolve(null);
                        }
                    },
                    { wait: 50 }
                );
        });
    }

    /**
     * Adds a follower to a user in the database.
     *
     * @param {string} userId - The ID of the user to whom the follower is being added.
     * @param {string} followerId - The ID of the follower to be added.
     * @param {object} followerData - The data of the follower to be stored in the database.
     */
    async addFollower(userId, followerId, followerData) {
        this.db
            .get(USER_COLLECTION)
            .get(userId)
            .get(FOLLOWER_COLLECTION)
            .get(followerId)
            .put(followerData);
    }

    /**
     * Retrieves a list of followers for a specific user from the database.
     *
     * @param {string} userId - The ID of the user whose followers are to be retrieved.
     * @return {Promise<object|null>} - A promise that resolves to an object of followers if found, or null if not found.
     */
    async getFollowers(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWER_COLLECTION);
    }

    /**
     * Adds a following to a user in the database.
     *
     * @param {string} userId - The ID of the user who is following another user.
     * @param {string} followingId - The ID of the user being followed.
     * @param {object} followingData - The data of the following to be stored in the database.
     */
    async addFollowing(userId, followingId, followingData) {
        this.db
            .get(USER_COLLECTION)
            .get(userId)
            .get(FOLLOWING_COLLECTION)
            .get(followingId)
            .put(followingData);
    }

    /**
     * Retrieves a list of followings for a specific user from the database.
     *
     * @param {string} userId - The ID of the user whose followings are to be retrieved.
     * @return {Promise<object|null>} - A promise that resolves to an object of followings if found, or null if not found.
     */
    async getFollowings(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWING_COLLECTION);
    }

    /**
     * A private method to get followers or followings for a given user. It retrieves the collection
     * (either 'followers' or 'followings') for the specified user ID.
     * DB structure: root -> 'users' -> {user_id} -> 'followers'/'followings' -> {follower/following_id}
     *
     * @private
     * @param {string} userId - The ID of the user.
     * @param {string} collection - The collection to retrieve ('followers' or 'followings').
     * @return {Promise<object|null>} - A promise that resolves to an object of the collection if found, or null if not found.
     */
    async #getFollowerOrFollowing(userId, collection) {
        return new Promise((resolve) => {
            const response = {};
            let count = 0;
            this.db
                .get(USER_COLLECTION)
                .get(userId)
                .get(collection)
                .map()
                .once(
                    (user, id) => {
                        // console.log(`getting ${collection}: ${id} from db`);
                        if (user) {
                            const { _, ...userData } = user; // get rid of the '_' property used by db
                            response[id] = userData;
                            count++;
                        }
                    },
                    { wait: 0 }
                );

            const checkCompletion = setInterval(() => {
                if (Object.keys(response).length === 0) {
                    clearInterval(checkCompletion);
                    resolve(null);
                } else if (Object.keys(response).length === count) {
                    clearInterval(checkCompletion);
                    resolve(response);
                }
            }, 500);
        });
    }
}

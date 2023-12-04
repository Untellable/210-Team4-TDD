import GUN from 'gun';
import BaseDBAdaptor from '../base-db-adaptor.js'

const USER_COLLECTION = 'users';
const FOLLOWER_COLLECTION = 'followers';
const FOLLOWING_COLLECTION = 'followings';
const gunInstance = GUN({
    // GUN configuration
});

export default class GunDBAdaptor extends BaseDBAdaptor {
    constructor() {
        super(gunInstance);
    }

    /**
     * @param {string} userId
     * @param {object} userData
     */
    addUser(userId, userData) {
        return this.db.get(USER_COLLECTION).get(userId).put(userData);
    }

    /**
     * @param {string} userId
     */
    async getUser(userId) {
        return new Promise((resolve) => {
            this.db.get(USER_COLLECTION).get(userId).once(data => {
                console.log(data);
                if (data) {
                    const {_, ...user} = data;
                    resolve(user);
                } else {
                    // Resolve with null if user not found
                    resolve(null);
                }
            }, { wait: 50 });
        });
    }

    /**
     * @param {string} userId
     * @param {string} followerId
     * @param {object} followerData
     */
    addFollower(userId, followerId, followerData) {
        const follower = this.db.get(USER_COLLECTION).get(followerId).put(followerData);
        this.db.get(USER_COLLECTION).get(userId).get(FOLLOWER_COLLECTION).get(followerId).set(follower);
    }

    /**
     * @param {string} userId
     */
    async getFollowers(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWER_COLLECTION);
    }

    /**
     * @param {string} userId
     * @param {string} followingId
     * @param {object} followingData
     */
    addFollowing(userId, followingId, followingData) {
        const following = this.db.get(USER_COLLECTION).get(followingId).put(followingData);
        this.db.get(USER_COLLECTION).get(userId).get(FOLLOWING_COLLECTION).get(followingId).set(following);
    }

    /**
     * @param {string} userId
     */
    async getFollowings(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWING_COLLECTION);
    }

    /**
     * Private method to get followers or followings for the given user (id)
     * DB structure: root -> 'users' -> {user_id} -> 'followers'/'followings' -> {follower/following_id}
     * @param {string} userId
     * @param {string} collection
     */
    async #getFollowerOrFollowing(userId, collection) {
        return new Promise((resolve) => {
            const response = {}
            this.db.get(USER_COLLECTION).get(userId).get(collection).map().once((user, id) => {
                console.log(`getting ${collection}: ${id} from db`);
                if (user) {
                    const {_, ...userData} = user;  // get rid of the '_' property used by db
                    response[id] = userData;
                }
            }, {wait: 0});

            if (Object.keys(response).length !== 0) {
                resolve(response);
            } else {
                // Resolve with null if followers/followings not found in db, b/c this is not an error case
                resolve(null);
            }
        });
    }
}
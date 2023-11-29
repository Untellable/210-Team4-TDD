import GUN from 'gun';

const USER_COLLECTION = 'users';
const POST_COLLECTION = 'posts';
const FOLLOWER_COLLECTION = 'followers';
const FOLLOWING_COLLECTION = 'followings';

export const gun = GUN({
    // GUN configuration
});

export class dao {
    constructor() {
        this.db = gun;
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
    async getFollowers(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWER_COLLECTION);
    }

    /**
     * @param {string} userId
     */
    async getFollowings(userId) {
        return await this.#getFollowerOrFollowing(userId, FOLLOWING_COLLECTION);
    }

    /**
     * @param {string} userId
     * @param {string} collection
     */
    async #getFollowerOrFollowing(userId, collection) {
        return new Promise((resolve) => {
            const response = {}
            this.db.get(USER_COLLECTION).get(userId).get(collection).map().once((user, id) => {
                console.log(`getting follower ${id} from db` + user);
                if (user) {
                    const {_, ...userData} = user;
                    response[id] = userData;
                }
            }, {wait: 50});

            if (Object.keys(response).length !== 0) {
                resolve(response);
            } else {
                // Resolve with null if followers not found
                resolve(null);
            }
        });
    }
}
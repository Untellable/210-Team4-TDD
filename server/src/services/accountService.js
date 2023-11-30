import DAO from "../db/dao.js";
import GunDBAdaptor from "../db/gun/gun-db-adapator.js";
import FediverseAPIFactory from "../fediverse/fediverse-api-factory.js";

const db = new DAO(new GunDBAdaptor());
const api = FediverseAPIFactory.createAdapter('user@mastodon.social');

/**
 * @param {object} data
 */
function createAccountInfo(data) {
    return {
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        following_count: data.following_count,
        followers_count: data.followers_count,
        statuses_count: data.statuses_count,
    };
}

/**
 * @param {string} id
 */
async function getAccountInfoService(id) {
    const user = await db.getUser(id);
    if (user) {
        console.log(`getting user from db`+ JSON.stringify(user));
        return user;
    }

    const { data } = await api.getAccountInfo(id);
    const accountInfo = createAccountInfo(data);
    db.addUser(id, accountInfo);
    return accountInfo;
}

/**
 * @param {string} id
 */
async function getAccountFollowersService(id) {
    const followers = await db.getFollowers(id);
    if (followers) {
        console.log(`getting followers from db`);
        return followers;
    }

    const { data } = await api.getAccountFollowers(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            db.addFollower(id, data[i].id, accountInfo);
        }
        return response;
    }
}

async function getAccountFollowingService(id, level = 1) {
    const followings = await db.getFollowings(id);
    if (followings) {
        console.log(`getting followings from db`);
        return followings;
    }

    const { data } = await api.getAccountFollowing(id);
    if (!data) {
        return null;
    } else {
        let response = {};
        for (let i = 0; i < data.length; i++) {
            const accountInfo = createAccountInfo(data[i]);
            response[data[i].id] = accountInfo;
            db.addFollowing(id, data[i].id, accountInfo);
        }
        return response;
    }
}

export {
    getAccountInfoService,
    getAccountFollowersService,
    getAccountFollowingService
};
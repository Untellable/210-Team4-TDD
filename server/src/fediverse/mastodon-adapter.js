import httpInstance from '../utils/http.js';
import FediverseAdapter from './fediverse-adapter.js';

export default class MastodonAdapter extends FediverseAdapter {
    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountInfo(accountId) {
        try {
            console.log(`GET https://${this.server}/api/v1/accounts/${accountId}`);
            return await httpInstance.get(`https://${this.server}/api/v1/accounts/${accountId}`);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountFollowers(accountId) {
        try {
            console.log(`GET https://${this.server}/api/v1/accounts/${accountId}/followers`);
            return await httpInstance.get(`https://${this.server}/api/v1/accounts/${accountId}/followers`);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountFollowing(accountId) {
        try {
            console.log(`GET https://${this.server}/api/v1/accounts/${accountId}/following`);
            return await httpInstance.get(`https://${this.server}/api/v1/accounts/${accountId}/following`);
        } catch (error) {
            console.error(error);
        }
    }
}
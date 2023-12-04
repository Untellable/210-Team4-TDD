/**
 * Abstract class for Fediverse API adaptor
 */
export default class FediverseAdapter {
    /**
     * @param {string} [server]
     */
    constructor(server) {
        this.server = server;
    }
    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountInfo(accountId) {
        throw new Error('getAccountInfo not implemented');
    }

    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountFollowers(accountId) {
        throw new Error('getAccountFollowers not implemented');
    }

    /**
     * @param {string} accountId
     * @return {Promise<any>}
     */
    async getAccountFollowing(accountId) {
        throw new Error('getAccountFollowing not implemented');
    }

    /**
     * @param {string} acct
     * @return {Promise<any>}
     */
    async accountLookup(acct) {
        throw new Error('accountLookup not implemented');
    }
}
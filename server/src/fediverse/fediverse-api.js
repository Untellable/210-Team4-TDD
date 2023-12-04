/**
 * Abstract class for creating an adaptor for the Fediverse API.
 * This class defines the basic structure and methods for interacting with Fediverse platforms.
 * It should be extended by concrete implementations specific to each Fediverse platform.
 * @abstract
 */
export default class FediverseAPI {
    /**
     * Constructor for the FediverseAPI class.
     * Initializes the API with the specified server.
     *
     * @param {string} [server] - The server to be used with the API.
     */
    constructor(server) {
        this.server = server;
    }

    /**
     * Abstract method to retrieve information about a specific account.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} accountId - The ID of the account to retrieve information for.
     * @return {Promise<any>} - A promise that resolves to the account information.
     */
    async getAccountInfo(accountId) {
        throw new Error('getAccountInfo not implemented');
    }

    /**
     * Abstract method to retrieve a list of followers for a specific account.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} accountId - The ID of the account whose followers are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to a list of account's followers.
     */
    async getAccountFollowers(accountId) {
        throw new Error('getAccountFollowers not implemented');
    }

    /**
     * Abstract method to retrieve a list of accounts that a specific account is following.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} accountId - The ID of the account whose following list is to be retrieved.
     * @return {Promise<any>} - A promise that resolves to a list of accounts the specified account is following.
     */
    async getAccountFollowing(accountId) {
        throw new Error('getAccountFollowing not implemented');
    }

    /**
     * Abstract method to perform a lookup for an account based on a provided account identifier.
     * Must be implemented in derived classes.
     *
     * @abstract
     * @param {string} acct - The account identifier for the lookup.
     * @return {Promise<any>} - A promise that resolves to the account details from the lookup.
     */
    async accountLookup(acct) {
        throw new Error('accountLookup not implemented');
    }
}

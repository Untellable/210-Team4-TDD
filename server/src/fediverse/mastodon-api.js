import httpInstance from '../util/http.js';
import FediverseAPI from './fediverse-api.js';

/**
 * MastodonAPI class extends FediverseAPI to provide specific implementations of API methods for the Mastodon platform.
 * It includes methods to retrieve account information, followers, followings, and to perform account lookup.
 */
export default class MastodonAPI extends FediverseAPI {
    /**
     * Retrieves information about a specific account on Mastodon by its ID.
     * This method sends a GET request to the Mastodon API and returns the account information.
     *
     * @param {string} accountId - The ID of the account to retrieve information for.
     * @return {Promise<any>} - A promise that resolves to the account information if successful, or an error if not.
     */
    async getAccountInfo(accountId) {
        try {
            console.log(
                `GET https://${this.server}/api/v1/accounts/${accountId}`
            );
            return await httpInstance.get(
                `https://${this.server}/api/v1/accounts/${accountId}`
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    /**
     * Retrieves a list of followers for a specific account on Mastodon.
     * This method sends a GET request to the Mastodon API to get the account's followers.
     *
     * @param {string} accountId - The ID of the account whose followers are to be retrieved.
     * @return {Promise<any>} - A promise that resolves to a list of the account's followers if successful, or an error if not.
     */
    async getAccountFollowers(accountId) {
        try {
            console.log(
                `GET https://${this.server}/api/v1/accounts/${accountId}/followers`
            );
            return await httpInstance.get(
                `https://${this.server}/api/v1/accounts/${accountId}/followers`
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    /**
     * Retrieves a list of accounts that a specific account on Mastodon is following.
     * This method sends a GET request to the Mastodon API to get the account's followings.
     *
     * @param {string} accountId - The ID of the account whose following list is to be retrieved.
     * @return {Promise<any>} - A promise that resolves to a list of accounts the specified account is following if successful, or an error if not.
     */
    async getAccountFollowing(accountId) {
        try {
            console.log(
                `GET https://${this.server}/api/v1/accounts/${accountId}/following`
            );
            return await httpInstance.get(
                `https://${this.server}/api/v1/accounts/${accountId}/following`
            );
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    /**
     * Performs a lookup for an account on Mastodon based on the account's ID.
     * This method decodes the URL-encoded account ID and sends a GET request to the Mastodon API for the account lookup.
     *
     * @param {string} accountId - The URL-encoded ID of the account to be looked up.
     * @return {Promise<any>} - A promise that resolves to the account details from the lookup if successful, or an error if not.
     */
    async accountLookup(accountId) {
        try {
            accountId = decodeURIComponent(accountId); // Decode URL-encoded string
            console.log(
                `GET https://${this.server}/api/v1/accounts/lookup?acct=${accountId}`
            );
            return await httpInstance.get(
                `https://${this.server}/api/v1/accounts/lookup?acct=${accountId}`
            );
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

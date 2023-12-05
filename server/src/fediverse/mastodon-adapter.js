import axios from "axios";
import httpInstance from "../utils/http.js";
import FediverseAdapter from "./fediverse-adapter.js";

export default class MastodonAdapter extends FediverseAdapter {

    /**
     * GET https://mastodon.social/api/v1/accounts/lookup?acct={acct}
     *
     * @param acct
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    async accountLookup(acct) {
        try {
            // Decode URL-encoded string
            acct = decodeURIComponent(acct);
            console.log(`GET https://${this.server}/api/v1/accounts/lookup?acct=${acct}`);
            const response = await httpInstance.get(`https://${this.server}/api/v1/accounts/lookup?acct=${acct}`);
            console.log("Response:", response);
            // return await httpInstance.get(`https://${this.server}/api/v1/accounts/lookup?acct=${acct}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * GET https://mastodon.social/api/v1/accounts/{accountId}
     *
     * @param accountId
     * @returns {Promise<axios.AxiosResponse<any>>}
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
     * GET https://mastodon.social/api/v1/accounts/{accountId}/followers
     *
     * @param accountId
     * @returns {Promise<axios.AxiosResponse<any>>}
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
     * GET https://mastodon.social/api/v1/accounts/{accountId}/following
     *
     * @param accountId
     * @returns {Promise<axios.AxiosResponse<any>>}
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
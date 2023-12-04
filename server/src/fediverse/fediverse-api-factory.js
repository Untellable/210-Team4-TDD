import MastodonAdapter from './mastodon-adapter.js'
import FediverseAdapter from './fediverse-adapter.js'
import getServerName from "../utils/string-util.js";

export default class FediverseAPIFactory {
    /**
     * Creates an adaptor to the Fediverse api for the given account
     * @param {string} accountUrl user's account url
     * @return {FediverseAdapter} api adaptor based on the account's server
     */
    static createAdapter(accountUrl) {
        const server = getServerName(accountUrl);
        if (server) {
            return new MastodonAdapter(server);
        } else {
            return new MastodonAdapter('mastodon.social');
        }
    }
}

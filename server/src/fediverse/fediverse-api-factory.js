import MastodonAPI from './mastodon-api.js';

export default class FediverseAPIFactory {
    /**
     * Creates an adaptor to the Fediverse api for the given server
     * For the scope of this project, we are always returning an adaptor to the Mastodon API, but the intention of
     * this factory is to make it possible to integrate with other Fediverse platforms in the future
     * @param {string} server user's account server
     * @return {MastodonAPI} api adaptor based on the account's server
     */
    static createAdapter(server = 'mastodon.social') {
        return new MastodonAPI(server);
    }
}

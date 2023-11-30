import MastodonAdapter from './mastodon-adapter.js'
import FediverseAdapter from './fediverse-adapter.js'

export default class FediverseAPIFactory {
    /**
     * Creates an adaptor to the Fediverse api for the given account
     * @param {string} accountURL in the format of {username}@{server}
     * @return {FediverseAdapter} api adaptor based on the account's server
     */
    static createAdapter(accountURL) {
        const server = accountURL.split('@')[1];
        switch (server) {
            case 'mastodon.social':
                return new MastodonAdapter(server);
            default:
                return new MastodonAdapter('mastodon.social');
        }
    }
}

import FediverseAPIFactory from './fediverse-api-factory.js';
import MastodonAPI from './mastodon-api';

describe('FediverseAPIFactory', () => {
    test('createAdapter returns an instance of MastodonAPI', () => {
        const server = 'example.server.com';
        const apiInstance = FediverseAPIFactory.createAdapter(server);

        expect(apiInstance).toBeInstanceOf(MastodonAPI);
        expect(apiInstance.server).toBe(server);
    });

    test('createAdapter uses default server when no argument is passed', () => {
        const defaultServer = 'mastodon.social';
        const apiInstance = FediverseAPIFactory.createAdapter();

        expect(apiInstance).toBeInstanceOf(MastodonAPI);
        expect(apiInstance.server).toBe(defaultServer);
    });
});

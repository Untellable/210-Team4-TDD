import httpInstance from '../util/http.js';
import MastodonAPI from './mastodon-api.js';

jest.mock('../util/http.js'); // Mock the httpInstance

describe('MastodonAPI', () => {
    let api;
    const server = 'example.mastodon.social';
    const accountId = '123456';
    const accountUrl = 'testuser@example.mastodon.social';

    beforeEach(() => {
        api = new MastodonAPI(server);
        jest.resetAllMocks();
    });

    test('getAccountInfo should fetch account information', async () => {
        const mockAccountInfo = { id: accountId, username: 'testuser' };
        httpInstance.get.mockResolvedValue(mockAccountInfo);

        const result = await api.getAccountInfo(accountId);
        expect(httpInstance.get).toHaveBeenCalledWith(
            `https://${server}/api/v1/accounts/${accountId}`
        );
        expect(result).toEqual(mockAccountInfo);
    });

    test('getAccountInfo should handle errors', async () => {
        const mockError = new Error('Error fetching account information');
        httpInstance.get.mockRejectedValue(mockError);

        await expect(api.getAccountInfo(accountId)).resolves.toThrow(mockError);
    });

    test('getAccountFollowers should fetch account followers', async () => {
        const mockFollowers = [{ id: 'follower1' }, { id: 'follower2' }];
        httpInstance.get.mockResolvedValue(mockFollowers);

        const result = await api.getAccountFollowers(accountId);
        expect(httpInstance.get).toHaveBeenCalledWith(
            `https://${server}/api/v1/accounts/${accountId}/followers`
        );
        expect(result).toEqual(mockFollowers);
    });

    test('getAccountFollowing should fetch account followings', async () => {
        const mockFollowing = [{ id: 'following1' }, { id: 'following2' }];
        httpInstance.get.mockResolvedValue(mockFollowing);

        const result = await api.getAccountFollowing(accountId);
        expect(httpInstance.get).toHaveBeenCalledWith(
            `https://${server}/api/v1/accounts/${accountId}/following`
        );
        expect(result).toEqual(mockFollowing);
    });

    test('accountLookup should decode account url and fetch account details', async () => {
        const encodedAccountUrl = encodeURIComponent(accountUrl);
        const mockAccountDetails = { id: accountId, username: 'testuser' };
        httpInstance.get.mockResolvedValue(mockAccountDetails);

        const result = await api.accountLookup(encodedAccountUrl);
        expect(httpInstance.get).toHaveBeenCalledWith(
            `https://${server}/api/v1/accounts/lookup?acct=${accountUrl}`
        );
        expect(result).toEqual(mockAccountDetails);
    });
});

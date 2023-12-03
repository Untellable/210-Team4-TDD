import { jest } from '@jest/globals';
import accountLookupService from './lookup-service.js';
import MastodonAPI from '../../fediverse/mastodon-api.js'; // Adjust the import according to your project structure

jest.mock('../../fediverse/mastodon-api.js'); // Mock the MastodonAPI class

describe('accountLookupService', () => {
    let mockApi;

    beforeEach(() => {
        mockApi = new MastodonAPI();
        jest.clearAllMocks();
    });

    test('should return account data for a successful lookup', async () => {
        const accountUrl = 'valid-account-url';
        const mockResponse = {
            data: { username: 'user', server: 'server.com' },
        };
        mockApi.accountLookup.mockResolvedValue(mockResponse);

        const result = await accountLookupService(mockApi, accountUrl);
        expect(result).toEqual(mockResponse.data);
    });

    test('should return null if account is not found', async () => {
        const accountUrl = 'nonexistent-account-url';
        mockApi.accountLookup.mockResolvedValue({});

        const result = await accountLookupService(mockApi, accountUrl);
        expect(result).toBeNull();
    });

    test('should handle errors and return null', async () => {
        const accountUrl = 'error-account-url';
        mockApi.accountLookup.mockRejectedValue(new Error('Unexpected error'));

        const consoleSpy = jest.spyOn(console, 'error');
        const result = await accountLookupService(mockApi, accountUrl);

        expect(consoleSpy).toHaveBeenCalledWith(
            'Error during account lookup:',
            expect.any(Error)
        );
        expect(result).toBeUndefined();
    });
});

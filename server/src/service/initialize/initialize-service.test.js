import { describe, jest } from '@jest/globals';
import {
    accountFollowingService,
    accountFollowersService,
} from './initialize-service.js';

jest.mock('../../fediverse/mastodon-api.js'); // Mock the MastodonAPI class

describe('accountFollowingService', () => {
    let mockApi;
    let mockDb;

    beforeEach(() => {
        mockApi = {
            getAccountFollowing: jest.fn(),
        };
        mockDb = {
            getFollowings: jest.fn(),
            addFollowing: jest.fn(),
        };
        jest.clearAllMocks();
    });

    test('should retrieve followings from the database if available', async () => {
        const accountId = 'valid-account-id';
        const mockFollowingsFromDb = {
            account1: {
                id: 'account1',
                username: 'user1',
                display_name: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                display_name: 'User Two',
            },
        };

        // Set up the mock database to return the mock data
        mockDb.getFollowings.mockResolvedValue(mockFollowingsFromDb);

        // Call the service with the mock database and API
        const result = await accountFollowingService(
            mockApi,
            accountId,
            mockDb
        );

        // Assert that the database was queried
        expect(mockDb.getFollowings).toHaveBeenCalledWith(accountId);

        // Assert that the API was not called
        expect(mockApi.getAccountFollowing).not.toHaveBeenCalled();

        // Assert that the result matches the mock data from the database
        expect(result).toEqual(mockFollowingsFromDb);
    });

    test('should fetch followings from the API if not in the database', async () => {
        const accountId = 'valid-account-id';
        const mockApiData = [
            { id: 'account1', username: 'user1', display_name: 'User One' },
            { id: 'account2', username: 'user2', display_name: 'User Two' },
        ];
        const mockApiResponse = { data: mockApiData };
        mockDb.getFollowings.mockResolvedValue(Promise.any([null, undefined]));
        mockApi.getAccountFollowing.mockResolvedValue(mockApiResponse);

        const result = await accountFollowingService(
            mockApi,
            accountId,
            mockDb
        );
        expect(mockApi.getAccountFollowing).toHaveBeenCalledWith(accountId);
        expect(result).toEqual({
            account1: {
                id: 'account1',
                username: 'user1',
                display_name: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                display_name: 'User Two',
            },
        });
    });
});

describe('accountFollowersService', () => {
    let mockApi;
    let mockDb;

    beforeEach(() => {
        mockApi = {
            getAccountFollowers: jest.fn(),
        };
        mockDb = {
            getFollowers: jest.fn(),
            addFollower: jest.fn(),
        };
        jest.clearAllMocks();
    });

    test('should retrieve followers from the database if available', async () => {
        const accountId = 'valid-account-id';
        const mockFollowersFromDb = {
            account1: {
                id: 'account1',
                username: 'user1',
                display_name: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                display_name: 'User Two',
            },
        };

        // Set up the mock database to return the mock data
        mockDb.getFollowers.mockResolvedValue(mockFollowersFromDb);

        // Call the service with the mock database and API
        const result = await accountFollowersService(
            mockApi,
            accountId,
            mockDb
        );

        // Assert that the database was queried
        expect(mockDb.getFollowers).toHaveBeenCalledWith(accountId);

        // Assert that the API was not called
        expect(mockApi.getAccountFollowers).not.toHaveBeenCalled();

        // Assert that the result matches the mock data from the database
        expect(result).toEqual(mockFollowersFromDb);
    });

    test('should fetch followers from the API if not in the database', async () => {
        const accountId = 'valid-account-id';
        const mockApiData = [
            { id: 'account1', username: 'user1', display_name: 'User One' },
            { id: 'account2', username: 'user2', display_name: 'User Two' },
        ];
        const mockApiResponse = { data: mockApiData };
        mockDb.getFollowers.mockResolvedValue(Promise.any([null, undefined]));
        mockApi.getAccountFollowers.mockResolvedValue(mockApiResponse);

        const result = await accountFollowersService(
            mockApi,
            accountId,
            mockDb
        );
        expect(mockApi.getAccountFollowers).toHaveBeenCalledWith(accountId);
        expect(result).toEqual({
            account1: {
                id: 'account1',
                username: 'user1',
                display_name: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                display_name: 'User Two',
            },
        });
    });
});

import { describe, jest } from '@jest/globals';
import {
    accountFollowingService,
    accountFollowersService,
    getPriorityFunction,
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

    test('should fetch followings from the API', async () => {
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
                displayName: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                displayName: 'User Two',
            },
        });
    });
});

describe('accountFollowersService', () => {
    let mockApi;

    beforeEach(() => {
        mockApi = {
            getAccountFollowers: jest.fn(),
        };
        jest.clearAllMocks();
    });

    test('should fetch followers from the API', async () => {
        const accountId = 'valid-account-id';
        const mockApiData = [
            { id: 'account1', username: 'user1', display_name: 'User One' },
            { id: 'account2', username: 'user2', display_name: 'User Two' },
        ];
        const mockApiResponse = { data: mockApiData };
        mockApi.getAccountFollowers.mockResolvedValue(mockApiResponse);

        const result = await accountFollowersService(mockApi, accountId);
        expect(mockApi.getAccountFollowers).toHaveBeenCalledWith(accountId);
        expect(result).toEqual({
            account1: {
                id: 'account1',
                username: 'user1',
                displayName: 'User One',
            },
            account2: {
                id: 'account2',
                username: 'user2',
                displayName: 'User Two',
            },
        });
    });
});

describe('getPriorityFunction', () => {
    test('should calculate priority based on followers', () => {
        // setup
        const nodeRank = 'followers';
        const locality = 2;
        const nodeInfo = { followersCount: 100, depth: 1 };
        const priorityFunction = getPriorityFunction(nodeRank, locality);

        // execute
        const result = priorityFunction(nodeInfo);

        // verify
        expect(result).toBe(50); // Adjust as per your logic
    });

    test('should throw RangeError for invalid nodeRank', () => {
        const nodeRank = 'invalidOption';
        const locality = 2;

        expect(() => getPriorityFunction(nodeRank, locality)).toThrow(
            RangeError
        );
    });
});

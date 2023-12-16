import { jest } from '@jest/globals';
import accountLookupHandler from './lookup-handler.js';
import { parseAccountUrl } from '../../util/string-util';
import accountLookupService from '../../service/lookup/lookup-service.js';

jest.mock('../../util/string-util');
jest.mock('../../service/lookup/lookup-service');
jest.mock('../../fediverse/fediverse-api-factory');

describe('accountLookupHandler', () => {
    let mockRequest;
    let mockResponse;
    let responseJson;
    let statusCode;

    beforeEach(() => {
        statusCode = null;
        responseJson = null;
        mockResponse = {
            status: jest.fn().mockImplementation((status) => {
                statusCode = status;
                return mockResponse;
            }),
            json: jest.fn().mockImplementation((result) => {
                responseJson = result;
                return mockResponse;
            }),
        };
        mockRequest = { query: {} };
    });

    test('should return 400 if acct query parameter is missing', async () => {
        await accountLookupHandler(mockRequest, mockResponse);
        expect(statusCode).toBe(400);
        expect(responseJson.error).toBe(
            'Account ID (acct) is required as a query parameter.'
        );
    });

    test('should return 400 for invalid account URL', async () => {
        mockRequest.query.acct = 'invalid-url';
        parseAccountUrl.mockReturnValue(null);

        await accountLookupHandler(mockRequest, mockResponse);
        expect(statusCode).toBe(400);
        expect(responseJson.error).toBe(
            `Invalid account url: ${mockRequest.query.acct}`
        );
    });

    test('should return 404 if account not found', async () => {
        mockRequest.query.acct = 'user@server.com';
        parseAccountUrl.mockReturnValue({
            username: 'user',
            server: 'server.com',
        });
        accountLookupService.mockResolvedValue(null);

        await accountLookupHandler(mockRequest, mockResponse);
        expect(statusCode).toBe(404);
        expect(responseJson.error).toBe(`Account not found for user: user`);
    });

    test('should return account info for valid account URL', async () => {
        mockRequest.query.acct = 'user@server.com';
        const mockAccountInfo = { id: 'mock_id', display_name: 'User' };
        parseAccountUrl.mockReturnValue({
            username: 'user',
            server: 'server.com',
        });
        accountLookupService.mockResolvedValue(mockAccountInfo);

        await accountLookupHandler(mockRequest, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(mockAccountInfo);
    });

    test('should handle unexpected errors', async () => {
        mockRequest.query.acct = 'user@server.com';
        parseAccountUrl.mockReturnValue({
            username: 'user',
            server: 'server.com',
        });
        const error = new Error('Unexpected error');
        accountLookupService.mockRejectedValue(error);

        await accountLookupHandler(mockRequest, mockResponse);
        expect(statusCode).toBe(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal Server Error',
        });
    });
});

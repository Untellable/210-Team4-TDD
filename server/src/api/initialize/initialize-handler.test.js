import { jest } from '@jest/globals';
import accountInitializeHandler from './initialize-handler.js';
import { accountInitializeService } from '../../service/initialize/initialize-service.js';

jest.mock('../../fediverse/fediverse-api-factory');
jest.mock('../../service/initialize/initialize-service.js');
jest.mock('../../db/dao.js');
jest.mock('gun');

describe('accountInitializeHandler', () => {
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
        mockRequest = { params: {} };
    });

    test('should return 400 if id is missing', async () => {
        await accountInitializeHandler(mockRequest, mockResponse);
        expect(statusCode).toBe(400);
        expect(responseJson.error).toBe(
            'Account ID is required as a path parameter.'
        );
    });

    test('should return 404 if account not found', async () => {
        mockRequest.params.mainId = 'non_existing_id';
        mockRequest.query = {};

        // Mock the accountInitializeService to return data with empty accountInfoList
        accountInitializeService.mockResolvedValue([]);

        await accountInitializeHandler(mockRequest, mockResponse);

        expect(statusCode).toBe(404);
        expect(responseJson.error).toContain('Record not found for id:');
    });

    test('should return 500 if unexpected error', async () => {
        mockRequest.params.mainId = 'valid_id';
        mockRequest.query = {};

        // Mock the accountInitializeService to throw an error
        accountInitializeService.mockRejectedValue(
            new Error('Unexpected Error')
        );

        await accountInitializeHandler(mockRequest, mockResponse);

        expect(statusCode).toBe(500);
        expect(responseJson.error).toContain('Internal Server Error');
    });

    test('should return 200 if account found', async () => {
        mockRequest.params.mainId = 'valid_id';
        mockRequest.query = {};
        const mockAccountData = [
            {
                id: 'valid_id',
                username: 'valid_username',
                displayName: 'Valid User',
                following: ['valid_id', 'valid_id'],
            },
        ];

        await accountInitializeService.mockResolvedValue(mockAccountData);
        await accountInitializeHandler(mockRequest, mockResponse);

        expect(statusCode).toBe(200);
        expect(responseJson).toEqual(mockAccountData);
    });
});

import httpInstance from "../utils/http.js";
import MastodonAdapter from "./mastodon-adapter.js";

jest.mock("../utils/http.js", () => ({
    get: jest.fn()
}));

describe('MastodonAdapter', () => {
    let mastodonAdapter;

    beforeEach(() => {
        mastodonAdapter = new MastodonAdapter();
        mastodonAdapter.server = 'mastodon.social'; // Set the server for testing
    });

    it('should return an object with specific attributes if the account exists', async () => {
        const mockAcct = 'kkkkr@mastodon.social';
        const mockResponse = { data: {/* mock data structured like your success response */} };

        httpInstance.get.mockResolvedValue(mockResponse);

        const result = await mastodonAdapter.accountLookup(mockAcct);
        console.log("Result:", result);

        // Check for specific attributes
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('username');
        expect(result.data).toHaveProperty('display_name');
    });

    it('should return an object with an error attribute if the account does not exist', async () => {
        const mockAcct = 'nonexistentuser@mastodon.social';
        const mockError = { response: { data: { error: "Record not found" } } };

        httpInstance.get.mockRejectedValue(mockError);

        const result = await mastodonAdapter.accountLookup(mockAcct);

        // Check for the error attribute
        expect(result).toBeUndefined(); // Adjust based on your actual error handling
    });

});

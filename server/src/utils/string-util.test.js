import getServerName from './string-util.js'; // Adjust the path as needed

describe('getServerName function', () => {
    // Test for a valid account URL
    test('should correctly parse a valid account URL and return the server name', () => {
        const url = 'user@example.com';
        const expectedServerName = 'example.com';
        expect(getServerName(url)).toBe(expectedServerName);
    });

    // Test for an invalid account URL
    test('should throw an error for an invalid account URL', () => {
        const invalidUrl = 'invalid-url';
        expect(() => {
            getServerName(invalidUrl);
        }).toThrow();
    });
});
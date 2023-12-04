import { parseAccountUrl } from './string-util.js';

describe('parseAccountUrl test', () => {
    test('should correctly parse a valid account URL and return the server name', () => {
        const url = 'thomas@example.com';
        expect(parseAccountUrl(url)).toStrictEqual({
            username: 'thomas',
            server: 'example.com',
        });
    });

    test('should correctly parse an account URL starting with @ and return the server name', () => {
        const url = '@thomas@example.com';
        expect(parseAccountUrl(url)).toStrictEqual({
            username: 'thomas',
            server: 'example.com',
        });
    });

    test('should return null for an invalid account URL', () => {
        const invalidUrl = 'invalid-url';
        expect(parseAccountUrl(invalidUrl)).toBeNull();
    });
});

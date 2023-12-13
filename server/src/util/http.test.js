import MockAdapter from 'axios-mock-adapter';
import httpInstance from './http';

describe('HTTP Instance with Axios Retry', () => {
    let mock;
    let testUrl =
        'https://mastodon.social/api/v1/accounts/lookup?acct=thomasapowell@fosstodon.org';
    let consoleSpy;

    beforeEach(() => {
        mock = new MockAdapter(httpInstance);
        consoleSpy = jest.spyOn(console, 'log');
    });

    afterEach(() => {
        mock.restore();
        consoleSpy.mockRestore();
    });

    test('should retry on timeout', async () => {
        mock.onGet(testUrl).timeout();

        try {
            await httpInstance.get(testUrl);
        } catch (error) {
            expect(error.message).toMatch(/timeout of \d+ms exceeded/);
            const retryLogs = consoleSpy.mock.calls.filter(
                (call) => call[0] === 'retrying request due to timeout'
            );
            expect(retryLogs.length).toBe(3);
        }
    }, 20000);
});

/**
 * Performs an account lookup using the Mastodon API.
 *
 * @param {MastodonAPI} api - An instance of the MastodonAPI to perform the account lookup.
 * @param {string} accountUrl - The URL of the account to be looked up.
 * @returns {Promise<Object|null>} - Returns a Promise that resolves to the account data if found, or null if not found.
 *                                   If an error occurs, the Promise resolves to undefined and logs the error.
 */
export default async function accountLookupService(api, accountUrl) {
    try {
        const response = await api.accountLookup(accountUrl);
        if (response && response.data) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Error during account lookup:', error);
    }
}

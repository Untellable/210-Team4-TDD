/**
 * Parses an account URL to extract the username and server name.
 * The account URL should be in the format of "{username}@{server}" or "@{username}@{server}".
 * It first decodes the URL-encoded string, then removes the leading '@' if present,
 * and finally splits the string to extract the username and server.
 *
 * @param {string} accountUrl - The account URL in the specified format.
 * @return {null|object} - An object containing `username` and `server` if the format is correct, otherwise null.
 */
function parseAccountUrl(accountUrl) {
    accountUrl = decodeURIComponent(accountUrl); // Decode URL-encoded string

    // Remove the leading '@' if it's there
    if (accountUrl.startsWith('@')) {
        accountUrl = accountUrl.substring(1);
    }

    // Split the string at '@' and get the server name
    const parts = accountUrl.split('@');
    if (parts.length === 2) {
        return {
            username: parts[0],
            server: parts[1],
        };
    } else {
        return null;
    }
}

export { parseAccountUrl };

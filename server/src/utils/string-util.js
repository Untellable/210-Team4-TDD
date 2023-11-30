/**
 * Parse account url to get server name
 * @param accountUrl in the format of {username}@{server} or @{username}@{server}
 * @return {null|string}
 */
export default function getServerName(accountUrl) {
    // Decode URL-encoded string
    accountUrl = decodeURIComponent(accountUrl);

    // Remove the leading '@' if it's there
    if (accountUrl.startsWith('@')) {
        accountUrl = accountUrl.substring(1);
    }

    // Split the string at '@' and get the server name
    const parts = accountUrl.split('@');
    if (parts.length === 2) {
        return parts[1];
    } else {
        throw new Error('Invalid account url provided');
    }
}
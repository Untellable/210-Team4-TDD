import { parseAccountUrl } from '../../util/string-util.js';
import accountLookupService from '../../service/lookup/lookup-service.js';
import FediverseAPIFactory from '../../fediverse/fediverse-api-factory.js';

/**
 * Asynchronous route handler for looking up a user account in the Fediverse network.
 * It parses the account URL from the query parameters, validates it, and then uses the Fediverse API to look up account details.
 * If the account is found, it returns the account information; otherwise, it sends appropriate error responses.
 *
 * @param {object} req - The Express request object, containing the query parameter 'acct' representing the account URL.
 * @param {object} res - The Express response object, used to send back the lookup result or error messages.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export default async function accountLookupHandler(req, res) {
    const { acct } = req.query;
    if (!acct) {
        return res.status(400).json({
            error: 'Account ID (acct) is required as a query parameter.',
        });
    }

    const account = parseAccountUrl(acct);
    if (!account) {
        return res.status(400).json({
            error: `Invalid account url: ${acct}`,
        });
    }

    const { username, server } = account;
    try {
        const api = FediverseAPIFactory.createAdapter();
        const accountInfo = await accountLookupService(api, acct);
        if (accountInfo) {
            res.json(accountInfo);
        } else {
            res.status(404).json({
                error: `Account not found for user: ${username}`,
            });
        }
    } catch (error) {
        console.error('Unexpected error during account lookup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

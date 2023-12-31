import { accountInitializeService } from '../../service/initialize/initialize-service.js';
import FediverseAPIFactory from '../../fediverse/fediverse-api-factory.js';

/**
 * Asynchronous route handler for retrieving initialization data of a user account in the Fediverse network.
 * It parses the account URL from the query parameters, validates it, and then uses the Fediverse API to get
 * the account details with its following and followers.
 * If the account is found, it returns the graph data (following relation list and account info list);
 * otherwise, it sends appropriate error responses.
 *
 * @param {object} req - The Express request object, containing the path parameter 'id' representing the account id.
 * @param {object} res - The Express response object, used to send back the initialize result or error messages.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export default async function accountInitializeHandler(req, res) {
    const { mainId } = req.params;

    if (!mainId) {
        return res.status(400).json({
            error: 'Account ID is required as a path parameter.',
        });
    }

    try {
        // Server is unknown given the id, create an adapter with default server
        const api = FediverseAPIFactory.createAdapter();
        const accountInfoList = await accountInitializeService(
            api,
            mainId,
            req.query['maxNodes'],
            req.query['nodeRank'],
            req.query['locality']
        );

        if (accountInfoList.length > 0) {
            res.status(200).json(accountInfoList);
        } else {
            res.status(404).json({
                error: `Record not found for id: ${mainId}`,
            });
        }
    } catch (error) {
        console.error('Unexpected error during account initialize:', error);
        res.status(500).json({
            error: `Internal Server Error: ${error?.message}`,
        });
    }
}

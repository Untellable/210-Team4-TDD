import express from 'express';

const router = express.Router();
import {
    accountLookupService,
    getAccountInitializeService
} from '../services/accountService.js';
import e from "express";

router.get('/', (res) => {
    res.json({ message: 'Home' });
});

/**
 *  @swagger
 *  /api/v1/account/{id}/initialize:
 *      get:
 *        description: Get all necessary account data for a specified account.
 *        parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The unique identifier of the account.
 *            example: "109252111498807689"
 *        responses:
 *          200:
 *            description: A successful response containing account data.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    relations:
 *                      type: object
 *                      additionalProperties:
 *                        type: array
 *                        items:
 *                          type: string
 *                      description: A map of account relationships, showing connections between various accounts.
 *                    accountInfoList:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: Unique identifier of the account.
 *                          username:
 *                            type: string
 *                            description: Username of the account.
 *                          display_name:
 *                            type: string
 *                            description: Display name of the account.
 *                          following_count:
 *                            type: integer
 *                            description: Number of accounts this account is following.
 *                          followers_count:
 *                            type: integer
 *                            description: Number of followers this account has.
 *                          statuses_count:
 *                            type: integer
 *                            description: Number of statuses posted by this account.
 *                      description: A list containing information for each account.
 */
router.get('/account/:id/initialize', function (req, res) {
    const { id } = req.params;

    getAccountInitializeService(id)
        .then(function (data) {
            console.log('Data received:', data);
            res.status(200).json(data);
        })
        .catch(function (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        });
});

/**
 *  @swagger
 *  /api/v1/account/lookup:
 *    get:
 *      description: Get account data by looking up username
 *      parameters:
 *       - in: query
 *         name: acct
 *         required: true
 *         schema:
 *           type: string
 *         description: username@server
 *         example: "thomasapowell@fosstodon.org"
 *      responses:
 *          200:
 *              description: A successful response
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      accountInfo:
 *                        type: object
 */
router.get('/account/lookup', async function (req, res) {
    const { acct } = req.query;
    if (!acct) {
        return res.status(400).json({ error: 'Account ID (acct) is required as a query parameter.' });
    }

    try {
        const accountInfo = await accountLookupService(acct);
        if (accountInfo) {
            res.json(accountInfo);
        } else {
            // If accountInfo is null, it means account not found or an error occurred
            res.status(404).json({ error: 'Account not found.' });
        }
    } catch (error) {
        console.error('Unexpected error during account lookup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

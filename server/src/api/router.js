import express from 'express';

const router = express.Router();
import {
    accountLookupService,
    getAccountFollowingService,
    getAccountInfoService,
    getAccountFollowersService
} from '../services/accountService.js';
import e from "express";

router.get('/', (res) => {
    res.json({message: 'Home'});
});

/**
 *  @swagger
 *  /api/v1/account/{id}/initialize:
 *    get:
 *      description: Get all necessary account data
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Account ID
 *         example: "109252111498807689"
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
 *                      accountFollowers:
 *                        type: object
 *                      accountFollowing:
 *                        type: object
 */
router.get('/account/:id/initialize', (req, res) => {
    const {id} = req.params;
    const accountInfo = getAccountInfoService(id);
    const accountFollowers = getAccountFollowersService(id);
    const accountFollowing = getAccountFollowingService(id);
    Promise.all([accountInfo, accountFollowers, accountFollowing])
        .then(function (data) {
            res.json({
                accountInfo: data[0],
                // accountPosts: data[1],
                accountFollowers: data[1],
                accountFollowing: data[2],
            });
        })
        .catch(function (error) {
            res.json(error);
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
    const {acct} = req.query;
    if (!acct) {
        return res.status(400).json({error: 'Account ID (acct) is required as a query parameter.'});
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

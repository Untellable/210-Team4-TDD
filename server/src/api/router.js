import express from 'express';
import accountLookupHandler from './lookup/lookup-handler.js';
import accountInitializeHandler from './initialize/initialize-handler.js';

const router = express.Router();

/**
 *  @swagger
 *  /api/v1/account/{mainId}/initialize:
 *      get:
 *        description: Get a list of node information and connections around the given main node.
 *        parameters:
 *          - in: path
 *            name: mainId
 *            required: true
 *            type: string
 *            description: The unique identifier of the main node account.
 *            example: "109252111498807689"
 *          - in: query
 *            name: maxNodes
 *            required: false
 *            type: integer
 *            description: Max number of account nodes to return.
 *            example: 10
 *          - in: query
 *            name: nodeRank
 *            required: false
 *            type: string
 *            description: Account parameter to rank based on. Only nodes with a high rank will be selected.
 *            example: "followers"
 *            enum:
 *              - followers
 *              - posts
 *              - random
 *          - in: query
 *            name: locality
 *            required: false
 *            type: integer
 *            description: Strength of preference for nodes closer to the main node. Node priority = nodeRank value / locality^depth.
 *            example: 2
 *        responses:
 *          200:
 *            description: A successful response containing account data.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: Unique identifier of the account.
 *                      username:
 *                        type: string
 *                        description: Username of the account.
 *                      display_name:
 *                        type: string
 *                        description: Display name of the account.
 *                      following_count:
 *                        type: integer
 *                        description: Number of accounts this account is following.
 *                      followers_count:
 *                        type: integer
 *                        description: Number of followers this account has.
 *                      statuses_count:
 *                        type: integer
 *                        description: Number of statuses posted by this account.
 *                      following:
 *                        type: array
 *                        items:
 *                          type: string
 *                        description: List of accounts in this list which this account follows.
 *                      depth:
 *                        type: integer
 *                        description: Estimated minimum path distance from the id account.
 *                      priority:
 *                        type: float
 *                        description: Priority assigned to this account based on ranking parameter, locality, and depth.
 *                  description: A list containing information for each account.
 */
router.get('/account/:mainId/initialize?', accountInitializeHandler);

/**
 *  @swagger
 *  /api/v1/account/lookup:
 *    get:
 *      tags: ['Account Services']
 *      description: Get account data by looking up username
 *      parameters:
 *       - in: query
 *         name: acct
 *         required: true
 *         schema:
 *           type: string
 *         description: accountUrl - can be in the format of either username@server or @username@server
 *         example: "thomasapowell@fosstodon.org"
 *      responses:
 *          200:
 *              description: Account found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      username:
 *                        type: string
 *                      display_name:
 *                        type: string
 *                      followers_count:
 *                        type: integer
 *                      following_count:
 *                        type: integer
 *                      statuses_count:
 *                        type: integer
 *                      created_at:
 *                        type: string
 *                        format: date-time
 *                      url:
 *                        type: string
 *                        format: uri
 *                      avatar:
 *                        type: string
 *                        format: uri
 *                      header:
 *                        type: string
 *                        format: uri
 *                      fields:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            name:
 *                              type: string
 *                            value:
 *                              type: string
 *                            verified_at:
 *                              type: string
 *                              format: date-time
 *          404:
 *              description: Account not found
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      error:
 *                        type: string
 *                        example: "Account not found."
 *          400:
 *              description: Account ID not provided
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      error:
 *                        type: string
 *                        example: "Account ID (acct) is required as a query parameter."
 */
router.get('/account/lookup', accountLookupHandler);

export default router;

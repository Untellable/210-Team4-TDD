import express from 'express';
import accountLookupHandler from './lookup/lookup-handler.js';
import accountInitializeHandler from './initialize/initialize-handler.js';

const router = express.Router();

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
router.get('/account/:id/initialize', accountInitializeHandler);

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

import express from 'express';

const router = express.Router();
import { getAccountFollowingService, getAccountInfoService, getAccountFollowersService } from '../services/accountService.js';

router.get('/', (res) => {
    res.json({ message: 'Home' });
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

export default router;

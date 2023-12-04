import express from 'express';

const router = express.Router();
import { getAccountFollowingService, getAccountInfoService, getAccountFollowersService, getAccountInitializeService } from '../services/accountService.js';
import { getPostListService, getPostDetailService } from '../services/postService.js';

/**
 * Home page
 */
router.get('/', function (req, res) {
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

router.get('/account/:id/initialize', function (req, res) {
    const { id } = req.params;

    getAccountInitializeService(id)
        .then(function (data) {
            console.log('Data received:', data);
            res.json(data);
        })
        .catch(function (error) {
            console.error('Error:', error);
            res.json(error);
        });
});

/**
 * @api {get} /account/:id Get account information
 */
router.get('/account/:id', function (req, res) {
    const { id } = req.params;
    getAccountInfoService(id)
        .then(function (accountInfo) {
            res.json(accountInfo);
        })
        .catch(function (error) {
            res.json(error);
        });
});

/**
 * Redirect any route starting with /account and ending with an id
 */
// router.get('/account/*/:id', function (req, res) {
//     console.log(`Redirecting ${req.originalUrl} to /account/${req.params.id}`);
//     const { id } = req.params;
//     res.redirect(`/api/v1/account/${id}`);
// });

/**
 * @api {get} /account/:id/followers Get account followers list
 */
router.get('/account/:id/followers', function (req, res) {
    const { id } = req.params;
    getAccountFollowersService(id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json(error);
        });
});

/**
 * @api {get} /account/:id/following Get account following list
 */
router.get('/account/:id/following', function (req, res) {
    const { id } = req.params;
    getAccountFollowingService(id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json(error);
        });
}
);


/*
    * @api {get} /account/:id/posts/list Get account post list
*/
router.get('/account/:id/post/list', function (req, res) {
    const { id, pid } = req.params;
    getPostListService(id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json(error);
        });
});

/*
    * @api {get} /account/:id/post/:pid Get account post detail
*/
router.get('/account/:id/post/:pid', function (req, res) {
    const { id, pid } = req.params;
    getPostDetailService(id, pid)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            res.json(error);
        });
});

export default router;

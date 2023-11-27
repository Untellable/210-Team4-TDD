import express from 'express';

const router = express.Router();
import { getAccountFollowingService, getAccountInfoService, getAccountPostsService, getAccountFollowersService } from '../services/accountService.js';
import { getPostListService, getPostDetailService } from '../services/postService.js';

/**
 * Home page
 */
router.get('/', (req, res) => {
    res.json({ message: 'Home' });
});

/**
 * Get all necessary account data
 * @api {get} /account/:id/initialize
 */
router.get('/account/:id/initialize', (req, res) => {
    const { id } = req.params;
    const accountInfo = getAccountInfoService(id);
    const accountPosts = getAccountPostsService(id);
    const accountFollowers = getAccountFollowersService(id);
    const accountFollowing = getAccountFollowingService(id);
    Promise.all([accountInfo, accountPosts, accountFollowers, accountFollowing])
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.json(error);
        });
}
);

/**
 * @api {get} /account/:id Get account information
 */
router.get('/account/:id', (req, res) => {
    const { id } = req.params;
    getAccountInfoService(id)
        .then(accountInfo => {
            res.json(accountInfo);
        })
        .catch(error => {
            res.json(error);
        });
});

/**
 * Redirect any route starting with /account and ending with an id
 */
router.get('/account/*/:id', (req, res) => {
    console.log(`Redirecting ${req.originalUrl} to /account/${req.params.id}`);
    const { id } = req.params;
    res.redirect(`/api/v1/account/${id}`);
});

/**
 * @api {get} /account/:id/followers Get account followers list
 */
router.get('/account/:id/followers', (req, res) => {
    const { id } = req.params;
    getAccountFollowersService(id)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

/**
 * @api {get} /account/:id/following Get account following list
 */
router.get('/account/:id/following', (req, res) => {
    const { id } = req.params;
    getAccountFollowingService(id)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
}
);


/*
    * @api {get} /account/:id/posts/list Get account post list
*/
router.get('/account/:id/post/list', (req, res) => {
    const { id, pid } = req.params;
    getPostListService(id)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

/*
    * @api {get} /account/:id/post/:pid Get account post detail
*/
router.get('/account/:id/post/:pid', (req, res) => {
    const { id, pid } = req.params;
    getPostDetailService(id, pid)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

export default router;

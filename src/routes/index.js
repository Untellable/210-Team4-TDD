const express = require('express');
const router = express.Router();
const { getAccountInfoService, getAccountPostsService, getAccountFollowersService } = require('@/service/accountService');
const { getPostListService, getPostDetailService } = require('../service/postService');

/**
 * Home page
 */
router.get('/', (req, res) => {
    res.json({ message: 'Home' });
});

/**
 * @api {get} /account/:id Get account information
 */
router.get('/account/:id/info', (req, res) => {
    const { id } = req.params;
    getAccountInfoService(id)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

/**
 * @api {get} /account/:id/followers Get account post list
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

module.exports = router;

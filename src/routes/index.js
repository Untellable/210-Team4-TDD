const express = require('express');
const router = express.Router();
const gun = require('@/db/index.js');
const { getAccount } = require('@/api/account');
const { getPost } = require('@/api/post');

/**
 * Home page
 */
router.get('/', (req, res) => {
    res.json({ message: 'Home' });
});

/**
 * @api {get} /account/:id Get account statuses
 */
router.get('/account/:id', (req, res) => {
    const { id } = req.params;
    getAccount(id)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

router.get('/account/:id/post/:pid', (req, res) => {
    const { id, pid } = req.params;
    getPost(id, pid)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.json(error);
        });
});

module.exports = router;

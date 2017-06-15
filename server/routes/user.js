'use strict';
const user = require('../controllers/user.js');
const router = require('koa-router')();

router.get('/user/:id',user.getUser);
router.post('/user',user.loginUser);
router.post('/register', user.register);
router.post('/queryUsers',user.queryUsers);
router.post('/removeUser',user.removeUser);
router.post('/resetPass',user.resetPass);

module.exports = router;

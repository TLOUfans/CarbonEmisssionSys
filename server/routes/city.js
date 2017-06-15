'use strict';
const city = require('../controllers/city.js');
const router = require('koa-router')();

router.post('/listProjCity', city.listProjCity);
router.post('/addOriginCity', city.addOriginCity);
router.post('/listOriginCity', city.listOriginCity);
router.post('/delOriginCity', city.delOriginCity);
router.post('/updateOriginCity', city.updateOriginCity);

module.exports = router;

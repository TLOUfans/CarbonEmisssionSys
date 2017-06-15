'use strict';
const building = require('../controllers/building.js');
const router = require('koa-router')();

router.post('/building',building.uploadData);
router.post('/saveProject',building.saveProject);
router.post('/buildingList',building.buildingList);
router.post('/calcEmission',building.calcEmission);

module.exports = router;

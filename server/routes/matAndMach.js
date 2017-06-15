'use strict';

const matAndMach = require('../controllers/matAndMach');
const router = require('koa-router')();

router.post('/matAndMach',matAndMach.findByPage);
router.post('/upload',matAndMach.uploadData);
router.get('/downloadModelField',matAndMach.downloadModelField);
router.post('/saveFactor',matAndMach.saveFactor);

module.exports = router;

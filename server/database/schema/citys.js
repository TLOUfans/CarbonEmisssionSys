
'use strict';
let mongoogse = require('mongoose');

module.exports = new mongoogse.Schema({
  name: String, //项目所在城市
  location: String, //项目所在城市地理坐标
  origin: Array, //来源城市
  regDate: Date //录入日期
});

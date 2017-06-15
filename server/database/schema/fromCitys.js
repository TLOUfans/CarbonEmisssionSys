
'use strict';
let mongoogse = require('mongoose');

module.exports = new mongoogse.Schema({
  name: String, //源城市
  location: String, //源城市坐标
  projCity: String, //项目所在城市
  distance: Number, //距离
  regDate: Date, //录入日期
  no: String //序号
});

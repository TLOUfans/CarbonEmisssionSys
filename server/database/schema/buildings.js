'use strict';
let mongoogse = require('mongoose');

module.exports = new mongoogse.Schema({
  name: String, //名称
  regDate: Date, //录入日期
  regHumId: String, //录入人id
  regHumName: String, //录入人
  type: Array, //建筑类型
  address: String, //建筑位置,
  areas: String,  //建筑区域,
  year: Number, //使用年限
  households: Number //户数
});

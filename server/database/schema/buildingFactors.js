'use strict';
let mongoogse = require('mongoose');

module.exports = new mongoogse.Schema({
  code: String, //编码
  name: String, //名称
  buildingId: String, //建筑id
  regDate: Date, //录入日期
  regHumId: String, //录入人id
  regHumName: String, //录入人
  spec: String, //规格型号
  unit: String, //单位
  amount: String //数量
});

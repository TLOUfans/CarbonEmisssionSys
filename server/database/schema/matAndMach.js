'use strict';
let mongoogse = require('mongoose');

module.exports = new mongoogse.Schema({
  code: String,  //编码
  factorName: String, //因子名称
  factorUnit: String, //因子单位
  Spec: String, //规格型号
  type: String, //类型(材料或者机械)
  recoveryNum: Number, //回收系数
  replacementLife: Number, //更换年限
  carbonEmissionNum: Number, //碳排放系数
  from: String, //来源
  year: Number, //年份
  regDate: Date,
  updDate: Date,
  regHumName: String,
  regHumId: String,
  updHumName: String,
  updHumId: String
});

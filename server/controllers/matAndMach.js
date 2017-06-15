'use strict';

const model = require('../database/model.js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const xlsx = require('node-xlsx');
const asyncBusboy = require('async-busboy');
const fs = require('fs');
const send = require('koa-send');
let path = require('path');

let matAndMach = model('matAndMach');

//分页查询
const findByPage = async function (ctx) {
  const _index = ctx.request.body.__index || 1;
  const _size = ctx.request.body.__size || 5;
  let filter = {};
  _.forEach(ctx.request.body, (v, k) => {
    if (!v) return;
    switch (typeof v) {
      case "string":
        filter[k] = {$regex: new RegExp(v, 'i')};
        break;
      case "object":
        if (v[0] && v[1]) {
          filter[k] = {"$gt": v[0]};
          filter[k] = {"$lt": v[1]};
        }
        break;
    }
  });
  const result = await matAndMach.findByPage(_index, _size, filter, {});
  ctx.body = result;
}

//插入单条数据
const insert = async function (ctx) {
  const data = ctx.request.body;
  //参数非空判断
  if (!data.code && !data.code) {
    ctx.body = {
      success: false,
      info: '编号不能为空'
    }
  }

  //判断是否已存在相同编号
  const sameCodeData = await matAndMach.findOne({code: data.code});
  if (sameCodeData) {
    ctx.body = {
      success: false,
      info: `已有相同编号'${sameCodeData.code}'`
    }
  }
  //验证通过
  else {
    let insertItem = new matAndMach(data);
    const insertResult = await  insertItem.save().catch(err => err);
    ctx.body = {
      success: true,
      info: insertResult
    }
  }
}

const saveFactor = async function (ctx) {
  const data = ctx.request.body;
  if (!data) {
    ctx.body = {
      success: false,
      info: "参数不能为空"
    }
    return;
  }

  let saveStep = data.map(async function (v) {
    const sameCodeData = await matAndMach.findOne({code: v.code});
    if (sameCodeData) return new Promise(resolve => {
      resolve({success: false, info: `已有相同编号'${sameCodeData.code}'`,code:sameCodeData.code})
    });

    let insertItem = new matAndMach(v);
    return insertItem.save();
  });
  let info = await Promise.all(saveStep)
    .then(val => {
      let successList = [];
      let errorList = [];
      val.forEach( e => {
        if(String(e.success) === "false"){
          errorList.push(e);
        }
        else {
          successList.push({success: false, info: `编号:'${e.code}'，插入成功`,code: e.code})
        }
      });
      return {
        success: successList,
        error: errorList
      }
    })
    .catch(err => {
      return {
        success: false,
        info: err
      }
    });
  ctx.body = info;
}


const uploadData = async function (ctx) {
  const {files, fields} = await asyncBusboy(ctx.req);
  let uploadPath = __dirname + '/../../public/upload';
  let file = fs.readFileSync(files[0].path);
  let fileData = xlsx.parse(file);
  if (fileData[0] && fileData[0].data && fileData[0].data[0]) {
    let tmpData = fileData[0].data;
    let head = tmpData[0];
    let matchedField = {
      '回收系数': 'recoveryNum',
      '因子单位': 'factorUnit',
      '因子名称': 'factorName',
      '年份': 'year',
      '规格型号': 'spec',
      '材料还是机械': 'type',
      '来源': 'from',
      '碳排放系数': 'carbonEmissionNum',
      '编码': 'code'
    };
    head = head.map(v => matchedField[v]);
    tmpData.splice(0, 1);
    let data = tmpData.map(v => {
      let tmp = {};
      head.forEach((j, i) => tmp[j] = v[i]);
      tmp.regDate = new Date();
      return tmp;
    });
    ctx.body = {success: true, info: data};
  }
  else {
    ctx.body = {success: false, info: '导入的excel文件数据为空'};
  }
}

const downloadModelField = async function (ctx) {
  /*  try{
   let _path =  __dirname + `/碳排放因子库.xlsx`;
   let src = fs.createReadStream(_path);
   ctx.body = src;
   } catch (err) {
   console.log(err);
   }*/
  await  send(ctx, `/public/碳排放因子库.xlsx`, __dirname + `/碳排放因子库.xlsx`);
}

module.exports = {
  findByPage,
  insert,
  uploadData,
  downloadModelField,
  saveFactor
}

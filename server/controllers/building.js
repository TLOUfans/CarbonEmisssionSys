'use strict';

const model = require('../database/model.js');
const jwt = require('jsonwebtoken');
const xlsx = require('node-xlsx');
const asyncBusboy = require('async-busboy');
const fs = require('fs');
const send = require('koa-send');
let path = require('path');

let building = model('buildings');
let buildingFactor = model('buildingFactors');
let matAndMach = model('matAndMach');

const uploadData = async function (ctx) {
  const {files, fields} = await asyncBusboy(ctx.req);
  let uploadPath = __dirname + '/../../public/upload';
  let file = fs.readFileSync(files[0].path);
  let fileData = xlsx.parse(file);
  if (fileData[0] && fileData[0].data && fileData[0].data[0]) {
    let tmpData = fileData[0].data || [];
    let header = {
      1: 'code',
      2: 'name',
      3: 'spec',
      5: 'unit',
      6: 'amount'
    };
    const data = tmpData.map(v => {
      if (!v[1] || !v[2] || v[1] == '编码' || v[2] == '名称') return false;
      let item = {};
      Object.keys(header).forEach(k => {
        const field = header[k];
        item[field] = v[Number(k)]
      });
      return item;
    }).filter(v => v);
    ctx.body = {success: true, info: data};
  }
  else {
    ctx.body = {success: false, info: '导入的excel文件数据为空'};
  }
}

let saveProject = async function (ctx) {
  const data = ctx.request.body;
  if (!data || !data.building || !data.buildingFactor) {
    ctx.body = {
      success: false,
      info: "请填入所有必填项"
    }
    return;
  }
  data.building.regHumId = ctx.session.user.id;
  data.building.regHumName = ctx.session.user.name;
  data.building.regDate = new Date();
  const buildSaveResult = await new building(data.building).save();
  if (!buildSaveResult.id) {
    ctx.body = {
      success: false,
      info: "保存失败请重试！"
    }
    return;
  }
  ;

  let info = await Promise.all(data.buildingFactor.map(async function (v) {
    v.buildingId = buildSaveResult.id;
    return new buildingFactor(v).save()
  })).then(val => val).catch(err => err);

  ctx.body = {
    success: true,
    info: info
  }
}

let buildingList = async function (ctx) {
  let buildingList = await building.find({regHumId: ctx.session.user.id});
  ctx.body = {
    success: true,
    info: buildingList
  }
}

//计算碳排放信息
let calcEmission = async function (ctx) {
  //项目id
  let buildingId = ctx.request.body.id;
  if (!buildingId) {
    ctx.body = {
      success: false,
      info: '传入的id为空'
    }
    return;
  }

  //建筑项目因子信息
  let buildingFactorList = await buildingFactor.find({buildingId: buildingId});
  let codeList = buildingFactorList.map(v => v.code);

  //因子表信息
  let factorList = await matAndMach.find((err, val) => {
    return val.filter(v => {
      let item = codeList.filter(a => a.code == v.code).join('')
      return item;
    });
  });

  //建材生产阶段 碳排放计算
  let production = factorList
    .map(e => {
      let buildingfactor = buildingFactorList.filter(v => e.code == v.code)[0];
      if (!buildingfactor || e.type == '材') return 0;
      return Number(e.carbonEmissionNum || 0) * Number(buildingfactor.amount || 0);
    })
    .reduce((a, b) => a + b);

  //施工阶段
  let construction = factorList
    .map(e => {
      let buildingfactor = buildingFactorList.filter(v => e.code == v.code)[0];
      if (!buildingfactor || e.type == '机') return 0;
      return Number(e.carbonEmissionNum || 0) * Number(buildingfactor.amount || 0);
    })
    .reduce((a, b) => a + b);

  //拆除阶段
  let removed = construction/ 10 * 3;


  ctx.body = {
    success: true,
    info: {
      '建材生产阶段': production,
      '施工阶段': construction,
      '拆除阶段': removed
    }
  }


}

module.exports = {
  uploadData,
  saveProject,
  buildingList,
  calcEmission
}

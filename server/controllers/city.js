'use strict';

const model = require('../database/model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

let citys = model('citys');
let fromCitys = model('fromCitys');


//根据项目所在地区查找
const listOriginCity = async function (ctx) {
    const _index = ctx.request.body.__index || 1;
    const _size = ctx.request.body.__size || 100;
    let params = {};
    params.projCity = ctx.request.body.projCity;
    if(ctx.request.body.originCity) params.name = eval(`/${ctx.request.body.originCity}/`);
    if(ctx.request.body.ltDistance && ctx.request.body.gtDistance) {
      params.distance = {
        $gte: ctx.request.body.ltDistance,
        $lte: ctx.request.body.gtDistance
      }
    }
    if(ctx.request.body.ltDistance && !ctx.request.body.gtDistance) {
      params.distance = {
        $lt: ctx.request.body.ltDistance
      }
    }
    if(!ctx.request.body.ltDistance && ctx.request.body.gtDistance) {
      params.distance = {
        $gt: ctx.request.body.gtDistance
      }
    }
    const result = await fromCitys.findByPage(_index, _size, params, {});
    ctx.body = result;
}


//显示江苏省城市
const listProjCity = async function (ctx) {
    const result = await citys.find({}, {location:1, name: 1});
    ctx.body = result;
};

//添加城市信息
const addOriginCity = async function (ctx) {
    let name = ctx.request.body.name;
    let location = ctx.request.body.location;
    let distance = ctx.request.body.distance;
    let projCity = ctx.request.body.projCity;

    let addOriginCity = new fromCitys({
      name: name,
      location: location,
      distance: distance,
      projCity: projCity,
      regDate: new Date()
    });
      
    
    //判断是否已存在
    const sameNameCity = await fromCitys.findOne({name: name, projCity: projCity});
    if (sameNameCity) {
      ctx.body = {
        success: false,
        info: `当前城市已存在'${sameNameCity.name}'`
      }
    } else {
      const insertResult = await addOriginCity.save().catch(err => err);
      ctx.body = {
        success: true,
        info: insertResult
      }
    }
}

//删除城市信息
const delOriginCity = async function (ctx) {
    let _id = ctx.request.body._id;
    const delResult = await fromCitys.remove({
      _id: _id
    }).catch(err => err);
    ctx.body = {
      success: delResult ? true : false,
      info: delResult
    }
}

//修改城市城市信息
const updateOriginCity = async function (ctx) {
    let _id = ctx.request.body._id;
    let oldCity = ctx.request.body.oldCity;
    let updateCity = {
      name : ctx.request.body.name,
      location: ctx.request.body.location,
      distance: ctx.request.body.distance,
      projCity: ctx.request.body.projCity
    }
    let samefromCity = await fromCitys.findOne({name: updateCity.name, projCity: updateCity.projCity});
    if (samefromCity) {
      if(samefromCity.name != oldCity) {
          ctx.body = {
          success: false,
          info: `当前城市已存在'${samefromCity.name}'`
        }
      } else {
        const updateResult = await fromCitys.findByIdAndUpdate(_id, updateCity).catch(err => err);
        ctx.body = {
          success: true,
          info: updateResult
        }
      }
    } else {
      const updateResult = await fromCitys.findByIdAndUpdate(_id, updateCity).catch(err => err);
      ctx.body = {
        success: true,
        info: updateResult
      }
    }
}

module.exports = {
  listProjCity,
  addOriginCity,
  listOriginCity,
  delOriginCity,
  updateOriginCity
}
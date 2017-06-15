'use strict';

const model = require('../database/model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

let user = model('users');

//获取用户
const getUser = async function (ctx) {
  const id = ctx.params.id;
  if (!id) {
    ctx.body = {
      success: false,
      info: '用户id不能为空'
    }
  }
  else {
    const result = await user.findById(id);
    ctx.body = result;
  }
};

//删除用户
const removeUser = async function (ctx) {
  const id = ctx.request.body.id;
  if (!id) {
    ctx.body = {
      success: false,
      info: '用户id不能为空'
    }
  }
  else {
    const result = await user.findByIdAndRemove(id);
    if(result){
      ctx.body = {
        success: true,
        info: `成功删除账户${result.name || ""}:${result.code}`
      };
    }
    else{
      ctx.body = {
        success: false,
        info: '不存在此用户'
      }
    }
  }
}

//获取用户
const queryUsers = async function (ctx) {
  const _index = ctx.request.body.__index || 1;
  const _size = ctx.request.body.__size || 5;
  let filter = {};
  _.forEach(ctx.request.body,(v,k) => {
    if(!v) return;
    switch (typeof v){
      case "string":
        filter[k] = {$regex: new RegExp(v,'i') };
        break;
      case "object":
        if(v[0] && v[1]){
          filter[k] = {
            "$gte": v[0] ,
            "$lte": v[1]
          };
        }
        break;
    }
  });
  const result = await user.findByPage(_index,_size,filter,{});
  ctx.body = result;
}

//登陆
const loginUser = async function (ctx) {
  const data = ctx.request.body;
  const userInfo = await user.findOne({code: data.userCode});
  if (userInfo != null) {

    if (data.password != userInfo.password) {
      ctx.body = {
        success: false,
        info: '密码错误'
      }
    } else {
      const userToken = {
        name: userInfo.name,
        id: userInfo.id
      }
      const secret = 'power-nanjin';
      ctx.session.user = userToken;
      const token = jwt.sign(userToken, secret);
      ctx.body = {
        success: true,
        token: token
      }
    }

  } else {
    ctx.body = {
      success: false,
      info: '用户不存在'
    }
  }
}

//注册
const register = async function (ctx) {
  const data = ctx.request.body;
  //参数非空判断
  if (!data.code && !data.password) {
    ctx.body = {
      success: false,
      info: '用户名或者密码不能为空'
    }
  }

  //判断是否已存在相同用户名
  const sameCodeUser = await user.findOne({code: data.code});
  if (sameCodeUser) {
    ctx.body = {
      success: false,
      info: `已有相同用户名'${sameCodeUser.code}'`
    }
  }

  //验证通过
  else {
    let insertUser = new user({
      code: data.code,
      name: data.name,
      password: data.password,
      regDate: new Date()
    });
    const insertResult = await  insertUser.save().catch(err => err);
    ctx.body = {
      success: true,
      info: insertResult
    }
  }
}

//重置密码
const resetPass = async function (ctx) {
  const id = String(ctx.request.body.id);
  if(!id){
    ctx.body = {
      success: false,
      info: '用户id不能为空'
    }
  }
  else{
    const result = await user.findByIdAndUpdate(id,{password:'123456'});
    if(!result){
      ctx.body = {
        success: false,
        info: '未找到对应用户'
      }
    }
    else{
      ctx.body = {
        success: true,
        info: `已重置用户'${result.name}'的密码为:123456`
      }
    }
  }
}
module.exports = {
  getUser,
  loginUser,
  register,
  queryUsers,
  removeUser,
  resetPass
}

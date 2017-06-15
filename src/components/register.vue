<template>
  <el-form :model="registerInfo" label-position="top" ref="registerInfo" :rules="rules" label-width="80px"
           class="register-form">
    <i title="返回" @click="goBack" class="fa fa-2x fa-angle-double-left back-arrow"></i>
    <h2 class="title">用户注册</h2>
    <hr style="margin-top: -10px;margin-bottom:18px;border-color: #fff;">
    <el-form-item prop="name" label="姓名">
      <el-input v-model="registerInfo.name"></el-input>
    </el-form-item>
    <el-form-item prop="code" label="账户名称">
      <el-input v-model="registerInfo.code"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input type="password" v-model="registerInfo.password"></el-input>
    </el-form-item>
    <el-form-item prop="passwordReWrite" label="确认密码">
      <el-input type="password" v-model="registerInfo.passwordReWrite"></el-input>
    </el-form-item>
    <el-button @click.native.prevent="register" style="width: 100%;" type="primary">注册</el-button>
  </el-form>
</template>

<script>
  'use strict';
  import {register} from '../api/api';

  export default{
    data(){
      return {
        registerInfo: {
          code: '',
          password: '',
          name:'',
          passwordReWrite: ''
        },
        rules: {
          code: [
            {required: true, message: '账户名称不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          passwordReWrite: [
            {required: true, message: '重复密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      goBack(){
        this.$router.push({path: '/'});
      },
      async register(){
        const regInfo = this.registerInfo;
        this.$refs.registerInfo.validate((valid) => {
          if (!valid) return;
          if (regInfo.password != regInfo.passwordReWrite) {
            this.$message.error('两次输入密码不一致');
          }
          else {
              register({
                code: regInfo.code,
                password: regInfo.password,
                name: regInfo.name
              }).then((res) => {
                 if(res.success){
                     this.$message({
                       type: 'success',
                       message: '注册成功'
                     });
                     this.$router.push({path:'/'});
                 } else{
                     this.$message.error(res.info);
                 }
              });
          }
        });
        const registerInfo = this.registerInfo;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .register-form {
    width: 350px;
    margin-left:calc(50% - (350px/2));
    margin-top:100px;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    padding: 35px 35px 25px 35px;
    background: rgba(0,0,0,0.3);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 15px #020202;
    border-radius: 5px;
    .title {
      margin: 0px auto 20px auto;
      text-align: center;
      color: rgba(255,255,255,0.8);
      letter-spacing:2px;
    }
    .back-arrow {
      color: white;
      cursor: pointer;
    }
  }
</style>

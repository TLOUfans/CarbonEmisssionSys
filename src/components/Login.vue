<template>
  <el-form :model="formInfo" ref="formInfo" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">建筑全生命周期碳排放计算软件</h3>
    <el-form-item prop="userCode">
      <el-input type="text" @keyup.enter.native="login" v-model="formInfo.userCode" auto-complete="off"
                placeholder="账号"><i slot="append"
                                    class="fa fa-user-o"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="userPass">
      <el-input type="password" @keyup.enter.native="login" v-model="formInfo.userPass" auto-complete="off"
                placeholder="密码"><i slot="append"
                                    class="fa fa-asterisk"></i>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button style="width:100%;" type="primary" @click.native.prevent="login" :loading="loading">登陆</el-button>
    </el-form-item>
    <el-form-item class="tips">
      <a @click="register">注册</a>
      <a>忘记密码</a>
    </el-form-item>
  </el-form>
</template>

<script>
  'use strict';
  import {login} from '../api/api';
  export default {
    data () {
      return {
        loading: false,
        checked: false,
        formInfo: {
          userCode: '',
          userPass: ''
        },
        rules: {
          userCode: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          userPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login(){
        let userInfo = {
          userCode: this.formInfo.userCode,
          password: this.formInfo.userPass
        }
        this.$refs.formInfo.validate((valid) => {
          if (valid) {
            login(userInfo).then((res) => {
              if (res.success) {
                sessionStorage.setItem('token', res.token);
                this.$message({
                  type: 'success',
                  message: '登陆成功'
                });
                sessionStorage.setItem('user', JSON.stringify({name: userInfo.userCode}));
                this.$router.push({path: '/'});
              }
              else {
                this.$message.error(res.info);
                sessionStorage.setItem('token', null)
              }
            });
          }
        });
      },
      register(){
        this.$router.push({path: '/register'});
      }
    }
  }
</script>
<style lang="scss" scoped>

  .tips {
    text-align: right;
    color: #20a0ff;
    cursor: pointer;
    margin-bottom: 0;
    a {
      margin-left: 8px;
    }
  }
  .login-container {
    position:absolute;
    margin-top:200px;
    margin-left:calc(50% - (350px/2));
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,0.8);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 15px #e4e4e4;
    border-top: 4px solid #007fde;
    label.el-checkbox {
      margin-bottom: 10px;
    }
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>

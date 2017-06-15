<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="utils-bar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filter">
        <el-form-item>姓名</el-form-item>
        <el-form-item>
          <el-input v-model="filter.name" icon="close" @keyup.enter.native="getUsers" :on-icon-click="resetFilterName"
                    placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>账户名</el-form-item>
        <el-form-item>
          <el-input v-model="filter.code" icon="close" @keyup.enter.native="getUsers" :on-icon-click="resetFilterCode"
                    placeholder="账户名"></el-input>
        </el-form-item>
        <el-form-item>注册时间</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filter.regDate"
            type="daterange"
            align="right"
            placeholder="选择录入日期范围"
            :picker-options="pickerOption">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" max-height="600" :height="height" border highlight-current-row fit
              style="width: 100%;">
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名" sortable></el-table-column>
      <el-table-column prop="code" label="账户名" sortable></el-table-column>
      <el-table-column prop="regDate" label="注册时间" sortable :formatter="formatDate"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>
          <el-button type="danger" size="small" @click="delUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageIndexChange"
        :current-page="pageInfo.index"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-col>

  </section>
</template>

<script>
  import{queryUsers, removeUser, resetPass} from '../../api/api';

  export default{
    data(){
      return {
        height: '900',
        users: [],
        total: 0,
        pageInfo: {
          index: 1,
          size: 10
        },
        filter: {
          regDate: '',
          code: '',
          name: ''
        },
        pickerOption: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      }
    },
    methods: {
      formatDate(row, column){
        return row.regDate ? String(row.regDate).substr(0, 10) : "";
      },
      pageSizeChange(val){
        this.pageInfo.size = val;
        this.pageInfo.index = 0;
        this.getUsers();
      },
      pageIndexChange(val){
        this.pageInfo.index = val;
        this.getUsers();
      },
      resetFilterName(){
        this.filter.name = "";
        this.getUsers();
      },
      resetFilterCode(){
        this.filter.code = "";
        this.getUsers();
      },
      getUsers(){
        let params = this.filter;
        params.__index = this.pageInfo.index;
        params.__size = this.pageInfo.size;
        queryUsers(params).then((res) => {
          this.total = res.count;
          this.users = res.records;
        });
      },
      pageChanged(page){
        this.pageIndex = page;
      },
      resetPassword(row, column){
        resetPass({id: column._id}).then(res => {
          if (!res.success) this.$message.error(res.info);
          else {
            this.$message({
              type: 'success',
              message: res.info
            });
          }
        });
      },
      delUser(index, row){
        removeUser({id: row._id}).then((res) => {
          if (!res.success) {
            this.$message.error(res.info);
          }
          else {
            this.$message({
              type: 'success',
              message: res.info
            });
            this.pageInfo.index = 0;
            this.getUsers();
          }
        });
      }
    },
    mounted()
    {
      this.getUsers();
      this.height = document.getElementsByTagName("section")[0].offsetHeight - 230;
      const that = this;
      window.onresize = () => {
        that.height = document.getElementsByTagName("section")[0].offsetHeight - 230;
      }
    }
  }
</script>

<style scoped>

</style>

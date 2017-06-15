<template>
  <section>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="importVisible = true">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success">编辑</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger">删除</el-button>
      </el-form-item>
    </el-form>
    <default-table :data="grid.data" :height="grid.height"></default-table>
    <!--分页-begin-->
    <el-col :span="24" style="margin-top: 10px" >
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageIndexChange"
        :current-page="grid.pageInfo.index"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="grid.pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="grid.total">
      </el-pagination>
    </el-col>
    <!--分页-end-->

    <el-dialog title="导入因子表" size="full" :before-close="importGridClose" v-model="importVisible">
      <el-row :span="24" class="utils-bar">
        <el-button type="success" @click="eidtCheckedRow">编辑</el-button>
        <el-button type="danger" @click="removeCheckedRow">删除</el-button>
        <el-button type="primary" @click="editSubmit">保存</el-button>
        <el-button @click="downloadModel">下载模板</el-button>
      </el-row>
      <el-upload
        class="upload-demo"
        action="/factor/upload/"
        :on-preview="uploadPreview"
        :on-change="uploadChanged">
        <el-button>选择文件</el-button>
      </el-upload>
      <default-table :data="importGrid.data" :height="grid.height"
                     @on-checked-change="checkedRowChange"></default-table>
    </el-dialog>

    <el-dialog title="因子信息编辑" size="large" :show-close="true" v-model="editRow">
      <default-form v-for="row in editRowData" :key="row.id" :data="row"></default-form>
      <el-row class="tools-bar">
        <el-button type="primary" @click="editRow = false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
  'use strict';
  import {querfactor, downloadModelField, saveFactor} from '../../api/api';
  import {DefaultTable, DefaultForm} from './child/index'
  export default{
    data(){
      return {
        importVisible: false,
        editRow: false,
        editRowData: [],
        importGrid: {
          data: [],
          checkedData: []
        },
        grid: {
          height: 900,
          defaultWidth: '150',
          filter: {},
          total: 0,
          pageInfo: {
            index: 0,
            size: 10
          },
          columns: [
            {prop: 'code', label: '编号', sortable: true},
            {prop: 'factorName', label: '因子名称', sortable: true},
            {prop: 'factorUnit', label: '因子单位', sortable: true},
            {prop: 'spec', label: '规格型号', sortable: true},
            {prop: 'type', label: '类型', sortable: true, filters: [{text: "材", value: "材"}, {text: "机", value: "机"}]},
            {prop: 'recoveryNum', label: '回收系数', sortable: true},
            {prop: 'replacementLife', label: '更换年限', sortable: true},
            {prop: 'carbonEmissionNum', label: '碳排放系数', sortable: true},
            {prop: 'year', label: '年份', sortable: true},
            {
              prop: 'regDate', label: '录入时间', sortable: true,
              formatter: (row, column) => {
                return row.regDate ? String(row.regDate).substr(0, 10) : "";
              }
            }
          ],
          data: []
        }
      }
    },
    methods: {
      editRow(){
        console.log('asd');
      },
      downloadModel(){
        downloadModelField();
      },
      importGridClose(done){
        if (this.importGrid.data == "") {
          done();
          return;
        }

        this.$confirm('当前数据未保存,是否保存？')
          .then(_ => {
            this.grid.data = this.importGrid.data;
            this.importGrid.data = [];
            done();
          })
          .catch(_ => {
            done();
          });
      },
      filterTag(value, row) {
        debugger
        return row.tag === value;
      },
      uploadChanged(file){
        if (!file.response) return;
        let response = file.response;
        if (!response.success) {
          this.$message.error(response.info);
          return;
        }
        else {
          this.importGrid.data = response.info;
        }
      },
      uploadPreview(file){
        debugger
      },
      queryPages(){
        let params = this.grid.filter;
        params.__index = this.grid.pageInfo.index;
        params.__size = this.grid.pageInfo.size;
        querfactor(params).then((res) => {
          this.grid.data = res.records;
          this.grid.total = res.count;
        }).catch(err => {
          this.$message.error(err);
        })
      },
      pageSizeChange(val){
        this.grid.pageInfo.size = val;
        this.grid.pageInfo.index = 0;
        this.queryPages();
      },
      pageIndexChange(val){
        this.grid.pageInfo.index = val;
        this.queryPages();
      },
      eidtCheckedRow(){
        let checkedData = this.importGrid.checkedData;
        if (checkedData == "") {
          this.$message.warning("请先选择一行数据");
          return;
        }
        this.editRowData = checkedData.splice(0);
        this.editRow = true;
      },
      removeCheckedRow(){

        let checkedData = this.importGrid.checkedData;
        let data = this.importGrid.data;

        if (checkedData == "") {
          this.$message.warning("请先选择一行数据");
          return;
        }

        this.importGrid.data = data.filter(v => {
          return !checkedData.find(a => a.code == v.code)
        });

      },
      checkedRowChange(val){
        this.importGrid.checkedData = val.concat();
      },
      editSubmit(){
        let editRow = this.editRowData;
        this.importGrid.data = this.importGrid.data.map(v => {
          editRow.forEach(e => {
            if (e.code == v.code) {
              v = e;
            }
          });
          return v;
        });

        saveFactor(this.importGrid.data)
          .then(res => {
              let error = res.error.map( e => e.info).join(" \n ");
              let success = res.success.map( e => e.info).join(" \n ");
              debugger
              if(error.trim()) this.$message.error(error);
              if(success.trim()) this.$message.success(success);
          })
          .catch(err => {
              this.$message.error(err);
          })
        this.editRow = false;
      }
    },
    mounted(){
      this.queryPages();
      const section = document.getElementsByTagName("section")[0];
      if(section){
        this.grid.height = section.offsetHeight - 180;
        const that = this;
        window.onresize = () => {
          that.grid.height = section.offsetHeight - 180;
        }
      }
    },
    components: {
      DefaultTable,
      DefaultForm
    }
  }
</script>
<style lang="scss">
  .tools-bar {
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    width: 100%;
    .el-button {
      margin-right: 12px;
      float: right;
    }
  }

  .section {
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    .el-table {
      .cell {
        display: block;
        word-break: keep-all;
        white-space: nowrap !important;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>

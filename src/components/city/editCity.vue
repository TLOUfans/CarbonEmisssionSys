<template>
  <el-row :gutter="12">
    <!--工具条-->
    <el-col :span="24" class="utils-bar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filter">
        <el-form-item>来源城市</el-form-item>
        <el-form-item>
          <el-input v-model="filter.originCity" icon="close" @keyup.enter.native="getCitys" :on-icon-click="resetFilterOriginCity"
            placeholder="来源城市"></el-input>
        </el-form-item>
        <el-form-item>距离</el-form-item>
        <el-form-item>
          <el-input v-model="filter.ltDistance" icon="close" @keyup.enter.native="getCitys" :on-icon-click="resetFilterLTDistance"
            placeholder="小于"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filter.gtDistance" icon="close" @keyup.enter.native="getCitys" :on-icon-click="resetFilterGTDistance"
            placeholder="大于"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getCitys">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-col :span="9">
      <el-table :data="toCitys" highlight-current-row @row-click="rowClick">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="projCity-table-expand">
              <el-form-item label="来源城市">
                <el-input icon="close" v-model="originCityInput[props.$index]" :index="props.$index" :on-icon-click="resetAddOriginCity"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目城市"></el-table-column>
        <el-table-column prop="location" label="地理坐标"></el-table-column>
        <el-table-column label="添加" align="center">
          <template scope="scope">
            <el-button size="small" @click="addOriginCity(scope.$index, scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="15">
      <el-table border :data="citys" @expand="expandRow">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="来源城市">
                <el-input icon="close" v-model="props.row.name" :index="props.$index" :on-icon-click="resetOriginCity" @focus="editInputFocus">
                </el-input>
              </el-form-item>
              <el-form-item label="坐标">
                <span>{{ props.row.location }}</span>
              </el-form-item>
              <el-form-item label="距离">
                <span>{{ props.row.distance }}</span>
              </el-form-item>
              <el-form-item label="项目所在城市">
                <span>{{ props.row.projCity }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="来源城市"></el-table-column>
        <el-table-column prop="location" label="坐标"></el-table-column>
        <el-table-column prop="distance" label="距离"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" type="success" @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.index" :page-sizes="[10, 15, 25, 50, 100]"
          :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
  import {
    listProjCity,
    addOriginCity,
    delOriginCity,
    updateOriginCity,
    listOriginCity,
    calcDistance
  } from '../../api/api'
  import {
    Loading
  } from 'element-ui'
  import {
    getCitys
  } from '../../utils'
  export default {
    data() {
      return {
        toCitys: [],
        citys: [],
        currentRow: '',
        total: 0,
        pageInfo: {
          index: 1,
          size: 10
        },
        filter: {
          originCity: '',
          ltDistance: '',
          gtDistance: ''
        },
        selectValue: '',
        allCitys: [],
        t: '',
        originCityInput: new Array(13),
        copyCitys: []
      }
    },
    methods: {
      rowClick(e) {
        this.currentRow = e.name;
        this.citys.length = 0;
        this.getCitys();
      },
      //添加来源城市
      addOriginCity(index, row) {
        getCitys().forEach((o, i) => {
          this.getAllCitys(o);
        });
        if (this.allCitys.indexOf(this.originCityInput[index]) == -1) {
          const h = this.$createElement;
          this.$notify({
            type: 'error',
            title: '错误',
            message: h('i', {
              style: 'color: teal'
            }, '您所输入的城市不存在')
          });
          // this.originCityInput[index] = '';
          this.$set(this.originCityInput, index, '');
          return;
        }
        calcDistance({
          toCity: this.currentRow || this.toCitys[0].name,
          fromCitys: [this.originCityInput[index]]
        }).then(result => {
          addOriginCity({
            name: result[0].split("|")[2],
            location: result[0].split("|")[1],
            distance: result[0].split("|")[0],
            projCity: row.name
          }).then(res => {
            const h = this.$createElement;
            if (res.success) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: h('i', {
                  style: 'color: teal'
                }, '成功添加来源城市')
              });
              this.$set(this.originCityInput, index, '');
              this.getCitys();
            } else {
              this.$notify({
                type: 'error',
                title: '错误',
                message: h('i', {
                  style: 'color: teal'
                }, res.info)
              });
              this.$set(this.originCityInput, index, '');
            }
          });
        });
      },
      //分页每页显示数量改变
      handleSizeChange(val) {
        this.pageInfo.size = val;
        this.getCitys();
      },
      //分页页码改变
      handleCurrentChange(val) {
        this.pageInfo.index = val;
        this.getCitys();
      },
      //重置源城市条件
      resetFilterOriginCity() {
        this.filter.originCity = "";
        this.getCitys();
      },
      //重置距离条件
      resetFilterLTDistance() {
        this.filter.ltDistance = "";
        this.getCitys();
      },
      //重置距离条件
      resetFilterGTDistance() {
        this.filter.gtDistance = "";
        this.getCitys();
      },
      //编辑输入框获取焦点时
      editInputFocus(e) {},
      //修改后保存
      handleSave(index, row) {
        getCitys().forEach((o, i) => {
          this.getAllCitys(o);
        });
        if (this.allCitys.indexOf(row.name) == -1) {
          const h = this.$createElement;
          this.$notify({
            type: 'error',
            title: '错误',
            message: h('i', {
              style: 'color: teal'
            }, '您所输入的城市不存在')
          });
          this.citys[index].name = this.copyCitys[index].name
          return;
        }
        calcDistance({
          toCity: this.currentRow || this.toCitys[0].name,
          fromCitys: [row.name]
        }).then(result => {
          updateOriginCity({
            _id: row._id,
            name: row.name,
            distance: result[0].split("|")[0],
            location: result[0].split("|")[1],
            projCity: row.projCity,
            oldCity: this.copyCitys[index].name
          }).then(res => {
            const h = this.$createElement;
            if (res.success) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: h('i', {
                  style: 'color: teal'
                }, '修改来源城市成功')
              });
              this.citys[index].distance = result[0].split("|")[0];
              this.citys[index].location = result[0].split("|")[1];
            } else {
              this.$notify({
                type: 'error',
                title: '失败',
                message: h('i', {
                  style: 'color: teal'
                }, res.info)
              });
              this.citys[index].name = this.copyCitys[index].name
            }
          });
        });
      },
      //删除
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delOriginCity({
            _id: row._id
          }).then(res => {
            const h = this.$createElement;
            if (res.success) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: h('i', {
                  style: 'color: teal'
                }, '删除来源城市成功')
              });
              this.getCitys();
            } else {
              this.$notify({
                type: 'error',
                title: '失败',
                message: h('i', {
                  style: 'color: teal'
                }, res.info)
              });
            }
            this.getCitys();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //重置来源城市
      resetOriginCity(event) {
        let index = event.currentTarget.parentElement.getAttribute("index");
        this.citys[index].name = this.copyCitys[index].name;
      },
      //重置添加来源城市输入框
      resetAddOriginCity(event) {
        let index = event.currentTarget.parentElement.getAttribute("index");
        this.$set(this.originCityInput, index, '');
      },
      //获取中国所有城市信息
      getAllCitys(obj) {
        this.allCitys.push(obj.label);
        if (!obj.children[0].children) {
          this.t = obj.label;
          obj.children.forEach((o, i) => {
            this.t += o.label;
            this.allCitys.push(this.t);
            this.t = obj.label;
          });
        } else {
          this.t = obj.label;
          obj.children.forEach((o, i) => {
            this.t += o.label;
            this.allCitys.push(this.t);
            o.children.forEach((o1, i1) => {
              this.t += o1.label;
              this.allCitys.push(this.t);
              this.t = obj.label + o.label;
            });
            this.t = obj.label;
          });
        }
      },
      expandRow(row, expanded) {

      },
      //获取源城市信息
      getCitys() {
        this.copyCitys.length = 0;
        let params = this.filter;
        params.__index = this.pageInfo.index;
        params.__size = this.pageInfo.size;
        params.projCity = this.currentRow || this.toCitys[0].name;
        listOriginCity(params).then(res => {
          this.citys = res.records;
          this.total = res.count;
          res.records.forEach((o, i) => {
            this.copyCitys.push(this.clone(o));
          });
        });
      },
      clone(obj) {
        var o;
        if (typeof obj == "object") {
          if (obj === null) {
            o = null;
          } else {
            if (obj instanceof Array) {
              o = [];
              for (var i = 0, len = obj.length; i < len; i++) {
                o.push(this.clone(obj[i]));
              }
            } else {
              o = {};
              for (var k in obj) {
                o[k] = this.clone(obj[k]);
              }
            }
          }
        } else {
          o = obj;
        }
        return o;
      }
    },
    mounted() {
      listProjCity().then(res => {
        this.toCitys = res;
        this.getCitys();
      });
    }
  }

</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 200px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 1000%;
  }

  .projCity-table-expand {
    font-size: 0;
  }

  .projCity-table-expand label {
    width: 78px;
    color: #99a9bf;
  }

  .projCity-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

</style>

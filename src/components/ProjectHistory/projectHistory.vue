<style type="text/css">
</style>
<template>
  <section>
    <el-row :gutter="12">
      <el-col :span="3">
        <el-tree
          class="filter-tree"
          :data="historyBuilding"
          :props="buildingProps"
          style="height: 600px;border: 0; border-right: 1px solid #d4d4d4;"
          @node-click="nodeClick"
          default-expand-all
          ref="tree2">
        </el-tree>
      </el-col>
      <el-col :span="21">
        <el-row :gutter="12">
          <el-col :span="item.size" :key="item.label" v-for="item in emissions" style="margin-bottom: 14px;">
            <el-card class="box-card">
              <i :class="item.icon" style="color:#82add3;"> {{item.label}}</i>
              <div style="padding: 6px;color:grey">
                <h4>
                  <span style="margin-right: 12px;">碳排放量：{{item.emission}}</span>
                  <span style="margin-right: 12px;"> 所占比例：{{item.proportion}}</span>
                </h4>
                <h4>单位面积碳排放：{{item.emissionAve}}</h4>
                <h4></h4>
              </div>
            </el-card>
          </el-col>
          <el-col>
            <el-card>
              <div id="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import {buildingList, calcEmission} from '../../api/api'
  export default{
    data(){
      return {
        historyBuilding: [],
        buildingProps: {
          children: 'children',
          label: 'name'
        },
        emissions: [
          {size: 12, label: '建材生产阶段', emission: 0, emissionAve: 0, proportion: 0, icon: 'fa fa-2x fa-wrench'},
          {size: 12, label: '运输阶段', emission: 0, emissionAve: 0, proportion: 0, icon: 'fa fa-2x fa-truck'},
          {size: 8, label: '施工阶段', emission: 0, emissionAve: 0, proportion: 0, icon: 'fa fa-2x fa-building'},
          {size: 8, label: '运营维护阶段', emission: 0, emissionAve: 0, proportion: 0, icon: 'fa fa-2x fa-university'},
          {size: 8, label: '拆除与回收阶段', emission: 0, emissionAve: 0, proportion: 0, icon: 'fa fa-2x fa-cubes'}
        ]
      }
    },
    methods: {
      loadBuilding(){
        buildingList()
          .then(res => {
            this.historyBuilding = res.info;
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      nodeClick(node){
          debugger
        calcEmission({id: node._id})
          .then(res => {
            this.emissions.forEach(v => {
              switch (v.label) {
                case '建材生产阶段':
                  v.emission = Number(res.info['建材生产阶段']).toFixed(2);
                  break;
                case '拆除与回收阶段':
                  v.emission = Number(res.info['拆除阶段']).toFixed(2);
                  break;
                case '施工阶段':
                  v.emission = Number(res.info['施工阶段']).toFixed(2);
                  break;
              }
            })
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    },
    created(){
      this.loadBuilding();
    }
  }
</script>

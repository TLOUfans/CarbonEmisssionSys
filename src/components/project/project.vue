<template>
  <section>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="success" @click="save">保存</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="checkData">数据校验</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="activeNames = ['1', '2', '3', '4']">展开</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="activeNames = []">收起</el-button>
      </el-form-item>
    </el-form>

    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          建筑基本信息 <i class="fa fa-building"></i>
        </template>
        <el-form :inline="true" label-position="top">
          <el-form-item label="建筑物名称" style="width: 100%;">
            <el-input v-model="building.name"></el-input>
          </el-form-item>
          <el-form-item label="建筑物类型">
            <el-cascader
              :options="buildingType"
              expand-trigger="hover"
              v-model="building.type"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="building.type.join('') == '居住建筑' " label="户数">
            <el-input-number v-model="building.households"></el-input-number>
          </el-form-item>
          <el-form-item label="建筑物位置">
            <el-select v-model="building.address">
              <el-option
                v-for="item in addressOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建筑物面积">
            <el-input-number v-model="building.areas" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="设计使用年限">
            <el-input-number v-model="building.year" :step="10"></el-input-number>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item class="padding-small" name="2">
        <template slot="title">
          人材机汇总表 <i class="fa fa-table"></i>
        </template>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="uploadBuildingExcel = true" size="small">导入</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="buildingFactor" @cell-click="factorCellCLick" style="width: 100%" border height="500">
          <el-table-column prop="code" label="编码"></el-table-column>
          <el-table-column prop="name" label="因子名称"></el-table-column>
          <el-table-column prop="spec" label="规格型号"></el-table-column>
          <el-table-column prop="unit" label="因子单位"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
          <el-table-column label="来源城市" width="250" class="city">
            <template scope="scope">
              <i class="fa fa-building" style="color:grey"></i>
              <span style="margin-left: 10px">{{ (scope.row.city || []).join(' / ') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distance" label="距离(米)"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="100">
            <template scope="scope">
              <el-button type="danger" @click="removeCurrentFator(scope.row)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          使用阶段详细数据(选填) <i class="fa fa-cogs"></i>
        </template>
        <el-form :inline="true" label-position="top">
          <el-form-item label="暖通空调系统年耗电量">
            <el-input-number v-model="buildingUsed.electric" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="暖通空调系统年其他能源消耗量" style="width: 30%;">
            <el-input placeholder="请输入内容" v-model="buildingUsed.otherPower" :step="100">
              <el-select v-model="buildingUsed.otherPowerType" slot="prepend" placeholder="请选择" style="width:90px;">
                <el-option label="天然气" value="天然气"></el-option>
                <el-option label="煤" value="煤"></el-option>
                <el-option label="油" value="油"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-switch
              v-model="buildingUsed.haveHotWater"
              :width="145"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="有生活热水系统"
              off-text="没有生活热水系统"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="生活热水年能源消耗量" v-show="buildingUsed.haveHotWater" style="width: 30%;">
            <el-input placeholder="请输入内容" v-model="buildingUsed.hotWaterUsedPowerType" :step="1000">
              <el-select v-model="buildingUsed.hotWaterUsedPower" slot="prepend" placeholder="请选择" style="width:90px;">
                <el-option label="电" value="电"></el-option>
                <el-option label="天然气" value="天然气"></el-option>
                <el-option label="煤" value="煤"></el-option>
                <el-option label="油" value="油"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="照明年耗电量">
            <el-input-number v-model="buildingUsed.lightUsedPower" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="太阳能生活热水系统提供能量">
            <el-input-number v-model="buildingUsed.solarHotWaterPower" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="光伏系统年发电量">
            <el-input-number v-model="buildingUsed.solarPower" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="风力发电系统年发电量">
            <el-input-number v-model="buildingUsed.windPower" :step="100"></el-input-number>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          拆除阶段机械汇总表（选填）<i class="fa fa-wrench"></i>
        </template>
        <el-table></el-table>
      </el-collapse-item>
    </el-collapse>

    <el-dialog v-model="showCityCascader" size="tiny">
      <el-cascader
        :options="cityOption"
        :props="{value:'label'}"
        v-model="cityCascader"
        @change="cityChecked"
        filterable
      >
      </el-cascader>
    </el-dialog>

    <el-dialog v-model="uploadBuildingExcel" size="tiny">
      <el-upload
        class="upload-demo"
        drag
        action="/build/building"
        :on-change="uploadChange"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过2M</div>
      </el-upload>
    </el-dialog>
  </section>
</template>
<script>
  import {saveProject, calcDistance} from '../../api/api'
  import {getCitys} from '../../utils'
  export default{
    data(){
      return {
        tableCurrentCity: [],
        //显示选择  来源城市  控件
        showCityCascader: false,
        //来源城市控件 绑定值
        cityCascader: [],
        uploadBuildingExcel: false,
        activeNames: ['1', '2', '3', '4'],
        currentFactor: {},
        //建筑基本信息
        building: {
          name: '',
          type: [],
          address: '',
          areas: '',
          year: '',
          households: 0
        },
        cityOption: [],
        //使用阶段详细数据
        buildingUsed: {
          electric: 0, //年耗电量
          otherPowerType: '',  //暖通空调系统年其他能源类型
          otherPower: 0, //暖通空调系统年其他能源消量
          haveHotWater: false, //是否有生活热水
          hotWaterUsedPowerType: '', //生活热水年能源消耗量类型
          hotWaterUsedPower: '', //生活热水年能源消耗量
          lightUsedPower: 0, //照明年耗电量
          solarHotWaterPower: 0, //太阳能生活热水系统提供能量
          solarPower: 0, //光伏系统年发电量
          windPower: 0 //风力发电系统年发电量
        },
        //人材机汇总表
        buildingFactor: [],
        addressOptions: [
          {value: '南京市', label: '南京市'},
          {value: '无锡市', label: '无锡市'},
          {value: '徐州市', label: '徐州市'},
          {value: '常州市', label: '常州市'},
          {value: '苏州市', label: '苏州市'},
          {value: '南通市', label: '南通市'},
          {value: '连云港市', label: '连云港市'},
          {value: '淮安市', label: '淮安市'},
          {value: '盐城市', label: '盐城市'},
          {value: '扬州市', label: '扬州市'},
          {value: '镇江市', label: '镇江市'},
          {value: '泰州市', label: '泰州市'},
          {value: '宿迁市', label: '宿迁市'}
        ],
        buildingType: [
          {
            value: '公共建筑',
            label: '公共建筑',
            children: [
              {value: '办公建筑', label: '办公建筑'},
              {value: '商场建筑', label: '商场建筑'},
              {value: '宾馆饭店建筑', label: '宾馆饭店建筑'},
              {value: '文化教育建筑', label: '文化教育建筑'},
              {value: '医疗卫生建筑', label: '医疗卫生建筑'},
              {value: '体育建筑', label: '体育建筑'},
              {value: '综合建筑', label: '综合建筑'},
              {value: '其他建筑', label: '其他建筑'}
            ]
          },
          {value: '居住建筑', label: '居住建筑'}]
      }
    },
    methods: {
      factorCellCLick(row, column, cell){
        this.currentFactor = row;
        this.cityCascader = row.city;
        if(column.label != "来源城市") return;
        this.showCityCascader = true;
      },
      showUpload(){
        this.uploadBuildingExcel = true;
      },
      removeCurrentFator(row){
        this.buildingFactor = this.buildingFactor.filter(v => v.code != row.code);
      },
      cityChecked(val){
        this.currentFactor.city = val;
        this.showCityCascader = false;
      },
      uploadChange(file){
        if (!file.response) return;
        let response = file.response;
        if (!response.success) {
          this.$message.error(response.info);
        }
        else {
          this.buildingFactor = response.info.map(v => {
            v.city = [];
            v.distance = "";
            return v
          })
          this.uploadBuildingExcel = false;
        }
      },
      checkData(){
        let cityObjs = {};
        let address = this.building.address;
        this.buildingFactor.forEach(function (v, i) {
          if (v.city == "") return;
          calcDistance({
            toCity: address,
            fromCitys: [v.city.join('')]
          })
            .then(val => {
              v.distance = val[0]
            })
        });
      },
      save(){
        const building = this.building;
        let required = Object.keys(this.building).map(v => this.building[v])
        let params = {building: this.building, buildingFactor: this.buildingFactor};
        saveProject(params)
          .then(res => {
            this.$router.push({path: '/projectHistory'});
          })
          .catch(err => {
            this.$message.error(err)
          });
      }
    },
    created(){
      this.cityOption = getCitys().map(v => {
        (v.children || []).children = "";
        return v
      });
    }
  }
</script>
<style lang="scss">
  .el-collapse-item.padding-small {
    .el-collapse-item__content {
      padding: 8px;
    }
    .el-button {
      margin-left: 12px;
    }
  }

  .el-form {
    .el-form-item {
      margin-bottom: 6px;
    }
  }
</style>

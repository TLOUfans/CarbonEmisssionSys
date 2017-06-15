<template>
  <section>
    <el-table :data="data" :height="height" border highlight-current-row fit style="width: 100%;">
      <el-table-column  type="expand">
        <template scope="props">
          <el-form label-position="left" inline>
            <el-form-item label="录入日期">
              <span>{{props.row.regDate.substr(0,10)}}</span>
            </el-form-item>
            <el-form-item label="来源">
              <span>{{props.row.from}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="code" label="编号"></el-table-column>
      <el-table-column prop="factorName" label="因子名称"></el-table-column>
      <el-table-column prop="factorUnit" label="因子单位"></el-table-column>
      <el-table-column prop="spec" label="规格型号"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="recoveryNum" align="right" label="回收系数"></el-table-column>
      <el-table-column prop="replacementLife" label="更换年限"></el-table-column>
      <el-table-column prop="carbonEmissionNum" align="right" label="碳排放系数"></el-table-column>
      <el-table-column prop="year" label="年份"></el-table-column>
    </el-table>
  </section>
</template>
<script>

  export default{
    data(){
      return {
          data:[{}],
          height: 600
      }
    }
  }
</script>

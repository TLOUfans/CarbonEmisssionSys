<template>
  <section>
    <el-row><hr style="margin-top: -6px;"></el-row>
    <el-form label-position="right" show-message :inline="true" label-width="80px" :model="data">
      <el-form-item label="编号" required	>
        <el-input v-model="data.code" ></el-input>
      </el-form-item>
      <el-form-item label="因子名称" required	>
        <el-input v-model="data.factorName"></el-input>
      </el-form-item>
      <el-form-item label="规格型号" 	>
        <el-input v-model="data.spec"></el-input>
      </el-form-item>
      <el-form-item label="类型" required	>
        <el-select v-model="data.type" placeholder="请选择类型">
          <el-option label="机" value="机"></el-option>
          <el-option label="材" value="材"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回收系数" required	>
        <el-input v-model="data.recoveryNum"></el-input>
      </el-form-item>
      <el-form-item label="更换年限"	>
        <el-input v-model="data.replacementLife" ></el-input>
      </el-form-item>
      <el-form-item label="碳排放系数" required	>
        <el-input v-model="data.carbonEmissionNum" ></el-input>
      </el-form-item>
      <el-form-item label="年份" required	>
        <el-input v-model="data.year"></el-input>
      </el-form-item>
      <el-row :gutter="2">
        <el-col :span="24" ><el-input v-model="data.from" placeholder="来源" class="text-from" type="textarea" ></el-input></el-col>
      </el-row>
    </el-form>
    <hr>
  </section>
</template>
<script>
  export default{
    name: 'default-form',
    data(){
        return {}
    },
    props: {
      data: {type: Object, default: () => {}}
    },
    method: {}
  }
</script>
<style lang="scss" scoped >
  .el-textarea textarea.el-textarea__inner{
    min-height:300px;
  }
</style>

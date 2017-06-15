<template>
  <section>
    <el-table :data="viewData"
              ref="multipleTable"
              @selection-change="checkedChange"
              :height="height"
              border highlight-current-row fit
              style="width: 100%;">
      <el-table-column
        tooltip-effect="dark"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline>
            <el-form-item label="录入日期">
              <span>{{props.row.regDate.substr(0, 10)}}</span>
            </el-form-item>
            <el-form-item label="来源">
              <span v-html="formatText(props.row.from)">{{formatText(props.row.from)}}</span>
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
  import DefaultForm from './DefaultForm.vue'
  export default{
    name: 'default-table',
    props: {
      data: {type: Array, default: () => []},
      checkedData: {type: Array, default: () => []},
      height: {type: Number, default: () => 600}
    },
    data(){
      return {
        checked: [],
        columns: ["code", "factorName", "factorUnit", "type", "recoveryNum", "carbonEmissionNum", "from", "year", "regDate", "spec"]
      }
    },
    methods: {
      editRow(index, row){
      },
      checkedChange(val){
        this.checked = val;
      },
      formatText(text){
        let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        text = text.replace(reg, `<a style="background-color: #13ce66;text-decoration:none;color: white;border-radius: 6px;padding: 0 8px 0 8px;" href='$1$2' target="_blank">$1$2</a>`).replace(/\n/g, "<br />");
        return text;
      },
      deleteRow(index, row){
        const __index = this.data.indexOf(row);
        this.data.splice(__index, 1);
      }
    },
    watch: {
      checked(val){
        this.$emit("on-checked-change", val);
      }
    },
    computed: {
      viewData: function () {
        const columns = this.columns;
        return this.data.map(v => {
          columns.forEach(e => {
            if (v[e] == undefined) v[e] = "";
          });
          return v;
        });
      }
    },
    components: {
      DefaultForm
    }
  }
</script>
<style lang="scss" scoped>
  .text-link {
    background-color: #42d885;
    color: white;
  }
</style>

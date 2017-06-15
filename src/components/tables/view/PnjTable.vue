<template>
  <section>

    <!--表格-begin-->
    <el-table :data="data" border style="width:100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        v-for="col in columns"
        :fixed="col.fixed"
        :key="col.prop"
        :width="(col.width)"
        :prop="col.prop"
        :formatter="col.formatter"
        :label="col.label"
        :sortable="col.sortable"
      >
      </el-table-column>
    </el-table>
    <!--表格-end-->

    <!--分页-begin-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageIndexChange"
        :current-page="pageInfo.index"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </el-col>
    <!--分页-end-->
  </section>

</template>
<script>
  export default{
    name: 'pnj-table',
    props: {
      columns: {type: Array, default: () => []},
      dataSource: {type: Array, default: () => []},
      pageInfo: {
        type: Object, default: () => {
          return {
            index: 1,
            size: 20,
            total: 0
          }
        }
      }
    },
    data() {
      return {}
    },
    methods:{
      pageSizeChange(val){
        this.pageInfo.size = val;
        this.pageInfo.index = 0;
      },
      pageIndexChange(val){
        this.pageInfo.index = val;
      }
    },
    computed: {
      data: function () {
        return this.dataSource;
      }
    }
  }
</script>

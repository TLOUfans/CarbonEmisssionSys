<template>
  <div id="app">
    <canvas id="canvas"></canvas>
    <router-view></router-view>
  </div>
</template>

<script>
  'use strict';
  export default {
    name: 'app'
  }
</script>


<style lang="scss">
  body {
    margin: 0px;
    padding: 0px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    #app {
      position: absolute;
      display: block;
      top: 0px;
      bottom: 0px;
      width: 100%;
      .body_content{
        position: absolute;
        top:30%;
        left: 20%;
        height: 20%;
        background: palevioletred;
        width: 20%;
      }
      #canvas {
        position: absolute;
        display: block;
        z-index:-9;
        overflow: hidden;
        width:100%;
        height:100%;
      }
      .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
      }

      .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
      }
      .toolbar {
        padding: 10px;
        //border:1px solid #dfe6ec;
        margin: 10px 0px;
        .el-form-item {
          margin-bottom: 10px;
        }
      }

      .fade-enter-active,
      .fade-leave-active {
        transition: all .2s ease;
      }

      .fade-enter,
      .fade-leave-active {
        opacity: 0;
      }
    }
  }


</style>

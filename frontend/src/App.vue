<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
export default {
  name: 'App',
  created() {
    echarts.use([TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);
  }
};
</script>

<style lang="css">
@import './assets/iconfont/iconfont.css';
</style>

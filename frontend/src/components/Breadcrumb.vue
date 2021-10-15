<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="'path' + index">
          <span v-if="item.redirect === 'noredirect' || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
          <RouterLink v-else :to="item.redirect || item.path">{{ item.meta.title }}</RouterLink>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const first = matched[0];
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
      }
      this.levelList = matched;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

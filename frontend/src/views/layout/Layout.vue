<template>
  <el-container class="common_main_container" :class="classObj">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <Sidebar class="sidebar-container" />
    </el-aside>
    <el-container class="main-container">
      <Navbar />
      <AppMain v-if="heightReadyFlag" />
    </el-container>
  </el-container>
</template>
<script>
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AppMain from './AppMain';
import { mapGetters } from 'vuex';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      heightReadyFlag: false
    };
  },
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      return !this.sidebar.opened;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  created() {},
  mounted() {
    this.autoHeight();
    this.changeHeight();
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    },
    autoHeight() {
      let layoutHeight;
      setTimeout(() => {
        // this.$autoHeight({
        //   target: '.app-main',
        //   offset: -50
        // });
        layoutHeight = this.$autoHeight({
          target: '.app-main',
          reference: '.main-container',
          offset: -110,
          returnValue: true
        });
      }, 500);
      setTimeout(() => {
        this.$store.dispatch('updateLayoutHeight', layoutHeight);
        this.heightReadyFlag = true;
      }, 1000);
    },
    changeHeight() {
      let that = this;
      window.onresize = () => {
        that.autoHeight();
      };
    }
  }
};
</script>

<style lang="scss" scoped>
// @import 'src/style/mixin.scss';
.el-aside {
  font-size: 0;
  transition: all 0.3s ease-in-out;
}
.common-main-contaner {
  //   @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

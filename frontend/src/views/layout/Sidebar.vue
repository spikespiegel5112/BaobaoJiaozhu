<template>
  <el-menu class="el-menu-vertical-demo" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
    <div class="menu_wrapper">
      <div v-for="(item, index) in routeData" :key="index">
        <div v-if="!item.hidden && item.children">
          <RouterLink v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="item.path + '/' + item.children[0].path" :key="item.children[0].name">
            <el-menu-item :index="item.path + '/' + item.children[0].path" :class="{ 'submenu-title-noDropdown': !isNest }">
              <span v-if="item.children[0].meta && item.children[0].meta.icon" class="icon" :class="item.children[0].meta.icon"></span>
              <label v-if="item.children[0].meta && item.children[0].meta.title" slot="title">
                {{ item.children[0].meta.title }}
              </label>
            </el-menu-item>
          </RouterLink>

          <el-submenu v-else :index="item.name || item.path" :key="item.name">
            <template slot="title">
              <span v-if="item.meta && item.meta.icon" class="icon" :class="item.meta.icon"></span>
              <label v-if="item.meta && item.meta.title && !isCollapse" slot="title">
                {{ item.meta.title }}
              </label>
            </template>

            <template v-for="child in item.children">
              <RouterLink :to="item.path + '/' + child.path" :key="child.name">
                <el-menu-item :index="item.path + '/' + child.path">
                  <span v-if="child.meta && child.meta.icon" class="icon" :class="child.meta.icon"></span>
                  <label v-if="child.meta && child.meta.title" slot="title">{{ child.meta.title }} </label>
                </el-menu-item>
              </RouterLink>
            </template>
          </el-submenu>
        </div>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
// import SidebarItem from './SidebarItem';

export default {
  props: {
    routes: {
      type: Array,
      default: () => {
        return [];
      },
      required: false
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  components: {
    // SidebarItem
  },
  data() {
    return {
      rawData: [],
      routeData: []
    };
  },
  mounted() {
    let result = [];
    // this.$router.options.routes.forEach((item, index) => {
    //   this.$set(result, index, item);
    // });
    this.routeData = result;
  },
  computed: {
    ...mapGetters(['sidebar']),
    // routes() {
    //   return this.$router.options.routes;
    // },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  watch: {
    isCollapse(value) {
      
      let result = [];
      this.$router.options.routes.forEach((item, index) => {
        this.$set(result, index, item);
      });
      this.routeData = result;
    }
  },
  mounted() {
    let result = [];
    this.$router.options.routes.forEach((item, index) => {
      this.$set(result, index, item);
    });
    this.routeData = result;
    this.wipeOutHiddenItem(result);
  },
  methods: {
    wipeOutHiddenItem(data) {
      let result = [];
      data.forEach((item1, index1) => {
        if (!item1.hidden) {
          result.push(item1);
          if (result[result.length - 1].children) {
            result[result.length - 1].children = result[result.length - 1].children.filter(item2 => !item2.hidden);
          }
        }
      });
      this.routerInner = result;
    },
    hasOneShowingChildren(children) {
      let showingChildren = [];
      children.forEach(item => {
        if (!item.hidden || item.hidden !== true) {
          showingChildren.push(item);
        }
      });
      return showingChildren.length === 1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';
.menu_wrapper {
  height: 100%;
}
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 240px;
// }
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar-container {
  height: 100%;
}
.el-menu {
  label {
    cursor: pointer;
  }
  .el-menu-item {
    label {
      padding: 0 0 0 5px;
    }
  }
  .el-submenu {
    .el-submenu__title {
      label {
        padding: 0 0 0 5px;
      }
    }
  }
}
.sidebar-container .nest-menu .el-submenu > .el-submenu__title,
.sidebar-container .el-submenu .el-menu-item {
  //   min-width: 180px !important;
  background-color: $subMenuBg !important;
  &:hover {
    background-color: $menuHover !important;
  }
}
.el-menu--collapse .el-menu .el-submenu {
  //   min-width: 180px !important;
}

/* 适配移动端 */
.mobile {
  //   .sidebar-container {
  //     transition: transform 0.28s;
  //     width: 180px !important;
  //   }
  //   &.hideSidebar {
  //     .sidebar-container {
  //       transition-duration: 0.3s;
  //       transform: translate3d(-180px, 0, 0);
  //     }
  //   }
}
</style>

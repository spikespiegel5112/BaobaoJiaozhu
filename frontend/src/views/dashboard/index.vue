<template>
  <div class="dashboard-container" :style="dashboardHeight">
    <div class="dashboard-text">name:{{nick_name}}</div>
    <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{role}}</span>
    </div>

    <div class="dashboard_calender_container">
      <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
          <p
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}</p>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  computed: {
    ...mapGetters(["nick_name", "roles"]),
    dashboardHeight() {
      return {
        height: this.$store.state.app.layoutHeight - 70 + "px"
      };
    }
  }
};
</script>

<style  lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

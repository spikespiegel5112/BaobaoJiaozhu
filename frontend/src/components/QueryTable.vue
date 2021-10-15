<template>
  <div class="common_querytable_wrapper">
    <div class="queryform_wrapper">
      <div class="outside">
        <el-form class="basearea">
          <ul class="pull-left">
            <li>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate" v-waves>新增</el-button>
            </li>
          </ul>
        </el-form>
        <ul class="operation_wrapper pull-right">
          <li>
            <div class="common_search_wrapper" @keyup.enter="search">
              <input v-model="queryModel.keyword" type="text" placeholder="请输入名称"/>
              <a>
                <span @click="search" class="el-icon-search"></span>
              </a>
            </div>
          </li>
          <li>
            <el-button size="mini" class="expand" type="text" @click='expand'>高级搜索<i class="el-icon-arrow-down"></i>
            </el-button>
          </li>
        </ul>
      </div>
      <div class="expandarea" :class="{active:expandQuery}">
        <el-form ref="form" :model="queryModel" size="mini" label-width="100px">
          <el-row>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" pull-right>
              <el-form-item class="pull-right">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search" v-waves>搜索
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset" v-waves>重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
</template>

<script>
	export default {
		name: "queryTable"
	}
</script>

<style scoped>

</style>

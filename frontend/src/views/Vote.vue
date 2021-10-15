<template>
  <el-row>
    <CommonQuery>
      <template slot="button1"> </template>
      <template slot="quicksearch">
        <div @keyup.enter="search" class="common_search_wrapper">
          <label>
            <input placeholder="请输入" type="text" v-model="queryModel.brandName" />
          </label>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>
    <el-table :data="tableList" :height="tableHeight" border element-loading-text="Loading" fit highlight-current-row v-loading.body="listLoading">
      <el-table-column align="center" fixed label="No" type="index" width="45"></el-table-column>
      <el-table-column align="center" label="投票名称" prop="title"></el-table-column>
      <el-table-column align="center" label="是否多选" prop="isMultiple">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isMultiple" active-color="#13ce66" inactive-color="#ff4949" disabled> </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleVote(scope)" size="mini" type="primary">
            投票
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common_pagination_wrapper">
      <el-pagination :current-page.sync="pagination.page" :page-size="pagination.limit" :page-sizes="[10, 20, 30, 50, 100]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" background layout="total, sizes, prev, pager, next, jumper"> </el-pagination>
    </div>
    <!-- 编辑 -->

    <!-- 投票 -->
    <!-- 456 -->
    <el-dialog title="投票" class="votedialog" :visible.sync="voteDialogVisible" top="5vh" :close-on-click-modal="false">
      <div class="main">
        <div class="checkbox">
          <el-checkbox-group v-model="formData.optionList">
            <el-checkbox v-for="(item, index) in votingOptionsList" :key="index" :label="item.title" @change="handleChooseVote($event, item, index)"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="votechart">
          <div id="main"></div>
        </div>
      </div>

      <div class="footer alignright">
        <el-button @click="voteDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { BarChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

export default {
  data() {
    return {
      getListByPaginationRequest: 'voting/getListByPagination',
      createOrUpdateRequest: 'voting/createOrUpdate',
      deleteItemsRequest: 'voting/deleteItems',
      getVotingOptionsRequest: 'voting/getVotingOptions',
      crawlerSettingFlag: false,
      crawlerSetting: {
        address: ''
      },
      dialogFormVisible: false,
      voteDialogVisible: false,
      chosenReward: '',
      chooseRewardTypeModel: {},
      chosenThirdPartyProductInfo: {},
      EChartsInstance: {},
      value2: '',
      value1: '',
      dailyLimitMode: '',
      limitMode: '',
      tableKey: 0,

      tableList: [],
      total: null,
      listLoading: true,
      availabilityFlag: false,
      queryModel: {
        sort: 'desc',
        brandName: ''
      },
      pagination: {
        page: 1,
        limit: 30
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      formData: {
        rewardType: '',
        crawlerAddress: ''
      },
      votingOptionsList: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      submitingFlag: false,
      formData: {
        optionList: []
      },
      currentVotingList: [],
      rules: {
        title: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        isMultiple: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      }
    };
  },
  computed: {
    tableHeight() {
      return this.$store.state.app.tableHeight;
    },
    dictionaryList() {
      return this.$store.state.app.dictionary.crawlerAddress;
    },
    dialogHeight() {
      return {
        height: '60vh'
      };
    }
  },
  watch: {
    effectiveDuration(value) {
      console.log(value);
      if (value === null) {
        value = [];
      }
      this.formData.startDate = this.$moment(value[0]).format('YYYY-MM-DD');
      this.formData.endDate = this.$moment(value[1]).format('YYYY-MM-DD');
    },
    currentAdvertisementTabIndex(value) {
      console.log(value);
    }
  },
  async mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.$baseUrl + this.getListByPaginationRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getListByPaginationRequest', response);
          this.tableList = response.data;
          this.total = response.pagination.total;
          this.listLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async initChart() {
      await this.$nextTick();
      echarts.use([BarChart, CanvasRenderer]);
      this.EChartsInstance = echarts.init(document.getElementById('main'));
      console.log(this.formData.optionList);
      this.setChartOption();
    },
    setChartOption() {
      const options = {
        grid: {
          top: '0',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          data: this.formData.optionList.map(item => item.title)
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            data: this.currentVotingList,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      this.EChartsInstance.setOption(options);
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getTableData();
    },

    async handleVote(scope) {
      this.voteDialogVisible = true;
      await this.getVotingOptions(scope);
      this.currentVotingList = this.votingOptionsList.map(item => 0);
      this.initChart();
    },
    getVotingOptions(scope) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$baseUrl + this.getVotingOptionsRequest, {
            params: {
              votingId: scope.row.id
            }
          })
          .then(response => {
            response = response.data;
            this.transformData(response);
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    expand() {
      this.expandQuery = !this.expandQuery;
    },
    search() {
      this.getTableData();
    },
    transformData(data) {
      data = data.map(item => {
        return {
          title: item.title,
          value: item.value
        };
      });
      this.votingOptionsList = data;
    },
    handleChooseVote(data, title, index) {
      const length = this.currentVotingList.length;
      if (typeof data === 'boolean') {
        if (data) {
          this.currentVotingList[length - index - 1]++;
        } else {
          this.currentVotingList[length - index - 1]--;
        }
      }

      this.setChartOption();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog_wrapper {
  height: 90vh;
  overflow: auto;
}
.votedialog {
  .main {
    display: flex;

    width: 100%;
    height: 100%;
    .checkbox {
      display: inline-block;
      width: 100px;
      height: 100%;
      vertical-align: middle;
    }
    .votechart {
      display: inline-block;
      flex: 1;
      vertical-align: middle;
      div {
        height: 100%;
        canvas {
          height: 100%;
        }
      }
    }
  }
}
</style>

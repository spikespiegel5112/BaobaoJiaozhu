<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button @click="handleCreate" icon="el-icon-plus" size="mini" type="primary" v-waves>
          添加投票
        </el-button>
        <el-button @click="handleMultipleDelete" icon="el-icon-delete" size="mini" type="danger" v-waves>
          批量删除
        </el-button>
      </template>
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
    <el-table :data="tableList" :height="tableHeight" @selection-change="handleSelectionChange" border element-loading-text="Loading" fit highlight-current-row v-loading.body="listLoading">
      <el-table-column fixed="left" type="selection" width="30"></el-table-column>
      <el-table-column align="center" fixed label="No" type="index" width="45"></el-table-column>
      <el-table-column align="center" label="投票名称" prop="title"></el-table-column>
      <el-table-column align="center" label="是否多选" prop="isMultiple">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isMultiple" active-color="#13ce66" inactive-color="#ff4949" disabled> </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope)" size="mini" type="primary">
            编辑
          </el-button>
          <el-button @click="handleVote(scope)" size="mini" type="primary">
            投票
          </el-button>
          <el-button @click="handleDelete(scope)" size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common_pagination_wrapper">
      <el-pagination :current-page.sync="pagination.page" :page-size="pagination.limit" :page-sizes="[10, 20, 30, 50, 100]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" background layout="total, sizes, prev, pager, next, jumper"> </el-pagination>
    </div>
    <!-- 编辑 -->
    <!-- 123 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" :close-on-click-modal="false">
      <el-form ref="formData" :model="formData" :rules="rules" label-position="right" label-width="80px" :style="dialogHeight" class="dialog_wrapper">
        <el-form-item label="投票名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="是否多选" prop="isMultiple">
          <el-switch v-model="formData.isMultiple" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <el-row>
          <el-col class="addselection alignright" :span="24">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAddOption">
              添加
            </el-button>
          </el-col>
        </el-row>
        <WhiteSpace />

        <div v-if="formData.optionList.length > 0">
          <el-form-item v-for="(item, index) in formData.optionList" :key="index" :label="'选项' + (index + 1)" prop="isMultiple">
            <el-input v-model="item.title">
              <template>
                <el-button v-if="formData.optionList.length > 0" type="success" icon="el-icon-delete" size="mini" slot="append" @click="handleDeleteOption(item, index)"> </el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-empty :image-size="100"></el-empty>
        </div>
      </el-form>
      <whiteSpace size="xl" />
      <div class="footer alignright">
        <el-button type="primary" :disabled="submitingFlag" @click="handleSubmit">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 投票 -->
    <!-- 456 -->
    <el-dialog title="投票" :visible.sync="voteDialogVisible" top="5vh" :close-on-click-modal="false">
      <el-checkbox-group v-model="currentVotingFormdata">
        <el-row v-for="(item, index) in currentVotingFormdata" :key="index">
          <el-col :span="4">
            <el-checkbox :label="item.title"></el-checkbox>
          </el-col>
          <el-col :span="20"> </el-col>
        </el-row>
      </el-checkbox-group>

      <div class="footer alignright">
        <el-button @click="voteDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
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
      currentVotingFormdata: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      submitingFlag: false,
      formData: {
        name: '',
        isMultiple: false,
        optionList: []
      },
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
    handleFilter() {
      this.pagination.page = 1;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getTableData();
    },

    createData() {
      this.formData.id = '';
      this.updateData();
    },
    handleSubmit() {
      this.$refs.formData
        .validate()
        .then(valid => {
          console.log(valid);
          console.log(this.formData);
          this.submitingFlag = true;

          this.$http
            .post(this.$baseUrl + this.createOrUpdateRequest, {
              ...this.formData
            })
            .then(response => {
              console.log(response);
              this.submitingFlag = false;
              this.$message.success('提交成功');
              this.dialogFormVisible = false;
              this.getTableData();
            })
            .catch(error => {
              console.log(error);
              this.submitingFlag = false;
              this.$message.error('提交失败');
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    async handleVote(scope) {
      this.voteDialogVisible = true;
      await this.getVotingOptions(scope);
      this.currentVotingFormdata = this.formData.optionList;
    },
    handleUpdate(scope) {
      console.log(scope);
      this.formData = {
        ...this.formData,
        ...scope.row
      };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.formData.id = scope.row.id;
      this.getVotingOptions(scope);
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate();
      });
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
            console.log('getVotingOptions++++++', response);
            response = response.data;
            this.formData.optionList = response;
            console.log('getVotingOptions++++++', this.formData.optionList);
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleMultipleDelete() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('this.multipleSelection+++++', this.multipleSelection);
          this.deleteRecord(
            this.multipleSelection.map(item => {
              return {
                id: item.id,
                movieId: item.movieId,
                timestamp: item.timestamp
              };
            })
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleDelete(scope) {
      console.log(scope);
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRecord({
            id: scope.row.id
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteRecord(params) {
      this.$http
        .delete(this.$baseUrl + this.deleteItemsRequest, {
          data: params
        })
        .then(response => {
          console.log(response);
          this.dialogFormVisible = false;
          this.$message.success('删除成功');
          this.getTableData();
        })
        .catch(error => {
          console.log(error);
          this.$message.error(`${error.response.status.toString()}  ${error.response.data.error}`);
        });
    },

    expand() {
      this.expandQuery = !this.expandQuery;
    },
    search() {
      this.getTableData();
    },
    reset() {
      this.queryModel.available = true;
    },

    uploadSuccess1(response) {
      console.log(response);
      this.formData.icon = response.url;
    },
    uploadSuccess2(response) {
      this.formData.rewardImage = response.url;
    },
    changeDailyLimitMode(data) {
      this.formData.dailyLimit = data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit;
    },
    changeLimitMode(data) {
      this.formData.limit = data.toString() === 'unlimited' ? '-1' : this.formData.limit;
      alert(this.formData.limit);
    },
    chooseRewardType(data) {
      this.formData.type = this.settingsList.filter(item => item.value === data)[0].code;
      this.formData.crawlerAddress = data;
    },
    chooseThirdPartyProduct(data) {
      this.chosenThirdPartyProductInfo = data;
    },
    confirmCrawlerSetting() {
      this.crawlerSettingFlag = false;
      this.$message.success('设置成功');
    },

    focusSortList(queryString, callback) {
      this.loading = true;

      // this.queryModel = Object.assign(this.queryModel, {
      //   limit: 999,
      //   page: 1,
      //   status: 1,
      //   title: '',
      //   description: '',
      //   gameTypeId: '',
      // });
      // console.log(this.queryModel)

      this.$http
        .get(this.$baseUrl + this.queryRewardProductByNameRequest, {
          params: {
            name: this.chosenReward
          }
        })
        .then(response => {
          console.log(response);
          this.loading = false;
          // this.total = response.total;
          let result = [];
          if (response.data.length !== 0) {
            response.data.forEach((item, index) => {
              result.push(
                Object.assign(item, {
                  value: item.name
                })
              );
            });

            console.log(111, result);

            callback(result);
          }
        });
    },

    handleCreate() {
      this.dialogFormVisible = true;
      this.dialogStatus = 'create';
    },
    handleAddOption() {
      this.formData.optionList.push({
        votingId: this.formData.id,
        title: '',
        description: ''
      });
    },
    handleDeleteOption(item, index) {
      this.formData.optionList.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog_wrapper {
  height: 90vh;
  overflow: auto;
}
</style>

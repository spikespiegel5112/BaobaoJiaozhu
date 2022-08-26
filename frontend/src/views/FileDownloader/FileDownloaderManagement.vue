<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="handleDownloadSingleFile"
          icon="el-icon-plus"
          size="mini"
          type="primary"
        >
          单文件下载
        </el-button>
        <el-button
          @click="handleDownloadSeriesFiles"
          icon="el-icon-plus"
          size="mini"
          type="primary"
        >
          序列文件下载
        </el-button>
        <el-button
          @click="handleMultipleDelete"
          icon="el-icon-delete"
          size="mini"
          type="danger"
        >
          批量删除
        </el-button>
      </template>
      <template slot="quicksearch">
        <div @keyup.enter="search" class="common_search_wrapper">
          <label>
            <input
              placeholder="请输入"
              type="text"
              v-model="queryModel.brandName"
            />
          </label>
          <a>
            <span @click="search" class="el-icon-search"></span>
          </a>
        </div>
      </template>
    </CommonQuery>
    <el-table
      class="common_table_wrapper"
      :data="tableList"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      v-loading.body="listLoading"
    >
      <el-table-column
        fixed="left"
        type="selection"
        width="30"
      ></el-table-column>
      <el-table-column
        align="center"
        fixed
        label="No"
        type="index"
        width="45"
      ></el-table-column>
      <el-table-column
        align="center"
        label="昵称"
        prop="nickName"
      ></el-table-column>
      <el-table-column align="center" label="E-mail" prop="email">
      </el-table-column>
      <el-table-column align="center" label="电话" prop="phone">
      </el-table-column>
      <el-table-column align="center" label="是否到期" prop="isExpire">
      </el-table-column>
      <el-table-column align="center" label="到期时间" prop="expireDate">
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="360">
        <template slot-scope="scope">
          <el-button
            @click="handleUpdateFanInfo(scope)"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
          >
            编辑基本信息
          </el-button>
          <el-button
            @click="handleAddPeriod(scope)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
          >
            录入时长
          </el-button>
          <el-button @click="handleDelete(scope)" size="mini" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common_pagination_wrapper">
      <el-pagination
        :current-page.sync="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <!-- 123 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible1"
      top="5vh"
      @close="handleCloseFansInfoDialog"
    >
      <el-row type="flex" justify="left">
        <el-col :span="12">
          <el-form
            ref="formData"
            :model="formData"
            :rules="rules"
            label-position="right"
            label-width="80px"
            class="dialog_wrapper"
          >
            <el-form-item label="粉丝昵称" prop="nickName">
              <el-input v-model="formData.nickName"></el-input>
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="formData.phone"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <whiteSpace size="xl" />
      <div class="footer alignright">
        <el-button
          type="primary"
          :disabled="submitingFlag"
          @click="handleSaveFan"
        >
          保存
        </el-button>
        <el-button @click="handleCloseFansInfoDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 时长录入 -->
    <!-- 456 -->
    <el-dialog
      title="时长录入"
      :visible.sync="dialogFormVisible2"
      @close="handleCloseRecordPeriod"
      top="5vh"
      width="1200px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formData2"
        :model="formData2"
        :rules="rules2"
        label-position="right"
        label-width="135px"
      >
        <el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件路径左半部分" prop="fileNameLeftSide">
                <el-input v-model="formData2.fileNameLeftSide"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件路径由半部分" prop="fileNameRightSide">
                <el-input v-model="formData2.fileNameRightSide"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="起始数字" prop="seriesNumberStart">
                <el-input v-model="formData2.seriesNumberStart"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束数字" prop="seriesNumberEnd">
                <el-input v-model="formData2.seriesNumberEnd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24"> </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <whiteSpace />
      <el-progress :percentage="percentage"></el-progress>
      <whiteSpace />

      <div class="footer alignright">
        <el-button @click="handleSaveDownloadInfo">保存信息</el-button>
        <el-button
          type="primary"
          :disabled="submitingFlag"
          @click="submitAddPeriod"
        >
          开始下载
        </el-button>
        <el-button @click="handleCloseRecordPeriod">关闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      getListByPaginationRequest: 'fans/getListByPagination',
      createOrUpdateRequest: 'fans/createOrUpdate',
      deleteItemsRequest: 'fans/deleteItems',
      addPeriodRequest: 'fans/addPeriod',
      getFansInfoRequest: 'fans/getFansInfo',
      getPeriodHistoryRequest: 'fans/getPeriodHistory',
      deletePeriodRequest: 'fans/deletePeriod',
      periodDictionary: [
        {
          title: '90天',
          name: '90days',
          value: 90
        },
        {
          title: '180天',
          name: '180days',
          value: 180
        },
        {
          title: '365天',
          name: '365days',
          value: 365
        }
      ],
      tableList: [],
      percentage: 0,
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
      currentVotingFormdata: [],
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      submitingFlag: false,
      formData: {
        nickName: '',
        email: '',
        phone: ''
      },
      rules: {
        fileNameLeftSide: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        fileNameRightSide: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberStart: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberEnd: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ]
      },
      formData2: {
        fileNameLeftSide: '',
        fileNameRightSide: '',
        seriesNumberStart: '',
        seriesNumberEnd: ''
      },
      rules2: {
        fileNameLeftSide: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        fileNameRightSide: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberStart: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberEnd: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ]
      },
      pagination2: {
        limit: 5,
        page: 1,
        total: 0
      },
      periodHistoryData: [],
      periodHistoryTableData: [],
      currentPickerData: null,
      storedExpireDate: null,
      defaultTime: null,
      lastExpireDateString: null,
      expireStatus: null
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
    },
    period() {
      return this.formData2.startDate;
    },
    pickerOptions() {
      const that = this;
      return {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '到期日后一天',
            onClick(picker) {
              // 先从最近到期日转成秒级时间戳，然后加一天，然后转成毫秒级，然后用new Date()转换成时间对象
              if (that.$isNotEmpty(that.lastExpireDateString)) {
                const theDayAfterLastExpireDayTimestamp =
                  that.$moment(that.lastExpireDateString).unix() + 24 * 3600;
                picker.$emit(
                  'pick',
                  new Date(theDayAfterLastExpireDayTimestamp * 1000)
                );
              }
            }
          }
        ],
        disabledDate: time => {
          const currentTimestamp = time.getTime() / 1000;
          return this.checkDateAvailable(currentTimestamp);
        }
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
    // 'formData2.startDate': {
    //   handler(value) {
    //     this.periodDictionary = this.periodDictionary.map(item => {
    //       return {
    //         ...item,
    //         disabled: this.$isEmpty(value)
    //       };
    //     });
    //   },
    // }
  },
  async mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.getListByPaginationRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getListByPaginationRequest', response);
          this.tableList = response.data;
          this.pagination.total = response.pagination.total;
          this.listLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkDateAvailable(timestamp) {
      let result = false;
      this.periodHistoryTableData.forEach(item => {
        const periodTimestamp = item.period * 24 * 3600;
        const endDateTimestamp = this.$moment(item.expireDate).unix();
        const startDateTimestamp = endDateTimestamp - periodTimestamp;
        if (
          startDateTimestamp < timestamp + 24 * 3600 &&
          endDateTimestamp > timestamp
        ) {
          result = true;
        }
      });
      return result;
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
    handleSizeChange2(val) {
      this.pagination2.limit = val;
      this.getPeriodHistory();
    },
    handleCurrentChange2(val) {
      this.pagination2.page = val;
      this.getPeriodHistory();
    },

    createData() {
      this.formData.id = '';
      this.updateData();
    },
    handleSaveFan() {
      this.$refs.formData
        .validate()
        .then(valid => {
          this.submitingFlag = true;
          console.log(this.formData);
          this.$http
            .post(this.createOrUpdateRequest, this.formData)
            .then(response => {
              console.log(response);
              this.submitingFlag = false;
              this.$message.success('提交成功');
              this.dialogFormVisible1 = false;
              this.getTableData();
            })
            .catch(error => {
              console.log(error);
              this.submitingFlag = false;
            });
        })
        .catch(error => {
          console.log(error);
        });
    },

    async handleUpdateFanInfo(scope) {
      this.dialogFormVisible1 = true;
      await this.$nextTick();
      console.log(scope);
      this.formData = {
        id: scope.row.id,
        email: scope.row.email,
        phone: scope.row.phone,
        nickName: scope.row.nickName
      };
      console.log(this.formData);

      this.dialogStatus = 'update';
      this.$refs.formData.clearValidate();
    },
    async handleAddPeriod(scope) {
      await this.$nextTick();
      this.dialogFormVisible2 = true;
      this.storedExpireDate = scope.row.expireDate;
      this.formData.nickName = scope.row.nickName;
      this.formData2.id = scope.row.id;

      this.getTableData();
      await this.getPeriodHistory();
      this.defaultTime = this.getDefaultTime();
    },
    handleSaveDownloadInfo() {
      this.$refs.formData2.validate().then(valid => {
        this.$http
          .post(this.addPeriodRequest, this.formData2)
          .then(async response => {
            console.log(response);
            this.$message.success('提交成功');
            await this.getPeriodHistory();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    submitAddPeriod() {
      this.$refs.formData2.validate().then(valid => {
        this.$http
          .post(this.addPeriodRequest, this.formData2)
          .then(async response => {
            console.log(response);
            this.$message.success('提交成功');
            await this.getPeriodHistory();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    getFansInfo(scope) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.getFansInfoRequest, {
            params: {
              id: scope.row.id
            }
          })
          .then(response => {
            console.log('getFansInfo++++++', response);
            this.formData = response.result;
            resolve();
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    getPeriodHistory() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.getPeriodHistoryRequest, {
            params: {
              limit: this.pagination2.limit,
              page: this.pagination2.page,
              fanId: this.formData2.id
            }
          })
          .then(response => {
            console.log('getPeriodHistory++++', response);
            this.periodHistoryData = response.data;
            this.getPeriodHistoryTableData(1);
            this.defaultTime = this.getDefaultTime();
            this.pagination2.total = response.total;
            this.getLastExpireDateString();
            resolve();
          })
          .catch(error => {
            console.log(error);
            reject();
          });
      });
    },
    getPeriodHistoryTableData(page) {
      page = page || this.pagination2.page;
      const offset = this.pagination2.limit;
      page = page - 1;
      this.periodHistoryTableData = this.periodHistoryData.filter(
        (item, index) => index >= page * offset && index < (page + 1) * offset
      );
    },
    getLastExpireDateString() {
      this.lastExpireDateString = this.periodHistoryData[0]
        ? this.periodHistoryData[0].expireDate
        : '';
      this.expireStatus = this.checkSchedule();
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
                id: item.id
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
        .delete(this.deleteItemsRequest, {
          data: params
        })
        .then(response => {
          console.log(response);
          this.$message.success('删除成功');
          this.getTableData();
        })
        .catch(error => {
          console.log(error);
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

    focusSortList(queryString, callback) {
      this.loading = true;

      this.$http
        .get(this.queryRewardProductByNameRequest, {
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

    handleDownloadSingleFile() {
      this.dialogFormVisible1 = true;
      this.dialogStatus = 'create';
    },
    handleDownloadSeriesFiles() {
      this.dialogFormVisible2 = true;
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
    },

    handleChangeStartDate(dateObj) {
      this.storedExpireDate = dateObj;
      this.formData2.period = '';
      this.calculateDuration();
      this.filterPeriodDictionary();
    },
    filterPeriodDictionary() {
      this.periodDictionary = this.periodDictionary.map(item => {
        return {
          ...item,
          disabled: this.$isEmpty(this.formData2.startDate)
            ? true
            : !this.checkAvailableDuration(item.value)
        };
      });
    },
    calculateDuration() {
      if (!this.storedExpireDate || !this.formData2.period) return;
      this.formData2.expireDate = this.$moment(this.storedExpireDate)
        .add(this.formData2.period, 'days')
        .format('YYYY-MM-DD');
    },
    checkAvailableDuration(period) {
      let result = false;

      const allStartDateTimestampList = this.periodHistoryData
        .sort((item1, item2) => {
          const expireDateTimestamp1 = this.$moment(item1.expireDate).unix();
          const expireDateTimestamp2 = this.$moment(item2.expireDate).unix();
          if (expireDateTimestamp1 < expireDateTimestamp2) {
            return -1;
          }
          if (expireDateTimestamp1 > expireDateTimestamp2) {
            return 1;
          }
          return 0;
        })
        .map(item => {
          return {
            startDateTimestamp:
              this.$moment(item.expireDate).unix() - item.period * 24 * 3600,
            endDateTimestamp: this.$moment(item.expireDate).unix()
          };
        });

      if (this.periodHistoryData.length === 0) {
        result = this.periodHistoryData.length === 0;
      } else {
        for (let index = 0; index < allStartDateTimestampList.length; index++) {
          const item = allStartDateTimestampList[index];
          let chosenPeriod = period || this.formData2.period;
          chosenPeriod = this.$isNotEmpty(chosenPeriod)
            ? chosenPeriod
            : this.periodDictionary[0].value;
          const chosenPeriodTimestamp = chosenPeriod * 24 * 3600;
          const chosenStartDateTimestamp = this.$moment(
            this.storedExpireDate
          ).unix();
          const chosenEndDateTimestamp =
            chosenStartDateTimestamp + chosenPeriodTimestamp;
          const previousEndDateTimestamp =
            index > 0
              ? allStartDateTimestampList[index - 1].endDateTimestamp
              : null;
          const firstStartDateTimestamp =
            allStartDateTimestampList[0].startDateTimestamp;
          const lastEndDateTimestamp =
            allStartDateTimestampList[allStartDateTimestampList.length - 1]
              .endDateTimestamp;

          if (
            chosenStartDateTimestamp < firstStartDateTimestamp &&
            chosenEndDateTimestamp < firstStartDateTimestamp
          ) {
            result = true;
            break;
          } else if (
            chosenStartDateTimestamp > firstStartDateTimestamp &&
            chosenStartDateTimestamp < lastEndDateTimestamp &&
            chosenStartDateTimestamp > previousEndDateTimestamp &&
            chosenEndDateTimestamp < item.startDateTimestamp
          ) {
            result = true;
            break;
          } else if (chosenStartDateTimestamp > lastEndDateTimestamp) {
            result = true;
            break;
          }
        }
      }

      return result;
    },
    getTheDayAfterOffsetTimestamp(options) {
      const offsetDaysTimestamp = options.offsetDays * 24 * 3600;
      return this.$moment(options.dateString).unix() + offsetDaysTimestamp;
    },
    getTheDayBeforeOffsetTimestamp(options) {
      const offsetDaysTimestamp = options.offsetDays * 24 * 3600;
      return this.$moment(options.dateString).unix() - offsetDaysTimestamp;
    },
    checkSchedule() {
      let result = '';
      const lastExpireDateTimestamp = this.getTheDayAfterOffsetTimestamp({
        dateString: this.lastExpireDateString,
        offsetDays: this.formData2.period
      });
      const currentDateTimestamp = this.$moment().unix();

      if (this.periodHistoryData.length === 0) {
        result = 'new_fan';
      } else if (lastExpireDateTimestamp - currentDateTimestamp < 0) {
        result = 'expired';
      } else if (this.checkIfOnProgress()) {
        result = 'in_progress';
      } else if (!this.checkIfOnProgress()) {
        result = 'not_started';
      }
      return result;
    },
    checkIfOnProgress() {
      let result = false;
      this.periodHistoryData.forEach(item => {
        const startDateTimestamp = this.getTheDayBeforeOffsetTimestamp({
          dateString: item.expireDate,
          offsetDays: item.period
        });
        const endDateTimestamp = this.$moment(item.expireDate).unix();
        const currentDateTimestamp = this.$moment().unix();
        // console.log('startDateTimestamp', startDateTimestamp);
        // console.log('endDateTimestamp', endDateTimestamp);
        if (
          currentDateTimestamp <= endDateTimestamp &&
          currentDateTimestamp >= startDateTimestamp
        ) {
          result = true;
        }
      });
      return result;
    },
    getDefaultTime() {
      const currentDate = this.$moment();
      return this.checkSchedule() === 'not_expired'
        ? this.$moment(this.lastExpireDateString)
        : currentDate;
    },
    async handleCloseRecordPeriod() {
      this.$refs.formData2.resetFields();
      this.formData2.expireDate = null;
      this.periodHistoryData = [];
      this.pagination2.page = 1;
      this.dialogFormVisible2 = false;
    },
    async handleCloseFansInfoDialog() {
      this.$refs.formData.resetFields();

      this.dialogFormVisible1 = false;
    },
    handleDeletePeriod(scope) {
      this.$alert('确认删除此条权益?', '警告', {
        type: 'warning',
        callback: async action => {
          this.deletePeriod(action, scope);
        }
      });
    },
    deletePeriod(action, scope) {
      this.$http
        .delete(this.deletePeriodRequest, {
          data: {
            id: scope.row.id
          }
        })
        .then(async response => {
          this.$message({
            type: 'success',
            message: '权益删除成功'
          });
          await this.getPeriodHistory();
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkIsNotStartedRecord(scope) {
      const todayTimestamp = this.$moment().unix();
      const theDayBeforeOffsetTimestamp = this.getTheDayBeforeOffsetTimestamp({
        dateString: scope.row.expireDate,
        offsetDays: scope.row.period
      });
      return theDayBeforeOffsetTimestamp >= todayTimestamp;
    },

    checkIsExpiredRecord(scope) {
      const todayTimestamp = this.$moment().unix();
      const expireDateTimestamp = this.$moment(scope.row.expireDate).unix();
      return expireDateTimestamp < todayTimestamp;
    },
    checkProgressStatus(scope) {
      if (this.checkIsNotStartedRecord(scope)) {
        return '未开始';
      } else if (this.checkIsExpiredRecord(scope)) {
        return '已结束';
      } else {
        return '进行中';
      }
    },
    interview1() {
      setTimeout(() => {
        console.log(1);
      });
      new Promise(resolve => {
        console.log(2);
        resolve();
        console.log(3);
      })
        .then(() => {
          console.log(4);
        })
        .then(() => {
          console.log(5);
        });
      console.log(6);
    },
    interview2() {
      var fullName = 'a';
      var obj = {
        fullName: 'b',
        prop: {
          fullName: 'c',
          getFullName: () => {
            return this.fullName;
          }
          //   getFullName: function() {
          //     return this.fullName;
          //   }
        }
      };

      console.log(obj.prop.getFullName());
      var test = obj.prop.getFullName;
      console.log(test());
    },
    interview3() {
      var aaa = '';
      var bbb = true;
      var ccc = function() {};
      var ddd = Date;
      var eee = [];
      console.log(typeof aaa);
      console.log(typeof bbb);
      console.log(typeof ccc);
      console.log(typeof ddd);
      console.log(typeof eee);
    },
    interview4() {
      var aaa = '';
      var bbb = true;
      var ccc = 5;
      var ddd = function() {};
      ddd.prototype.aaa = 'aaaaa';
      console.log(aaa.__proto__);
      console.log(bbb.__proto__);
      console.log(ccc.__proto__);
      console.log(ddd.prototype);
    },
    interview5() {
      // 求出一个数组中重复次数最多和最少的数字
      // 这道题的最简便思路是：
      // 1 先去重，得出不重复的数组，并标记好值和重复字数字段
      // 2 遍历去重过后的数组，让其中的每一项和源数据进行filter处理，得出的长度就是重复的次数
      const startTime1 = new Date().valueOf();
      const arr = [1, 1, 1, 2, 3, 3, 3, 2, 3, 1, 4, 2, 5, 1, 2, 3, 4, 3, 5, 5];
      const simplifiedArr = new Set(arr); //  直接用Set方法去重
      const index = [];
      simplifiedArr.forEach(item => {
        index.push({
          value: item,
          count: 0
        });
      });

      // 直接这么写就可以得出结果
      const result3 = index
        .map(item => {
          return {
            value: item.value,
            count: arr.filter(item2 => item2 === item.value).length
          };
        })
        .sort((a, b) => {
          if (a.count < b.count) {
            return -1;
          }
          if (a.count > b.count) {
            return 1;
          }
          return 0;
        });
      console.log('result3', result3);
      const startTime2 = new Date().valueOf();
      console.log(startTime1);
      console.log(startTime2);
      console.log(startTime2 - startTime1);
    }
  }
};
</script>
<style lang="scss" scoped>
.duration {
  li {
    margin: 0 0 25px 0;
  }
}
</style>

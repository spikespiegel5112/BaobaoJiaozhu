<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="handleCreateFan"
          icon="el-icon-plus"
          size="mini"
          type="primary"
        >
          添加粉丝
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
      <el-table-column align="center" fixed="right" label="操作" width="350">
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
        :total="total"
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
      :visible.sync="dialogFormVisible"
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
      :visible.sync="dialogrRecordPaymentVisible"
      @close="handleCloseRecordPeriod"
      top="5vh"
      width='1200px'
      :close-on-click-modal="false"
    >
      <el-form
        ref="formData2"
        :model="formData2"
        :rules="rules2"
        label-position="top"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="起始日期" prop="startDate">
                  <el-date-picker
                    v-model="formData2.startDate"
                    type="date"
                    @change="handleChangeStartDate"
                    :picker-options="pickerOptions"
                    :default-value="defaultTime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="时长" prop="period">
                  <el-select
                    v-model="formData2.period"
                    @change="calculateDuration"
                  >
                    <el-option
                      v-for="(item, index) in periodDictionary"
                      :key="index"
                      :label="item.title"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <ul class="duration">
                  <li>粉丝昵称：{{ formData.nickName }}</li>
                  <li>
                    是否到期:
                    <el-tag v-if="expireStatus === 'expired'" type="danger">
                      已到期
                    </el-tag>
                    <el-tag
                      v-else-if="expireStatus === 'not_expired'"
                      type="success"
                    >
                      未到期
                    </el-tag>
                    <el-tag v-else-if="expireStatus === 'new_fan'" type="info">
                      新粉丝
                    </el-tag>
                  </li>
                  <li>
                    当前有效期至:
                    {{
                      $isNotEmpty(lastExpireDateString)
                        ? $moment(lastExpireDateString).format('YYYY-MM-DD')
                        : '-'
                    }}
                  </li>
                  <li>
                    添加后有效期至:
                    {{
                      $isNotEmpty(formData2.expireDate)
                        ? $moment(formData2.expireDate).format('YYYY-MM-DD')
                        : '-'
                    }}
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          :disabled="submitingFlag"
          @click="submitAddPeriod"
        >
          保存
        </el-button>
        <whiteSpace size="xl" />
        <el-form-item label="权益记录">
          <el-table
            class="common_table_wrapper"
            :data="periodHistoryData"
            border
            element-loading-text="Loading"
            fit
            highlight-current-row
            v-loading.body="listLoading"
          >
            <el-table-column
              align="center"
              fixed
              label="No"
              type="index"
              width="45"
            ></el-table-column>
            <el-table-column
              align="center"
              fixed
              label="周期"
              prop="period"
            ></el-table-column>
            <el-table-column
              align="center"
              fixed
              label="开始时间"
              prop="createdAt"
            >
              <template slot-scope="scope">
                {{
                  $moment(
                    getTheDayBeforeOffsetTimestamp({
                      dateString: scope.row.expireDate,
                      offsetDays: scope.row.period
                    }) * 1000
                  ).format('YYYY-MM-DD')
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed
              label="结束时间"
              prop="createdAt"
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.expireDate).format('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed
              label="进行状态"
              prop="createdAt"
            >
              <template slot-scope="scope">
                {{ checkProgressStatus(scope) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed
              label="录入时间"
              width="200"
              prop="createdAt"
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.createdAt).format('YYYY-MM-DD hh:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column align="center" fixed label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="checkIsNotStartedRecord(scope)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDeletePeriod(scope)"
                >
                  删除此权益
                </el-button>
                <el-button
                  v-if="checkIsExpiredRecord(scope)"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDeletePeriod(scope)"
                >
                  删除此记录
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <whiteSpace size="xl" />
          <el-pagination
            :current-page.sync="pagination2.page"
            :page-size="pagination2.limit"
            :total="pagination2.total"
            @current-change="handleCurrentChange2"
            @size-change="handleSizeChange2"
            background
            layout="total, prev, pager, next, jumper"
          >
          </el-pagination>
        </el-form-item>
      </el-form>

      <div class="footer alignright">
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
      dialogFormVisible: false,
      dialogrRecordPaymentVisible: false,
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
        nickName: '',
        email: '',
        phone: ''
      },
      rules: {
        nickName: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        email: [
          { required: false, message: '此项为必填项', trigger: 'change' }
        ],
        phone: [{ required: false, message: '此项为必填项', trigger: 'change' }]
      },
      formData2: {
        startDate: '',
        period: '',
        expireDate: ''
      },
      rules2: {
        startDate: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        period: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      },
      pagination2: {
        limit: 5,
        page: 1,
        total: 0
      },
      periodHistoryData: [],
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
          return this.$isNotEmpty(this.lastExpireDateString) &&
            this.expireStatus === 'not_expired'
            ? time.getTime() < this.$moment(this.lastExpireDateString)
            : false;
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
              this.dialogFormVisible = false;
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
      this.dialogFormVisible = true;
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
      this.dialogrRecordPaymentVisible = true;
      this.storedExpireDate = scope.row.expireDate;
      this.formData.nickName = scope.row.nickName;
      this.formData2.id = scope.row.id;

      await this.getPeriodHistory();
      this.defaultTime = this.getDefaultTime();
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
            this.defaultTime = this.getDefaultTime();
            this.pagination2.total = response.pagination.total;
            this.getLastExpireDateString();
            resolve();
          })
          .catch(error => {
            console.log(error);
            reject();
          });
      });
    },
    getLastExpireDateString() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.getPeriodHistoryRequest, {
            params: {
              limit: 9999999,
              page: 1,
              fanId: this.formData2.id
            }
          })
          .then(response => {
            this.lastExpireDateString = response.data[0]
              ? response.data[0].expireDate
              : '';
            console.log('lastExpireDateString++++', this.lastExpireDateString);

            this.expireStatus = this.checkIsExpired();

            resolve();
          })
          .catch(error => {
            console.log(error);
            reject();
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

    handleCreateFan() {
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
    },

    handleChangeStartDate(dateObj, aaa, bbb, ccc) {
      this.storedExpireDate = dateObj;
      this.calculateDuration();
    },
    calculateDuration() {
      if (!this.storedExpireDate || !this.formData2.period) return;
      this.formData2.expireDate = this.$moment(this.storedExpireDate)
        .add(this.formData2.period, 'days')
        .format('YYYY-MM-DD');
    },
    getTheDayAfterOffsetTimestamp(options) {
      const offsetDaysTimestamp = options.offsetDays * 24 * 3600;
      return this.$moment(options.dateString).unix() + offsetDaysTimestamp;
    },
    getTheDayBeforeOffsetTimestamp(options) {
      const offsetDaysTimestamp = options.offsetDays * 24 * 3600;
      return this.$moment(options.dateString).unix() - offsetDaysTimestamp;
    },
    checkIsExpired() {
      const lastExpireDateTimestamp = this.getTheDayAfterOffsetTimestamp({
        dateString: this.lastExpireDateString,
        offsetDays: this.formData2.period
      });
      const currentDateTimestamp = this.$moment().unix();
      let result;
      if (this.$isEmpty(lastExpireDateTimestamp)) {
        result = 'new_fan';
      } else if (lastExpireDateTimestamp - currentDateTimestamp < 0) {
        result = 'expired';
      } else if (lastExpireDateTimestamp - currentDateTimestamp >= 0) {
        result = 'not_expired';
      }
      return result;
    },
    getDefaultTime() {
      const currentDate = this.$moment();
      return this.checkIsExpired() === 'not_expired'
        ? this.$moment(this.lastExpireDateString)
        : currentDate;
    },
    async handleCloseRecordPeriod() {
      this.$refs.formData2.resetFields();
      this.formData2.expireDate = null;
      this.periodHistoryData = [];
      this.pagination2.page = 1;
      this.dialogrRecordPaymentVisible = false;
    },
    async handleCloseFansInfoDialog() {
      this.$refs.formData.resetFields();

      this.dialogFormVisible = false;
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
      const theDayAfterOffsetTimestamp = this.getTheDayAfterOffsetTimestamp({
        dateString: scope.row.expireDate,
        offsetDays: scope.row.period
      });
      return theDayAfterOffsetTimestamp < todayTimestamp;
    },
    checkProgressStatus(scope) {
      if (this.checkIsNotStartedRecord(scope)) {
        return '未开始';
      } else if (this.checkIsExpiredRecord(scope)) {
        return '已结束';
      } else {
        return '进行中';
      }
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

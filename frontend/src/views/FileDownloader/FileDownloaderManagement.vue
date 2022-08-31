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
          文件下载
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
      <el-table-column align="center" label="文件名左侧" prop="fileUrlLeftSide">
      </el-table-column>
      <el-table-column
        align="center"
        label="文件名右侧"
        prop="fileUrlRightSide"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="序列号起始值"
        prop="seriesNumberStart"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="序列号结束值"
        prop="seriesNumberEnd"
      >
      </el-table-column>
      <el-table-column align="center" label="类型" prop="type">
      </el-table-column>
      <el-table-column align="center" label="目标位置" prop="destPath">
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="360">
        <template slot-scope="scope">
          <el-button
            @click="handleUpdateFanInfo(scope)"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
          >
            编辑
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

    <!-- 文件下载 -->
    <!-- 123 -->
    <el-dialog
      title="文件下载"
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
              <el-form-item label="下载操作名称" prop="name">
                <el-input v-model="formData2.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="type">
                <el-select v-model="formData2.type">
                  <el-option value="single" label="单文件">单文件</el-option>
                  <el-option value="multiple" label="多文件">多文件</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData2.type === 'single'">
            <el-col :span="12">
              <el-form-item label="文件路径" prop="fileUrlLeftSide">
                <el-input v-model="formData2.fileUrl"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="formData2.type === 'multiple'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="序列号起始值" prop="fileUrlLeftSide">
                  <el-input v-model="formData2.fileUrlLeftSide"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="序列号结束值" prop="fileUrlRightSide">
                  <el-input v-model="formData2.fileUrlRightSide"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="起始数字" prop="seriesNumberStart">
                  <el-input
                    v-model="formData2.seriesNumberStart"
                    type="number"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结束数字" prop="seriesNumberEnd">
                  <el-input
                    v-model="formData2.seriesNumberEnd"
                    type="number"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目标位置" prop="destPath">
                <el-input v-model="formData2.destPath"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
      <whiteSpace />
      <div class="progressgrid">
        <ul>
          <li
            v-for="(item, index) in gridDictionary"
            :key="index"
            :class="item.status"
          >
            <el-popover
              v-if="item.status === 'failed'"
              placement="top-start"
              trigger="hover"
              :content="item.seriesNumber.toString()"
            >
              <template #reference>
                <div></div>
              </template>
            </el-popover>
            <div v-else></div>
          </li>
        </ul>
      </div>
      <whiteSpace />

      <!-- <el-progress :percentage="percentage"></el-progress> -->
      <whiteSpace />

      <div class="footer alignright">
        <el-button @click="handleSaveDownloadInfo">保存信息</el-button>
        <el-button
          type="primary"
          :disabled="downloadingFlag"
          @click="beginDownload"
        >
          开始下载
        </el-button>
        <el-button
          type="danger"
          :disabled="!downloadingFlag"
          @click="stopDownload"
        >
          结束
        </el-button>
        <el-button @click="handleCloseRecordPeriod">关闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import VueInstance from '@/main';
export default {
  data() {
    return {
      getDownloaderInfoByPaginationRequest:
        'fileDownloader/getDownloaderInfoByPagination',
      createOrUpdateRequest: 'fileDownloader/createOrUpdate',
      deleteItemsRequest: 'fileDownloader/deleteItems',
      getFansInfoRequest: 'fileDownloader/getFansInfo',
      getSingleFileRequest: 'fileDownloader/getSingleFile',
      getTableDataRequest: 'fileDownloader/getTableData',
      deletePeriodRequest: 'fileDownloader/deletePeriod',
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
      downloadingFlag: false,
      formData: {
        nickName: '',
        email: '',
        phone: ''
      },
      rules: {
        fileUrlLeftSide: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        fileUrlRightSide: [
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
        name: '',
        type: '',
        fileUrl: '',
        fileUrlLeftSide: '',
        fileUrlRightSide: '',
        seriesNumberStart: '',
        seriesNumberEnd: '',
        destPath: ''
      },
      gridDictionary: [],
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
    rules2() {
      return {
        name: [{ required: false, message: '此项为必填项', trigger: 'change' }],
        type: [{ required: false, message: '此项为必填项', trigger: 'change' }],
        fileUrl: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        fileUrlLeftSide: [
          { required: false, message: '此项为必填项', trigger: 'change' }
        ],
        fileUrlRightSide: [
          { required: false, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberStart: [
          { required: false, message: '此项为必填项', trigger: 'change' }
        ],
        seriesNumberEnd: [
          // { required: false, message: '此项为必填项', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              value = Number(value);
              console.log(this.formData2.seriesNumberStart);
              const seriesNumberStart = Number(
                this.formData2.seriesNumberStart
              );
              if (value === '' || !value) {
                callback(new Error('此项为必填项'));
              } else if (value < seriesNumberStart) {
                callback(new Error('结束值必须比起始值大'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        destPath: [
          { required: false, message: '此项为必填项', trigger: 'change' }
        ]
      };
    },
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
    }
  },
  watch: {},
  async mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.getDownloaderInfoByPaginationRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getDownloaderInfoByPaginationRequest', response);
          this.tableList = response.data;
          this.pagination.total = response.pagination.total;
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
      this.getTableData();
    },
    handleCurrentChange2(val) {
      this.pagination2.page = val;
      this.getTableData();
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
              this.dialogFormVisible2 = false;
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
      this.dialogFormVisible2 = true;
      await this.$nextTick();
      console.log(scope);
      this.formData2 = {
        id: scope.row.id,
        name: scope.row.name,
        type: scope.row.type,
        fileUrlLeftSide: scope.row.fileUrlLeftSide,
        fileUrlRightSide: scope.row.fileUrlRightSide,
        seriesNumberStart: scope.row.seriesNumberStart,
        seriesNumberEnd: scope.row.seriesNumberEnd,
        destPath: scope.row.destPath
      };
      console.log('this.formData2+++++', this.formData2);
      this.makeProgressGrid();
      this.dialogStatus = 'update';
      this.$refs.formData2.clearValidate();
    },
    makeProgressGrid() {
      const seriesNumberStart = Number(this.formData2.seriesNumberStart);
      const seriesNumberEnd = Number(this.formData2.seriesNumberEnd);
      const length = seriesNumberEnd - seriesNumberStart;
      this.gridDictionary = [];
      for (let i = 0; i < length; i++) {
        this.gridDictionary.push({
          seriesNumber: seriesNumberStart + i,
          status: '' // success failed pending
        });
      }

      console.log(length);
      console.log(this.formData2.seriesNumberStart);
      console.log(this.formData2.seriesNumberEnd);
    },
    async handleAddPeriod(scope) {
      await this.$nextTick();
      this.dialogFormVisible2 = true;
      this.storedExpireDate = scope.row.expireDate;
      this.formData.nickName = scope.row.nickName;
      this.formData2.id = scope.row.id;

      this.getTableData();
      await this.getTableData();
      this.defaultTime = this.getDefaultTime();
    },
    handleSaveDownloadInfo() {
      this.$refs.formData2.validate().then(valid => {
        this.$http
          .post(this.createOrUpdateRequest, this.formData2)
          .then(async response => {
            console.log(response);
            this.$message.success('提交成功');
            this.dialogFormVisible2 = false;
            await this.getTableData();
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    beginDownload() {
      this.$refs.formData2.validate().then(valid => {
        this.downloadingFlag = true;
        if (this.formData2.type === 'multiple') {
          const seriesNumberStart = Number(this.formData2.seriesNumberStart);
          const times =
            Number(this.formData2.seriesNumberEnd) -
            Number(this.formData2.seriesNumberStart) +
            1;
          let count = 0;
          let prefixLength = (this.formData2.seriesNumberEnd + '')
            .split('')
            .map(item => '0')
            .join('');
          const loop = () => {
            if (count >= times) {
              this.downloadingFlag = false;
            }
            if (!this.downloadingFlag) {
              return;
            }
            let currentGridIndex = 0;
            this.gridDictionary.forEach((item, index) => {
              if (item.seriesNumber === count + seriesNumberStart) {
                currentGridIndex = index;
              }
            });
            console.log('currentGridIndex+++', currentGridIndex);
            if (count <= times) {
              this.gridDictionary[currentGridIndex].status = 'pending';

              const filledUpCount = (
                prefixLength +
                (count + seriesNumberStart)
              ).slice(-3);

              this.$http
                .post(this.getSingleFileRequest, {
                  type: this.formData2.type,
                  fileUrl:
                    this.formData2.fileUrlLeftSide +
                    filledUpCount +
                    this.formData2.fileUrlRightSide,
                  destPath: this.formData2.destPath
                })
                .then(async response => {
                  console.log(response);
                  this.gridDictionary[currentGridIndex].status = 'success';

                  if (count < times) {
                    loop();
                  } else {
                    this.$message.success('下载完成');
                  }
                })
                .catch(error => {
                  this.$message.error('下载失败');
                  this.gridDictionary[currentGridIndex].status = 'failed';
                  if (count < times) {
                    loop();
                  } else {
                    this.$message.success('下载完成');
                  }
                  console.log(error);
                });
            }
            count++;
          };

          loop();
        } else if (this.formData2.type === 'single') {
          this.$http
            .post(this.getSingleFileRequest, {
              type: this.formData2.type,
              fileUrl: this.formData2.fileUrl
            })
            .then(async response => {
              console.log(response);
              this.$message.success('提交成功');
              await this.getTableData();
            })
            .catch(error => {
              console.log(error);
            });
        }
        const fileUrl =
          this.formData2.type === 'multiple'
            ? this.formData2.fileUrlLeftSides + this.formData2.fileUrlRightSide
            : this.formData2.type;
      });
    },
    stopDownload() {
      this.downloadingFlag = false;
      this.gridDictionary.forEach(item => {
        item.status = '';
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
          await this.getTableData();
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
.progressgrid {
  width: 100%;
  ul {
    li {
      display: inline-block;
      margin: 2px;
      width: 15px;
      height: 15px;
      background-color: #ccc;
      border-radius: 5px;
      overflow: hidden;
      div {
        width: 100%;
        height: 100%;
      }
      &.success {
        div {
          background-color: green;
        }
      }
      &.failed {
        div {
          background-color: red;
        }
      }
      &.pending {
        div {
          background-color: orange;
        }
      }
    }
  }
}
</style>

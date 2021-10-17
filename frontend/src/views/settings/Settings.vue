<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="createData"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          
        >
          新建
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
      :data="tableList"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      v-loading.body="listLoading"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column
        align="center"
        fixed
        label="No"
        type="index"
        width="45"
      ></el-table-column>
      <el-table-column
        align="center"
        label="设置名称"
        prop="name"
        width="200"
      ></el-table-column>
      <el-table-column
        align="center"
        label="设置Code"
        prop="code"
      ></el-table-column>
      <el-table-column align="center" label="设置类型" prop="type">
        <template slot-scope="scope">
          {{ getCrawlerType(scope) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="值" prop="value">
        <template slot-scope="scope">
          <el-button @click="checkValue(scope)">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope)" size="mini" type="primary"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope)" size="mini" type="danger"
            >删除</el-button
          >
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="850px"
    >
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form
            :model="formData"
            :rules="rules"
            label-position="right"
            label-width="140px"
            ref="formData"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="Code" prop="code">
              <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              {{ $store.state.app.dictionary }}

              <el-select placeholder="请选择" v-model="formData.type">
                <el-option
                  :key="item.dictionaryId"
                  :label="item.name"
                  :value="item.code"
                  v-for="item in dictionaryList.settings"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input
                :autosize="{ minRows: 2, maxRows: 8 }"
                type="textarea"
                v-model="formData.value"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false" >{{
          $t('table.cancel')
        }}</el-button>
        <el-button
          @click="createData"
          type="primary"
          v-if="dialogStatus === 'create'"
          >{{ $t('table.confirm') }}</el-button
        >
        <el-button @click="updateData" type="primary" v-else >{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-dialog>
    <!-- JSON查看器 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="valueViewerFlag"
      width="850px"
    >
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form
            :model="formData"
            :rules="rules"
            label-position="right"
            label-width="50px"
            ref="formData"
          >
            <el-form-item label="值" prop="name">
              <el-input
                :autosize="{ minRows: 16, maxRows: 32 }"
                type="textarea"
                v-model="formData.value"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="valueViewerFlag = false" >{{
          $t('table.cancel')
        }}</el-button>
        <el-button @click="updateValue" type="primary" >{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import CommonTag from '@/views/common/CommonTag.vue';
import CommonQuery from '@/views/common/CommonQuery.vue';

export default {
  components: {
    CommonTag,
    CommonQuery
  },
  data() {
    return {
      getListRequest: 'settings/getList',
      createOrUpdateRequest: 'settings/createOrUpdate',
      deleteItemsRequest: 'settings/deleteItems',
      getDictionaryRequest: 'dictionary/getList',
      tableList: [],
      total: null,
      listLoading: true,
      queryModel: {
        sort: 'desc'
      },
      pagination: {
        page: 1,
        limit: 50
      },

      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      formData: {
        settingId: '',
        name: '',
        type: '',
        code: '',
        value: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      valueViewerFlag: false,
      currentEditingCrawlerId: '',
      currentEditingCrawlerCode: '',
      rules: {
        settingId: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        type: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        code: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        value: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      },
      typeList: [],
      valueViewerContent: {},
      pickerOptions1: {
        disabledDate: time => {
          return time.getTime() < this.value1;
        }
      },
      fileList: [],
      portraitParams: {
        bucketName: 'funyvalley',
        folderName: 'icon'
      },
      expandQuery: ''
    };
  },
  computed: {
    tableHeight() {
      return this.$store.state.app.tableHeight;
    },
    dictionaryList() {
      return this.$store.state.app.dictionary;
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
    const dictionaryData = await this.getSettingsDictionary();
    this.$store.commit('updateDictionary', {
      settings: dictionaryData
    });

    console.log('mounted', this.$store.state.app.dictionary);
    this.getTableData();

    console.log('dictionaryList', this.dictionaryList.settings);
  },
  methods: {
    getTableData() {
      this.listLoading = true;
      this.queryModel = Object.assign(this.queryModel, this.pagination);
      this.$http
        .get(this.$baseUrl + this.getListRequest, {
          params: this.queryModel
        })
        .then(response => {
          console.log('getListByPaginationRequest', response);

          this.tableList = response.data;
          this.total = response.pagination.total;
          this.listLoading = false;
        });
    },
    getSettingsDictionary() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$baseUrl + this.getDictionaryRequest, {
            params: {
              typeCode: 'settings'
            }
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    getCrawlerType(scope) {
      const result = this.$store.state.app.dictionary['settings'].filter(
        item => item.code === scope.row.type
      );
      return result.length > 0 ? result[0].name : '';
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
    resetTemp() {
      this.formData = {
        id: '',
        settingId: '',
        name: '',
        type: '',
        code: '',
        value: ''
      };
    },
    createData() {
      this.dialogFormVisible = true;
      this.formData.settingId = '';
      this.resetTemp();
    },
    checkValue(scope) {
      this.valueViewerFlag = true;
      this.formData = Object.assign({}, scope.row);
    },
    async updateValue() {
      await this.commitUpdate();
      this.getTableData();
      this.valueViewerFlag = false;
    },
    handleUpdate(scope) {
      console.log(scope);
      this.formData = Object.assign({}, scope.row);

      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate();
      });
    },
    updateData() {
      this.$refs['formData'].validate(async valid => {
        if (valid) {
          await this.commitUpdate();
          this.getTableData();
        }
      });
    },
    handleChangeCralerType(scope) {
      this.currentEditingCrawlerId = scope.row.settingId;
      this.formData = Object.assign({}, scope.row);
    },
    saveHeaderTypes() {
      this.commitUpdate();
      this.currentEditingCrawlerId = '';
    },
    commitUpdate() {
      return new Promise((resolve, reject) => {
        this.$http
          .post(this.$baseUrl + this.createOrUpdateRequest, {
            settingId: this.formData.settingId,
            name: this.formData.name,
            type: this.formData.type,
            code: this.formData.code,
            value: this.formData.value.trim('&nbsp')
          })
          .then(response => {
            console.log(response);
            this.dialogFormVisible = false;
            this.$message.success('信息修改成功');
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            this.$message.error(
              `${error.response.status.toString()}  ${
                error.response.data.error
              }`
            );
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
          this.deleteItem(
            this.multipleSelection.map(item => {
              return item.id;
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
          this.deleteItem(scope.row.settingId);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteItem(data) {
      this.$http
        .delete(this.$baseUrl + this.deleteItemsRequest, {
          data: {
            settingId: data
          }
        })
        .then(response => {
          console.log(response);
          this.dialogFormVisible = false;
          this.$message.success('删除成功');
          this.getTableData();
        })
        .catch(error => {
          console.log(error);
          this.$message.error(
            `${error.response.status.toString()}  ${error.response.data.error}`
          );
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
      this.formData.dailyLimit =
        data.toString() === 'unlimited' ? '-1' : this.formData.dailyLimit;
    },
    changeLimitMode(data) {
      this.formData.limit =
        data.toString() === 'unlimited' ? '-1' : this.formData.limit;
      alert(this.formData.limit);
    },
    chooseRewardType(data) {
      console.log(data);
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../style/edifice.scss';
</style>

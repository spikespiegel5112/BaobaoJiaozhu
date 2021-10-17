<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button
          @click="handleCreate"
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
        label="字典项名称"
        prop="name"
      ></el-table-column>
      <el-table-column
        align="center"
        label="字典项Code"
        prop="code"
      ></el-table-column>
      <el-table-column
        align="center"
        label="类型"
        prop="typeName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="类型Code"
        prop="typeCode"
      ></el-table-column>
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
    <!-- 编辑-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="createDialogFormVisible"
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
            <el-row :gutter="1">
              <el-col :span="16">
                <el-form-item label="类型" prop="typeCode">
                  <el-select
                    :style="{ width: '100%' }"
                    @change="chooseType"
                    placeholder=""
                    v-model="formData.typeCode"
                  >
                    <el-option
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                      v-for="item in typeList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="addTypeFlag = true" type="primary"
                  >新增类型</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="createDialogFormVisible = false" >{{
          $t('table.cancel')
        }}</el-button>
        <el-button @click="updateData" type="primary">{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-dialog>
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
            <el-row :gutter="1">
              <el-col :span="16">
                <el-form-item label="类型" prop="typeCode">
                  <el-select
                    :style="{ width: '100%' }"
                    @change="chooseType"
                    placeholder=""
                    v-model="formData.typeCode"
                  >
                    <el-option
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                      v-for="item in typeList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click="addTypeFlag = true" type="primary"
                  >新增类型</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false" >{{
          $t('table.cancel')
        }}</el-button>
        <el-button @click="updateData" type="primary" >{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 新增类型 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="addTypeFlag"
      width="850px"
    >
      <el-row justify="center" type="flex">
        <el-col :span="20">
          <el-form
            :model="typeFormData"
            :rules="rules"
            label-position="right"
            label-width="140px"
            ref="typeFormData"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="typeFormData.name"></el-input>
            </el-form-item>

            <el-col>
              <el-form-item label="Code" prop="code">
                <el-input v-model="typeFormData.code"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button @click="addTypeFlag = false" >{{
          $t('table.cancel')
        }}</el-button>
        <el-button @click="createType" type="primary" >{{
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
      getListRequest: 'dictionary/getList',
      createOrUpdateRequest: 'dictionary/createOrUpdate',
      deleteItemRequest: 'dictionary/deleteItem',

      tableList: [],
      total: null,
      listLoading: true,
      queryModel: {
        sort: 'desc',
        typeCode: ''
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
        dictionaryId: '',
        typeName: '',
        typeCode: '',
        name: '',
        code: ''
      },
      typeFormData: {
        name: '',
        code: ''
      },
      typeList: [],
      dialogFormVisible: false,
      createDialogFormVisible: false,
      addTypeFlag: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        typeCode: [
          { required: true, message: '此项为必填项', trigger: 'change' }
        ],
        name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        code: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      },
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
  mounted() {
    this.getTableData();
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
    getTypeList() {
      const result = [];
      this.tableList.forEach(item => {
        if (result.filter(item2 => item2.code === item.typeCode).length === 0) {
          result.push({
            name: item.typeName,
            code: item.typeCode
          });
        }
      });
      console.log(result);
      // debugger
      this.typeList = result;
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
        dictionaryId: '',
        typeCode: '',
        typeName: '',
        name: '',
        code: ''
      };
    },
    handleCreate() {
      this.resetTemp();
      this.getTypeList();
      console.log(this.typeList);
      this.createDialogFormVisible = true;
    },
    createData() {
      this.handleUpdate();
    },
    handleUpdate(scope) {
      console.log(scope);
      this.getTypeList();
      console.log(this.typeList);

      this.$nextTick(() => {
        this.formData = Object.assign({}, scope.row);

        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['formData'].clearValidate();
        });
      });
    },
    chooseType(val) {
      this.formData.typeName = this.typeList.filter(
        item => item.code === val
      )[0].name;
    },
    updateData() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$http
            .post(this.$baseUrl + this.createOrUpdateRequest, {
              dictionaryId: this.formData.dictionaryId,
              headerId: this.formData.headerId,
              name: this.formData.name,
              typeCode: this.formData.typeCode,
              typeName: this.formData.typeName,
              code: this.formData.code
            })
            .then(response => {
              console.log(response);
              this.dialogFormVisible = false;
              this.createDialogFormVisible = false;
              this.$message.success('信息修改成功');
              this.getTableData();
            })
            .catch(error => {
              console.log(error);
              this.$message.error(
                `${error.response.status.toString()}  ${
                  error.response.data.error
                }`
              );
            });
        }
      });
    },
    createType() {
      if (
        this.typeList.filter(item => item.code === this.typeFormData.code)
          .length === 0
      ) {
        this.typeList.push(this.typeFormData);
        this.addTypeFlag = false;
      } else {
        this.$message.warning('当前type已存在');
      }
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
          this.deleteRecord(
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
          this.deleteRecord([scope.row.id]);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    deleteRecord(data) {
      this.$http
        .delete(this.$baseUrl + this.deleteItemRequest, {
          data: {
            id: data
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

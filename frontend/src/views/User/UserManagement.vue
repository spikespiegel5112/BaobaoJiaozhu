<template>
  <el-row>
    <CommonQuery>
      <template slot="button1">
        <el-button @click="handleCreate" icon="el-icon-plus" size="mini" type="primary" >
          添加用户
        </el-button>
        <el-button @click="handleMultipleDelete" icon="el-icon-delete" size="mini" type="danger" >
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
    <el-table :data="tableDAta" :height="tableHeight" @selection-change="handleSelectionChange" border element-loading-text="Loading" fit highlight-current-row v-loading.body="listLoading">
      <el-table-column fixed="left" type="selection" width="30"></el-table-column>
      <el-table-column align="center" fixed label="No" type="index" width="45"></el-table-column>
      <el-table-column align="center" label="登录名称" prop="loginName"></el-table-column>
      <el-table-column align="center" label="描述" prop="description"></el-table-column>
      <el-table-column align="center" label="角色" prop="role"></el-table-column>
      <el-table-column align="center" label="地址" prop="address"></el-table-column>
      <el-table-column align="center" label="电话号码" prop="phone"></el-table-column>
      <el-table-column align="center" label="E-mail" prop="email"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope)" size="mini" type="primary">
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
      <el-pagination :current-page.sync="pagination.page" :page-size="pagination.limit" :page-sizes="[10, 20, 30, 50, 100]" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" background layout="total, sizes, prev, pager, next, jumper"> </el-pagination>
    </div>
    <!-- 编辑 -->
    <!-- 123 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" :close-on-click-modal="false">
      <el-form ref="formData" :model="formData" :rules="rules" label-position="right" label-width="80px" :style="dialogHeight" class="dialog_wrapper">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名称" prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="formData.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="formData.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="formData.role" multiple>
                <el-option v-for="(item, index) in roleList" :key="index" :value="item.code" :label="item.name"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="formData.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model="formData.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <whiteSpace size="xl" />
      <div class="footer alignright">
        <el-button type="primary" :disabled="submitingFlag" @click="handleSubmit">
          保存
        </el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      getListByPaginationRequest: 'user/getListByPagination',
      getRoleListRequest: 'role/getList',
      createOrUpdateRequest: 'user/createOrUpdate',
      deleteItemsRequest: 'user/deleteItems',
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

      tableDAta: [],
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
      roleList: [],
      formData: {
        loginName: '',
        password: '',
        role: '',
        description: '',
        role: '',
        address: '',
        phone: '',
        email: ''
      },
      rules: {
        loginName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        password: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        role: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        description: [{ required: true, message: '此项为必填项', trigger: 'change' }]
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
  watch: {},
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

          this.tableDAta = response.data;
          this.total = response.pagination.total;
          this.listLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRoleList() {
      this.$http
        .get(this.$baseUrl + this.getRoleListRequest)
        .then(response => {
          console.log(response);
          response = response.data;
          this.roleList = response;
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
          const params = {
            ...this.formData,
            role: this.formData.role instanceof Array ? this.formData.role.join(',') : this.formData.role
          };
          this.$http
            .post(this.$baseUrl + this.createOrUpdateRequest, params)
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
              this.$message.error(error.data.message || '提交失败');
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleUpdate(scope) {
      console.log(scope);
      const role = scope.row.role || '';
      this.formData = {
        ...this.formData,
        ...scope.row,
        role: role.split(',')
      };
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.formData.id = scope.row.id;
      this.getRoleList();
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate();
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
    async handleCreate() {
      this.dialogFormVisible = true;
      this.dialogStatus = 'create';
      await this.$nextTick();
      this.$refs.formData.resetFields();
      this.getRoleList();
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

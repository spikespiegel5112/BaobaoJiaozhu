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
          添加角色
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
        label="角色名称"
        prop="name"
      ></el-table-column>
      <el-table-column align="center" label="角色Code" prop="code">
      </el-table-column>

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
      :visible.sync="dialogFormVisible"
      top="5vh"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="100px"
        class="dialog_wrapper"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色Code" prop="code">
              <el-input v-model="formData.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <whiteSpace size="xl" />
      <div class="footer alignright">
        <el-button
          type="primary"
          :disabled="submitingFlag"
          @click="handleSubmit"
          >保存</el-button
        >
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      getListByPaginationRequest: 'role/getListByPagination',
      createOrUpdateRequest: 'role/createOrUpdate',
      deleteItemsRequest: 'role/deleteItems',
      dialogFormVisible: false,
      tableList: [],
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
        name: '',
        code: ''
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
      roleList: [],
      rules: {
        name: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        code: [{ required: true, message: '此项为必填项', trigger: 'change' }]
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

    createData() {},
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
              console.log('handleSubmit++++', error);
              this.submitingFlag = false;
              this.$message.error(error.data.message || '提交失败');
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleVote(scope) {
      this.voteDialogVisible = true;
      this.getVotingOptions(scope);
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
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate();
      });
    },
    getVotingOptions(scope) {
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
        })
        .catch(error => {
          console.log(error);
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
          this.deleteRecord({
            id: this.multipleSelection.map(item => {
              return item.id;
            })
          });
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

    async handleCreate() {
      this.formData.id = '';
      this.dialogFormVisible = true;
      this.dialogStatus = 'create';
      await this.$nextTick();
      this.$refs.formData.resetFields();
      console.log(this.formData);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog_wrapper {
  overflow: auto;
}
</style>

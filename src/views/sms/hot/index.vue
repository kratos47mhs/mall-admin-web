<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          @click="handleSearchList()"
          size="small"
          style="float:right"
          type="primary">
          Query search
        </el-button>
        <el-button
          @click="handleResetSearch()"
          size="small"
          style="float:right;margin-right: 15px">
          Reset
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px" size="small">
          <el-form-item label="Product Name：">
            <el-input class="input-width" placeholder="Product Name" v-model="listQuery.productName"></el-input>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.recommendStatus">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in recommendOptions">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleSelectProduct()" class="btn-add" size="mini">选择商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="newProductTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="120">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column align="center" label="是否推荐" width="200">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
              v-model="scope.row.recommendStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="160">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="160">
          <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditSort(scope.$index, scope.row)"
                       size="mini"
                       type="text">设置排序
            </el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="mini"
                       type="text">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        placeholder="Bulk Operations"
        size="small" v-model="operateType">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-for="item in operates">
        </el-option>
      </el-select>
      <el-button
        @click="handleBatchOperate()"
        class="search-button"
        size="small"
        style="margin-left: 20px"
        type="primary">
        Confirm
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes,prev, pager, next,jumper">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="selectDialogVisible" title="选择商品" width="50%">
      <el-input placeholder="商品名称搜索"
                size="small"
                style="width: 250px;margin-bottom: 20px"
                v-model="dialogData.listQuery.keyword">
        <el-button @click="handleSelectSearch()" icon="el-icon-search" slot="append"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product SerialNumber" width="160">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column align="center" label="Price" width="120">
          <template slot-scope="scope">${{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="dialogData.total"
          @current-change="handleDialogCurrentChange"
          @size-change="handleDialogSizeChange"
          background
          layout="prev, pager, next">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button @click="selectDialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleSelectDialogConfirm()" size="small" type="primary">OK</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="sortDialogVisible"
               title="设置排序"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="150px">
        <el-form-item label="Sort：">
          <el-input style="width: 200px" v-model="sortDialogData.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleUpdateSort" size="small" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    createHotProduct,
    deleteHotProduct,
    fetchList,
    updateHotProductSort,
    updateRecommendStatus
  } from '@/api/hotProduct';
  import {fetchList as fetchProductList} from '@/api/product';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    productName: null,
    recommendStatus: null
  };
  const defaultRecommendOptions = [
    {
      label: '未推荐',
      value: 0
    },
    {
      label: '推荐中',
      value: 1
    }
  ];
  export default {
    name: 'hotProductList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "设为推荐",
            value: 0
          },
          {
            label: "取消推荐",
            value: 1
          },
          {
            label: "Delete",
            value: 2
          }
        ],
        operateType: null,
        selectDialogVisible: false,
        dialogData: {
          list: null,
          total: null,
          multipleSelection: [],
          listQuery: {
            keyword: null,
            pageNum: 1,
            pageSize: 5
          }
        },
        sortDialogVisible: false,
        sortDialogData: {sort: 0, id: null}
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatRecommendStatus(status) {
        if (status === 1) {
          return '推荐中';
        } else {
          return '未推荐';
        }
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleRecommendStatusStatusChange(index, row) {
        this.updateRecommendStatusStatus(row.id, row.recommendStatus);
      },
      handleDelete(index, row) {
        this.deleteProduct(row.id);
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if (this.operateType === 0) {
          //设为推荐
          this.updateRecommendStatusStatus(ids, 1);
        } else if (this.operateType === 1) {
          //取消推荐
          this.updateRecommendStatusStatus(ids, 0);
        } else if (this.operateType === 2) {
          //Delete
          this.deleteProduct(ids);
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleSelectProduct() {
        this.selectDialogVisible = true;
        this.getDialogList();
      },
      handleSelectSearch() {
        this.getDialogList();
      },
      handleDialogSizeChange(val) {
        this.dialogData.listQuery.pageNum = 1;
        this.dialogData.listQuery.pageSize = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dialogData.listQuery.pageNum = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val) {
        this.dialogData.multipleSelection = val;
      },
      handleSelectDialogConfirm() {
        if (this.dialogData.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let selectProducts = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
          selectProducts.push({
            productId: this.dialogData.multipleSelection[i].id,
            productName: this.dialogData.multipleSelection[i].name
          });
        }
        this.$confirm('使用要进行添加操作?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          createHotProduct(selectProducts).then(response => {
            this.selectDialogVisible = false;
            this.dialogData.multipleSelection = [];
            this.getList();
            this.$message({
              type: 'success',
              message: 'Added successfully!'
            });
          });
        });
      },
      handleEditSort(index, row) {
        this.sortDialogVisible = true;
        this.sortDialogData.sort = row.sort;
        this.sortDialogData.id = row.id;
      },
      handleUpdateSort() {
        this.$confirm('是否要修改排序?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateHotProductSort(this.sortDialogData).then(response => {
            this.sortDialogVisible = false;
            this.getList();
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
          });
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
      },
      updateRecommendStatusStatus(ids, status) {
        this.$confirm('是否要修改推荐状态?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          params.append("recommendStatus", status);
          updateRecommendStatus(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      deleteProduct(ids) {
        this.$confirm('是否要删除该推荐?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteHotProduct(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
          });
        })
      },
      getDialogList() {
        fetchProductList(this.dialogData.listQuery).then(response => {
          this.dialogData.list = response.data.list;
          this.dialogData.total = response.data.total;
        })
      }
    }
  }
</script>
<style></style>

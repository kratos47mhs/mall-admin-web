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
          <el-form-item label="Recommended status：">
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
      <el-button @click="handleSelectProduct()" class="btn-add" size="mini">Choose product</el-button>
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
        <el-table-column align="center" label="Whether to recommend" width="200">
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
        <el-table-column align="center" label="Status" width="160">
          <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditSort(scope.$index, scope.row)"
                       size="mini"
                       type="text">Set Sort
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
    <el-dialog :visible.sync="selectDialogVisible" title="Choose product" width="50%">
      <el-input placeholder="Product name search"
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
               title="Set Sort"
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
      label: 'Not recommended',
      value: 0
    },
    {
      label: 'Recommended',
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
            label: "Set as recommendation",
            value: 0
          },
          {
            label: "Cancel recommendation",
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
          return 'Recommended';
        } else {
          return 'Not recommended';
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
            message: 'Please select a record',
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
          //Set as recommendation
          this.updateRecommendStatusStatus(ids, 1);
        } else if (this.operateType === 1) {
          //Cancel recommendation
          this.updateRecommendStatusStatus(ids, 0);
        } else if (this.operateType === 2) {
          //Delete
          this.deleteProduct(ids);
        } else {
          this.$message({
            message: 'Please select bulk operation type',
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
            message: 'Please select a record',
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
        this.$confirm('Use to add action?', 'Prompt', {
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
        this.$confirm('Do you want to modify the sort?', 'Prompt', {
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
        this.$confirm('Do you want to modify the recommendation status?', 'Prompt', {
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
            message: 'Operation cancelled!'
          });
          this.getList();
        });
      },
      deleteProduct(ids) {
        this.$confirm('Do you want to delete the recommendation?', 'Prompt', {
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

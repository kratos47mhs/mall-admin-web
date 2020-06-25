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
          <el-form-item label="brand name：">
            <el-input class="input-width" placeholder="brand name" v-model="listQuery.brandName"></el-input>
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
      <el-button @click="handleSelectBrand()" class="btn-add" size="mini">Choose brand</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="homeBrandTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="Numbering" width="120">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="brand name">
          <template slot-scope="scope">{{scope.row.brandName}}</template>
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
        <el-table-column align="center" label="status" width="160">
          <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="operating" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditSort(scope.$index, scope.row)"
                       size="mini"
                       type="text">Set sort
            </el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="mini"
                       type="text">delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        placeholder="Batch operation"
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
        determine
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
    <el-dialog :visible.sync="selectDialogVisible" title="Choose brand" width="40%">
      <el-input placeholder="Brand name search"
                size="small"
                style="width: 250px;margin-bottom: 20px"
                v-model="dialogData.listQuery.keyword">
        <el-button @click="handleSelectSearch()" icon="el-icon-search" slot="append"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="brand name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Related" width="220">
          <template slot-scope="scope">
            Product：<span class="color-main">{{scope.row.productCount}}</span>
            Evaluation：<span class="color-main">{{scope.row.productCommentCount}}</span>
          </template>
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
               title="Set sort"
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
    createHomeBrand,
    deleteHomeBrand,
    fetchList,
    updateHomeBrandSort,
    updateRecommendStatus
  } from '@/api/homeBrand';
  import {fetchList as fetchBrandList} from '@/api/brand';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    brandName: null,
    recommendStatus: null
  };
  const defaultRecommendOptions = [
    {
      label: 'Not recommended',
      value: 0
    },
    {
      label: 'Recommending',
      value: 1
    }
  ];
  export default {
    name: 'homeBrandList',
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
            label: "Set as recommended",
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
          return 'Recommending';
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
        this.deleteBrand(row.id);
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
          //Set as recommended
          this.updateRecommendStatusStatus(ids, 1);
        } else if (this.operateType === 1) {
          //Cancel recommendation
          this.updateRecommendStatusStatus(ids, 0);
        } else if (this.operateType === 2) {
          //Delete
          this.deleteBrand(ids);
        } else {
          this.$message({
            message: 'Please select a batch operation type',
            type: 'warning',
            duration: 1000
          });

        }
      },
      handleSelectBrand() {
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
        let selectBrands = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
          selectBrands.push({
            brandId: this.dialogData.multipleSelection[i].id,
            brandName: this.dialogData.multipleSelection[i].name
          });
        }
        this.$confirm('Use to add?', 'prompt', {
          confirmButtonText: 'determine',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          createHomeBrand(selectBrands).then(response => {
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
        this.$confirm('Do you want to modify the sort?', 'prompt', {
          confirmButtonText: 'determine',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          updateHomeBrandSort(this.sortDialogData).then(response => {
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
        this.$confirm('Do you want to modify the recommendation status?', 'prompt', {
          confirmButtonText: 'determine',
          cancelButtonText: 'cancel',
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
            message: 'Operation canceled!'
          });
          this.getList();
        });
      },
      deleteBrand(ids) {
        this.$confirm('Do you want to delete this recommendation?', 'prompt', {
          confirmButtonText: 'determine',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteHomeBrand(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: 'Deleted successfully!'
            });
          });
        })
      },
      getDialogList() {
        fetchBrandList(this.dialogData.listQuery).then(response => {
          this.dialogData.list = response.data.list;
          this.dialogData.total = response.data.total;
        })
      }
    }
  }
</script>
<style></style>



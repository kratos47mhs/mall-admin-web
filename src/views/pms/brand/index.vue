<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          @click="searchBrandList()"
          size="small"
          style="float: right"
          type="primary">
          search result
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px" size="small">
          <el-form-item label="Enter search：">
            <el-input placeholder="Brand Name / Keyword" style="width: 203px" v-model="listQuery.keyword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button
        @click="addBrand()"
        class="btn-add"
        size="mini">
        Add to
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="brandTable"
                style="width: 100%"
                v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="Numbering" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="brand name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Brand initials" width="100">
          <template slot-scope="scope">{{scope.row.firstLetter}}</template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column align="center" label="Brand maker" width="100">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleFactoryStatusChange(scope.$index, scope.row)"
              v-model="scope.row.factoryStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Whether to show" width="100">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleShowStatusChange(scope.$index, scope.row)"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Related" width="220">
          <template slot-scope="scope">
            <span>Product：</span>
            <el-button
              @click="getProductList(scope.$index, scope.row)"
              size="mini"
              type="text">100
            </el-button>
            <span>Evaluation：</span>
            <el-button
              @click="getProductCommentList(scope.$index, scope.row)"
              size="mini"
              type="text">1000
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="operating" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini">edit
            </el-button>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
              size="mini"
              type="danger">delete
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
  </div>
</template>
<script>
  import {deleteBrand, fetchList, updateFactoryStatus, updateShowStatus} from '@/api/brand'

  export default {
    name: 'brandList',
    data() {
      return {
        operates: [
          {
            label: "Show Brand",
            value: "showBrand"
          },
          {
            label: "Hide Brand",
            value: "hideBrand"
          }
        ],
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/pms/updateBrand', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('Do you want to delete the brand', 'prompt', {
          confirmButtonText: 'determine',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          deleteBrand(row.id).then(response => {
            this.$message({
              message: 'successfully deleted',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      getProductList(index, row) {
        console.log(index, row);
      },
      getProductCommentList(index, row) {
        console.log(index, row);
      },
      handleFactoryStatusChange(index, row) {
        var data = new URLSearchParams();
        data.append("ids", row.id);
        data.append("factoryStatus", row.factoryStatus);
        updateFactoryStatus(data).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.factoryStatus === 0) {
            row.factoryStatus = 1;
          } else {
            row.factoryStatus = 0;
          }
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();

        data.append("ids", row.id);
        data.append("showStatus", row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.showStatus === 0) {
            row.showStatus = 1;
          } else {
            row.showStatus = 0;
          }
        });
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
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: 'Please select a record',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let showStatus = 0;
        if (this.operateType === 'showBrand') {
          showStatus = 1;
        } else if (this.operateType === 'hideBrand') {
          showStatus = 0;
        } else {
          this.$message({
            message: 'Please select a batch operation type',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        let data = new URLSearchParams();
        data.append("ids", ids);
        data.append("showStatus", showStatus);
        updateShowStatus(data).then(response => {
          this.getList();
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      addBrand() {
        this.$router.push({path: '/pms/addBrand'})
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>


</style>



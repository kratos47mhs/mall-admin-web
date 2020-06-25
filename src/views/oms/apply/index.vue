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
          <el-form-item label="Enter search：">
            <el-input class="input-width" placeholder="Service order number" v-model="listQuery.id"></el-input>
          </el-form-item>
          <el-form-item label="Processing status：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.status">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in statusOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="application time：">
            <el-date-picker
              class="input-width"
              placeholder="Please select time"
              type="date"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Operator：">
            <el-input class="input-width" placeholder="All" v-model="listQuery.handleMan"></el-input>
          </el-form-item>
          <el-form-item label="Processing time：">
            <el-date-picker
              class="input-width"
              placeholder="Please select time"
              type="date"
              v-model="listQuery.handleTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="returnApplyTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="Service order number" width="180">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="application time" width="180">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="user account">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column align="center" label="Refund amount" width="180">
          <template slot-scope="scope">${{scope.row | formatReturnAmount}}</template>
        </el-table-column>
        <el-table-column align="center" label="application status" width="180">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Processing time" width="180">
          <template slot-scope="scope">{{scope.row.handleTime | formatTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="180">
          <template slot-scope="scope">
            <el-button
              @click="handleViewDetail(scope.$index, scope.row)"
              size="mini">see details
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        placeholder="Bulk operations"
        size="small" v-model="operateType">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-for="item in operateOptions">
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
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {deleteApply, fetchList} from '@/api/returnApply';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    id: null,
    receiverKeyword: null,
    status: null,
    createTime: null,
    handleMan: null,
    handleTime: null
  };
  const defaultStatusOptions = [
    {
      label: 'Pending',
      value: 0
    },
    {
      label: 'Returning',
      value: 1
    },
    {
      label: 'Completed',
      value: 2
    },
    {
      label: 'Rejected',
      value: 3
    }
  ];
  export default {
    name: 'returnApplyList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        statusOptions: Object.assign({}, defaultStatusOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operateType: 1,
        operateOptions: [
          {
            label: "batch deletion",
            value: 1
          }
        ],
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(status) {
        for (let i = 0; i < defaultStatusOptions.length; i++) {
          if (status === defaultStatusOptions[i].value) {
            return defaultStatusOptions[i].label;
          }
        }
      },
      formatReturnAmount(row) {
        return row.productRealPrice * row.productCount;
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleViewDetail(index, row) {
        this.$router.push({path: '/oms/returnApplyDetail', query: {id: row.id}})
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: 'Please select the application to operate',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 1) {
          //batch deletion
          this.$confirm('Do you want to delete it?', 'Prompt', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            let params = new URLSearchParams();
            let ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].id);
            }
            params.append("ids", ids);
            deleteApply(params).then(response => {
              this.getList();
              this.$message({
                type: 'success',
                message: 'Successfully Deleted!'
              });
            });
          })
        }
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
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>



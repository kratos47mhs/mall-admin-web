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
          <el-form-item label="Ad name：">
            <el-input class="input-width" placeholder="Ad name" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="Ad placement：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.type">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in typeOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Ending Time：">
            <el-date-picker
              class="input-width"
              placeholder="Please Select Time"
              type="date"
              v-model="listQuery.endTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini">Add ads</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="homeAdvertiseTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="120">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Ad name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Ad placement" width="120">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column align="center" label="Ad Image" width="120">
          <template slot-scope="scope"><img :src="scope.row.pic" style="height: 80px"></template>
        </el-table-column>
        <el-table-column align="center" label="时间" width="220">
          <template slot-scope="scope">
            <p>Starting time：{{scope.row.startTime | formatTime}}</p>
            <p>Ending Time：{{scope.row.endTime | formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Online/Offline" width="120">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleUpdateStatus(scope.$index, scope.row)"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Number of clicks" width="120">
          <template slot-scope="scope">{{scope.row.clickCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Number of orders" width="120">
          <template slot-scope="scope">{{scope.row.orderCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="120">
          <template slot-scope="scope">
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">Update Product
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
  </div>
</template>
<script>
  import {deleteHomeAdvertise, fetchList, updateStatus} from '@/api/homeAdvertise';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    name: null,
    type: null,
    endTime: null
  };
  const defaultTypeOptions = [
    {
      label: 'PC Home Carousel',
      value: 0
    },
    {
      label: 'APP Home Carousel',
      value: 1
    }
  ];
  export default {
    name: 'homeAdvertiseList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "Delete",
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatType(type) {
        if (type === 1) {
          return 'APP Home Carousel';
        } else {
          return 'PC Home Carousel';
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
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
      handleUpdateStatus(index, row) {
        this.$confirm('Do you want to modify the online/offline status?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(response => {
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
      handleDelete(index, row) {
        this.deleteHomeAdvertise(row.id);
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
          //Delete
          this.deleteHomeAdvertise(ids);
        } else {
          this.$message({
            message: 'Please select bulk operation type',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleAdd() {
        this.$router.push({path: '/sms/addAdvertise'})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/sms/updateAdvertise', query: {id: row.id}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        })
      },
      deleteHomeAdvertise(ids) {
        this.$confirm('Do you want to delete the ad?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteHomeAdvertise(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
          });
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>



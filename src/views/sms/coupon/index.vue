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
          <el-form-item label="Coupon name：">
            <el-input class="input-width" placeholder="Coupon name" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="Coupon type：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.type">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in typeOptions">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini">Add</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="couponTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Coupon name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Coupon type" width="100">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column align="center" label="Usable products" width="100">
          <template slot-scope="scope">{{scope.row.useType | formatUseType}}</template>
        </el-table-column>
        <el-table-column align="center" label="Use threshold" width="140">
          <template slot-scope="scope">Full{{scope.row.minPoint}}Yuan available</template>
        </el-table-column>
        <el-table-column align="center" label="face value" width="100">
          <template slot-scope="scope">{{scope.row.amount}}Dollar</template>
        </el-table-column>
        <el-table-column align="center" label="Coupon platform" width="100">
          <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
        </el-table-column>
        <el-table-column align="center" label="Expiry date" width="180">
          <template slot-scope="scope">{{scope.row.startTime|formatDate}}To{{scope.row.endTime|formatDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="Status" width="100">
          <template slot-scope="scope">{{scope.row.endTime | formatStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="180">
          <template slot-scope="scope">
            <el-button @click="handleView(scope.$index, scope.row)"
                       size="mini"
                       type="text">Show Product
            </el-button>
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">
              Update Product
            </el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="mini"
                       type="text">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  import {deleteCoupon, fetchList} from '@/api/coupon';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    name: null,
    type: null
  };
  const defaultTypeOptions = [
    {
      label: 'Coupons',
      value: 0
    },
    {
      label: 'Member coupons',
      value: 1
    },
    {
      label: 'Shopping coupons',
      value: 2
    },
    {
      label: 'Registration coupon',
      value: 3
    }
  ];
  export default {
    name: 'couponList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatType(type) {
        for (let i = 0; i < defaultTypeOptions.length; i++) {
          if (type === defaultTypeOptions[i].value) {
            return defaultTypeOptions[i].label;
          }
        }
        return '';
      },
      formatUseType(useType) {
        if (useType === 0) {
          return 'Universal';
        } else if (useType === 1) {
          return 'Designated category';
        } else {
          return 'Designated product';
        }
      },
      formatPlatform(platform) {
        if (platform === 1) {
          return 'Mobile platform';
        } else if (platform === 2) {
          return 'PC platform';
        } else {
          return 'Full platform';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      formatStatus(endTime) {
        let now = new Date().getTime();
        let endDate = new Date(endTime);
        if (endDate > now) {
          return 'Not Expired'
        } else {
          return 'Expired';
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
      handleAdd() {
        this.$router.push({path: '/sms/addCoupon'})
      },
      handleView(index, row) {
        this.$router.push({path: '/sms/couponHistory', query: {id: row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/sms/updateCoupon', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('Whether to delete?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteCoupon(row.id).then(response => {
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
            this.getList();
          });
        })
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



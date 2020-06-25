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
            <el-input class="input-width" placeholder="Order SerialNumber" v-model="listQuery.orderSn"></el-input>
          </el-form-item>
          <el-form-item label="Receiver：">
            <el-input class="input-width" placeholder="Receiver Name/Mobile PhoneNumber" v-model="listQuery.receiverKeyword"></el-input>
          </el-form-item>
          <el-form-item label="Submit Time：">
            <el-date-picker
              class="input-width"
              placeholder="Please Select Time"
              type="date"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Order Status：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.status">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in statusOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Order Category：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.orderType">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in orderTypeOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Order Source：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.sourceType">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in sourceTypeOptions">
              </el-option>
            </el-select>
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
                ref="orderTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="80">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Order SerialNumber" width="180">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column align="center" label="Submit Time" width="180">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="User Account">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column align="center" label="Order Amount" width="120">
          <template slot-scope="scope">${{scope.row.totalAmount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Payment Method" width="120">
          <template slot-scope="scope">{{scope.row.payType | formatPayType}}</template>
        </el-table-column>
        <el-table-column align="center" label="Order Source" width="120">
          <template slot-scope="scope">{{scope.row.sourceType | formatSourceType}}</template>
        </el-table-column>
        <el-table-column align="center" label="Order Status" width="120">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleViewOrder(scope.$index, scope.row)"
              size="mini"
            >Check Order
            </el-button>
            <el-button
              @click="handleCloseOrder(scope.$index, scope.row)"
              size="mini"
              v-show="scope.row.status===0">Close Order
            </el-button>
            <el-button
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              size="mini"
              v-show="scope.row.status===1">Order Delivery
            </el-button>
            <el-button
              @click="handleViewLogistics(scope.$index, scope.row)"
              size="mini"
              v-show="scope.row.status===2||scope.row.status===3">Order Tracking
            </el-button>
            <el-button
              @click="handleDeleteOrder(scope.$index, scope.row)"
              size="mini"
              type="danger"
              v-show="scope.row.status===4">Delete Order
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
    <el-dialog
      :visible.sync="closeOrder.dialogVisible"
      title="Close Order" width="30%">
      <span style="vertical-align: top">Operation Notes：</span>
      <el-input
        :rows="5"
        placeholder="Please Enter"
        style="width: 80%"
        type="textarea"
        v-model="closeOrder.content">
      </el-input>
      <span class="dialog-footer" slot="footer">
        <el-button @click="closeOrder.dialogVisible = false">Cancel</el-button>
        <el-button @click="handleCloseOrderConfirm" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {closeOrder, deleteOrder, fetchList} from '@/api/order'
  import {formatDate} from '@/utils/date';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    orderType: null,
    sourceType: null,
    createTime: null,
  };
  export default {
    name: "orderList",
    components: {LogisticsDialog},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder: {
          dialogVisible: false,
          content: null,
          orderIds: []
        },
        statusOptions: [
          {
            label: 'Pending Payment',
            value: 0
          },
          {
            label: 'To be Delivered',
            value: 1
          },
          {
            label: 'Shipped',
            value: 2
          },
          {
            label: 'Completed',
            value: 3
          },
          {
            label: 'Closed',
            value: 4
          }
        ],
        orderTypeOptions: [
          {
            label: 'Normal Order',
            value: 0
          },
          {
            label: 'Flash Promotion Order',
            value: 1
          }
        ],
        sourceTypeOptions: [
          {
            label: 'PC Order',
            value: 0
          },
          {
            label: 'APP Order',
            value: 1
          }
        ],
        operateOptions: [
          {
            label: "bulk shipment",
            value: 1
          },
          {
            label: "Close Order",
            value: 2
          },
          {
            label: "Delete Order",
            value: 3
          }
        ],
        logisticsDialogVisible: false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatPayType(value) {
        if (value === 1) {
          return 'Alipay';
        } else if (value === 2) {
          return 'WeChat';
        } else {
          return 'Unpaid';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP Order';
        } else {
          return 'PC Order';
        }
      },
      formatStatus(value) {
        if (value === 1) {
          return 'To be Delivered';
        } else if (value === 2) {
          return 'Shipped';
        } else if (value === 3) {
          return 'Completed';
        } else if (value === 4) {
          return 'Closed';
        } else if (value === 5) {
          return 'Invalid Order';
        } else {
          return 'Pending Payment';
        }
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
      handleViewOrder(index, row) {
        this.$router.push({path: '/oms/orderDetail', query: {id: row.id}})
      },
      handleCloseOrder(index, row) {
        this.closeOrder.dialogVisible = true;
        this.closeOrder.orderIds = [row.id];
      },
      handleDeliveryOrder(index, row) {
        let listItem = this.covertOrder(row);
        this.$router.push({path: '/oms/deliverOrderList', query: {list: [listItem]}})
      },
      handleViewLogistics(index, row) {
        this.logisticsDialogVisible = true;
      },
      handleDeleteOrder(index, row) {
        let ids = [];
        ids.push(row.id);
        this.deleteOrder(ids);
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: 'Please Select the Order to Operate',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 1) {
          //bulk shipment
          let list = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status === 1) {
              list.push(this.covertOrder(this.multipleSelection[i]));
            }
          }
          if (list.length === 0) {
            this.$message({
              message: 'There are no orders that can be shipped in the selected order',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.$router.push({path: '/oms/deliverOrderList', query: {list: list}})
        } else if (this.operateType === 2) {
          //Close Order
          this.closeOrder.orderIds = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.closeOrder.orderIds.push(this.multipleSelection[i].id);
          }
          this.closeOrder.dialogVisible = true;
        } else if (this.operateType === 3) {
          //Delete Order
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          this.deleteOrder(ids);
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
      handleCloseOrderConfirm() {
        if (this.closeOrder.content == null || this.closeOrder.content === '') {
          this.$message({
            message: 'Operation note cannot be empty',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrder.orderIds);
        params.append('note', this.closeOrder.content);
        closeOrder(params).then(response => {
          this.closeOrder.orderIds = [];
          this.closeOrder.dialogVisible = false;
          this.getList();
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      deleteOrder(ids) {
        this.$confirm('Do you want to delete it?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteOrder(params).then(response => {
            this.$message({
              message: 'successfully deleted！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        })
      },
      covertOrder(order) {
        let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
        let listItem = {
          orderId: order.id,
          orderSn: order.orderSn,
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverPostCode: order.receiverPostCode,
          address: address,
          deliveryCompany: null,
          deliverySn: null
        };
        return listItem;
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>



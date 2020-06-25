<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Shipping List</span>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="deliverOrderTable" style="width: 100%;">
        <el-table-column align="center" label="Order SerialNumber" width="180">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column align="center" label="Receiver" width="180">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column align="center" label="Mobile PhoneNumber" width="160">
          <template slot-scope="scope">{{scope.row.receiverPhone}}</template>
        </el-table-column>
        <el-table-column align="center" label="Postal code" width="160">
          <template slot-scope="scope">{{scope.row.receiverPostCode}}</template>
        </el-table-column>
        <el-table-column align="center" label="Shipping address">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column align="center" label="Delivery Method" width="160">
          <template slot-scope="scope">
            <el-select placeholder="Please select a Delivery company"
                       size="small"
                       v-model="scope.row.deliveryCompany">
              <el-option :key="item"
                         :label="item"
                         :value="item"
                         v-for="item in companyOptions">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Delivery SerialNumber" width="180">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">Cancel</el-button>
        <el-button @click="confirm" type="primary">Confirm</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {deliveryOrder} from '@/api/order'

  const defaultLogisticsCompanies = ["SF Express", "Yuantong Express", "China Express", "YunDa delivery"];
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        list: [],
        companyOptions: defaultLogisticsCompanies
      }
    },
    created() {
      this.list = this.$route.query.list;
    },
    methods: {
      cancel() {
        this.$router.back();
      },
      confirm() {
        this.$confirm('Whether to carry out the shipping operation?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deliveryOrder(this.list).then(response => {
            this.$router.back();
            this.$message({
              type: 'success',
              message: 'Successful delivery!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delivery cancelled'
          });
        });
      }
    }
  }
</script>
<style></style>



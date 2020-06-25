<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">Returned Product</span>
      <el-table
        :data="productList"
        border
        class="standard-margin"
        ref="productTable">
        <el-table-column align="center" label="Product Picture" width="160">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height:80px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.productName}}</span><br>
            <span class="font-small">Brand：{{scope.row.productBrand}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Price/article number" width="180">
          <template slot-scope="scope">
            <span class="font-small">Price：${{scope.row.productRealPrice}}</span><br>
            <span class="font-small">Article number：NO.{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Attribute" width="180">
          <template slot-scope="scope">{{scope.row.productAttr}}</template>
        </el-table-column>
        <el-table-column align="center" label="Quantity" width="100">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Total Amount" width="100">
          <template slot-scope="scope">${{totalAmount}}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">Summation：</span>
        <span class="font-title-medium color-danger">${{totalAmount}}</span>
      </div>
    </el-card>
    <el-card class="standard-margin" shadow="never">
      <span class="font-title-medium">Service order information</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Service order number</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.id}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Order status</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.status | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">Order number
          </el-col>
          <el-col :span="18" class="form-border font-small" style="height:50px">
            {{orderReturnApply.orderSn}}
            <el-button @click="handleViewOrder" size="small" type="text">View Order</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Create Time</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.createTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">User Account</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.memberUsername}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Contact person</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.returnName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">contact PhoneNumber</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.returnPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Reasons for Return</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.reason}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Problem Description</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.description}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:100px;line-height:80px">Voucher picture
          </el-col>
          <el-col :span="18" class="form-border font-small" style="height:100px">
            <img :src="item" style="width:80px;height:80px" v-for="item in proofPics">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Order Amount</el-col>
          <el-col :span="18" class="form-border font-small">${{totalAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">Confirm the refund amount
          </el-col>
          <el-col :span="18" class="form-border font-small" style="height:52px">
            $
            <el-input :disabled="orderReturnApply.status!==0" size="small"
                      style="width:200px;margin-left: 10px"
                      v-model="updateStatusParam.returnAmount"></el-input>
          </el-col>
        </el-row>
        <div v-show="orderReturnApply.status!==3">
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">Choose delivery point
            </el-col>
            <el-col :span="18" class="form-border font-small" style="height:52px">
              <el-select :disabled="orderReturnApply.status!==0"
                         size="small"
                         style="width:200px"
                         v-model="updateStatusParam.companyAddressId">
                <el-option :key="address.id"
                           :label="address.addressName"
                           :value="address.id"
                           v-for="address in companyAddressList">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">Receiver name</el-col>
            <el-col :span="18" class="form-border font-small">{{currentAddress.name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">Your Region</el-col>
            <el-col :span="18" class="form-border font-small">{{currentAddress | formatRegion}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">Address</el-col>
            <el-col :span="18" class="form-border font-small">{{currentAddress.detailAddress}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">contact Phonenumber</el-col>
            <el-col :span="18" class="form-border font-small">{{currentAddress.phone}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status!==0">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Handler</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.handleMan}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Handle time</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.handleTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Handle Note</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.handleNote}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===2">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Receiver</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.receiveMan}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Receive Time</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.receiveTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">Receipt notes</el-col>
          <el-col :span="18" class="form-border font-small">{{orderReturnApply.receiveNote}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===0">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">Handle Note
          </el-col>
          <el-col :span="18" class="form-border font-small">
            <el-input size="small" style="width:200px;margin-left: 10px"
                      v-model="updateStatusParam.handleNote"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===1">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:52px;line-height:32px">Receive Note
          </el-col>
          <el-col :span="18" class="form-border font-small">
            <el-input size="small" style="width:200px;margin-left: 10px"
                      v-model="updateStatusParam.receiveNote"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===0">
        <el-button @click="handleUpdateStatus(1)" size="small" type="primary">Confirm return</el-button>
        <el-button @click="handleUpdateStatus(3)" size="small" type="danger">Refuse to return</el-button>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===1">
        <el-button @click="handleUpdateStatus(2)" size="small" type="primary">Confirm receipt</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {getApplyDetail, updateApplyStatus} from '@/api/returnApply';
  import {fetchList} from '@/api/companyAddress';
  import {formatDate} from '@/utils/date';

  const defaultUpdateStatusParam = {
    companyAddressId: null,
    handleMan: 'admin',
    handleNote: null,
    receiveMan: 'admin',
    receiveNote: null,
    returnAmount: 0,
    status: 0
  };
  const defaultOrderReturnApply = {
    id: null,
    orderId: null,
    companyAddressId: null,
    productId: null,
    orderSn: null,
    createTime: null,
    memberUsername: null,
    returnAmount: null,
    returnName: null,
    returnPhone: null,
    status: null,
    handleTime: null,
    productPic: null,
    productName: null,
    productBrand: null,
    productAttr: null,
    productCount: null,
    productPrice: null,
    productRealPrice: null,
    reason: null,
    description: null,
    proofPics: null,
    handleNote: null,
    handleMan: null,
    receiveMan: null,
    receiveTime: null,
    receiveNote: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        id: null,
        orderReturnApply: Object.assign({}, defaultOrderReturnApply),
        productList: null,
        proofPics: null,
        updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
        companyAddressList: null
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getDetail();
    },
    computed: {
      totalAmount() {
        if (this.orderReturnApply != null) {
          return this.orderReturnApply.productRealPrice * this.orderReturnApply.productCount;
        } else {
          return 0;
        }
      },
      currentAddress() {
        console.log("currentAddress()");
        let id = this.updateStatusParam.companyAddressId;
        if (this.companyAddressList == null) return {};
        for (let i = 0; i < this.companyAddressList.length; i++) {
          let address = this.companyAddressList[i];
          if (address.id === id) {
            return address;
          }
        }
        return null;
      }
    },
    filters: {
      formatStatus(status) {
        if (status === 0) {
          return "Pending";
        } else if (status === 1) {
          return "Returning";
        } else if (status === 2) {
          return "Completed";
        } else {
          return "Rejected";
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatRegion(address) {
        let str = address.province;
        if (address.city != null) {
          str += "  " + address.city;
        }
        str += "  " + address.region;
        return str;
      }
    },
    methods: {
      handleViewOrder() {
        this.$router.push({path: '/oms/orderDetail', query: {id: this.orderReturnApply.orderId}});
      },
      getDetail() {
        getApplyDetail(this.id).then(response => {
          console.log("getDetail");
          this.orderReturnApply = response.data;
          this.productList = [];
          this.productList.push(this.orderReturnApply);
          if (this.orderReturnApply.proofPics != null) {
            this.proofPics = this.orderReturnApply.proofPics.split(",")
          }
          //Return and neutralize
          if (this.orderReturnApply.status === 1 || this.orderReturnApply.status === 2) {
            this.updateStatusParam.returnAmount = this.orderReturnApply.returnAmount;
            this.updateStatusParam.companyAddressId = this.orderReturnApply.companyAddressId;
          }
          this.getCompanyAddressList();
        });
      },
      getCompanyAddressList() {
        fetchList().then(response => {
          console.log("getCompanyAddressList()");
          this.companyAddressList = response.data;
          for (let i = 0; i < this.companyAddressList.length; i++) {
            if (this.companyAddressList[i].receiveStatus === 1 && this.orderReturnApply.status === 0) {
              this.updateStatusParam.companyAddressId = this.companyAddressList[i].id;
            }
          }
        });
      },
      handleUpdateStatus(status) {
        this.updateStatusParam.status = status;
        this.$confirm('Do you want to do this?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateApplyStatus(this.id, this.updateStatusParam).then(response => {
            this.$message({
              type: 'success',
              message: 'Successful operation!',
              duration: 1000
            });
            this.$router.back();
          });
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>



<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" align-center finish-status="success">
        <el-step :description="formatTime(order.createTime)" title="Submit Orders"></el-step>
        <el-step :description="formatTime(order.paymentTime)" title="Payment Orders"></el-step>
        <el-step :description="formatTime(order.deliveryTime)" title="Delivery Time"></el-step>
        <el-step :description="formatTime(order.receiveTime)" title="Receive Time"></el-step>
        <el-step :description="formatTime(order.commentTime)" title="Comment Time"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">Current order status：{{order.status | formatStatus}}</span>
        <div class="operate-button-container" v-show="order.status===0">
          <el-button @click="showUpdateReceiverDialog" size="mini">Modify Receiver Information</el-button>
          <el-button size="mini">Edit Product Information</el-button>
          <el-button @click="showUpdateMoneyDialog" size="mini">Edit Cost Information</el-button>
          <el-button @click="showMessageDialog" size="mini">Send Message</el-button>
          <el-button @click="showCloseOrderDialog" size="mini">Close Order</el-button>
          <el-button @click="showMarkOrderDialog" size="mini">Mark Order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===1">
          <el-button @click="showUpdateReceiverDialog" size="mini">Modify Receiver Information</el-button>
          <el-button @click="showMessageDialog" size="mini">Send Message</el-button>
          <el-button size="mini">Cancel Order</el-button>
          <el-button @click="showMarkOrderDialog" size="mini">Mark Order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2||order.status===3">
          <el-button @click="showLogisticsDialog" size="mini">Order Tracking</el-button>
          <el-button @click="showMessageDialog" size="mini">Send Message</el-button>
          <el-button @click="showMarkOrderDialog" size="mini">Mark Order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===4">
          <el-button @click="handleDeleteOrder" size="mini">Delete Order</el-button>
          <el-button @click="showMarkOrderDialog" size="mini">Mark Order</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Basic Information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">Order SerialNumber</el-col>
          <el-col :span="4" class="table-cell-title">Invoice SerialNumber</el-col>
          <el-col :span="4" class="table-cell-title">User Account</el-col>
          <el-col :span="4" class="table-cell-title">Payment Method</el-col>
          <el-col :span="4" class="table-cell-title">Order Source</el-col>
          <el-col :span="4" class="table-cell-title">Order Type</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span="4" class="table-cell">No</el-col>
          <el-col :span="4" class="table-cell">{{order.memberUsername}}</el-col>
          <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">Delivery Method</el-col>
          <el-col :span="4" class="table-cell-title">Delivery SerialNumber</el-col>
          <el-col :span="4" class="table-cell-title">Automatic confirmation of receipt time</el-col>
          <el-col :span="4" class="table-cell-title">Orders can get Youcoin</el-col>
          <el-col :span="4" class="table-cell-title">Order growth value</el-col>
          <el-col :span="4" class="table-cell-title">Event Information</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.autoConfirmDay}}Day</el-col>
          <el-col :span="4" class="table-cell">{{order.integration}}</el-col>
          <el-col :span="4" class="table-cell">{{order.growth}}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              :content="order.promotionInfo"
              placement="top-start"
              title="Event Information"
              trigger="hover"
              width="200">
              <span slot="reference">{{order.promotionInfo | formatLongText}}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Recipient Information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Receiver</el-col>
          <el-col :span="6" class="table-cell-title">Mobile PhoneNumber</el-col>
          <el-col :span="6" class="table-cell-title">Postal code</el-col>
          <el-col :span="6" class="table-cell-title">Shipping address</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="6" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="6" class="table-cell">{{order.receiverPostCode}}</el-col>
          <el-col :span="6" class="table-cell">{{order | formatAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Product Information</span>
      </div>
      <el-table
        :data="order.orderItemList"
        border
        ref="orderItemTable" style="width: 100%;margin-top: 20px">
        <el-table-column align="center" label="Product Picture" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
            <p>品牌：{{scope.row.productBrand}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Price/Product SerialNumber" width="120">
          <template slot-scope="scope">
            <p>Price：${{scope.row.productPrice}}</p>
            <p>Product SerialNumber：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Attribute" width="120">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Quantity" width="120">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Total Price" width="120">
          <template slot-scope="scope">
            ${{scope.row.productPrice*scope.row.productQuantity}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">${{order.totalAmount}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Fee information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Total Products</el-col>
          <el-col :span="6" class="table-cell-title">Freight Amount</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Integration Amount</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">${{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">${{order.freightAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Promotion Amount</el-col>
          <el-col :span="6" class="table-cell-title">Discount Amount</el-col>
          <el-col :span="6" class="table-cell-title">Total Amount of Orders</el-col>
          <el-col :span="6" class="table-cell-title">Total Amount to Pay</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-${{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.discountAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.totalAmount+order.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.payAmount+order.freightAmount-order.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Operation Information</span>
      </div>
      <el-table :data="order.historyList"
                border
                ref="orderHistoryTable" style="margin-top: 20px;width: 100%">
        <el-table-column align="center" label="Operator" width="120">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Operating time" width="160">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Order Status" width="120">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Payment Status" width="120">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Delivery Status" width="120">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Note">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="receiverDialogVisible"
               title="Modify Receiver Information"
               width="40%">
      <el-form :model="receiverInfo"
               label-width="150px"
               ref="receiverInfoForm">
        <el-form-item label="Receiver Name：">
          <el-input style="width: 200px" v-model="receiverInfo.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="Mobile PhoneNumber：">
          <el-input style="width: 200px" v-model="receiverInfo.receiverPhone">
          </el-input>
        </el-form-item>
        <el-form-item label="Postal code：">
          <el-input style="width: 200px" v-model="receiverInfo.receiverPostCode">
          </el-input>
        </el-form-item>
        <el-form-item label="Your Region：">
          <v-distpicker :area="receiverInfo.receiverRegion"
                        :city="receiverInfo.receiverCity"
                        :province="receiverInfo.receiverProvince"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="Address：">
          <el-input rows="3" type="textarea" v-model="receiverInfo.receiverDetailAddress">
          </el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
      <el-button @click="receiverDialogVisible = false">Cancel</el-button>
      <el-button @click="handleUpdateReceiverInfo" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="moneyDialogVisible"
               title="Edit Cost Information"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Total Products</el-col>
          <el-col :span="6" class="table-cell-title">Freight Amount</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Integration Amount</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">${{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input size="mini" v-model.number="moneyInfo.freightAmount">
              <template slot="prepend">$</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-${{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Promotion Amount</el-col>
          <el-col :span="6" class="table-cell-title">Discount Amount</el-col>
          <el-col :span="6" class="table-cell-title">Total Amount of Orders</el-col>
          <el-col :span="6" class="table-cell-title">Total Amount to Pay</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-${{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input size="mini" v-model.number="moneyInfo.discountAmount">
              <template slot="prepend">-$</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.totalAmount+moneyInfo.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span class="dialog-footer" slot="footer">
      <el-button @click="moneyDialogVisible = false">Cancel</el-button>
      <el-button @click="handleUpdateMoneyInfo" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="messageDialogVisible"
               title="Send Message"
               width="40%">
      <el-form :model="message"
               label-width="150px"
               ref="receiverInfoForm">
        <el-form-item label="Title：">
          <el-input style="width: 200px" v-model="message.title"></el-input>
        </el-form-item>
        <el-form-item label="Content：">
          <el-input rows="3" type="textarea" v-model="message.content">
          </el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="messageDialogVisible = false">Cancel</el-button>
        <el-button @click="handleSendMessage" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="closeDialogVisible"
               title="Close Order"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="Operation Notes：">
          <el-input rows="3" type="textarea" v-model="closeInfo.note">
          </el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="closeDialogVisible = false">Cancel</el-button>
        <el-button @click="handleCloseOrder" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="markOrderDialogVisible"
               title="Mark Order"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="Operation Notes：">
          <el-input rows="3" type="textarea" v-model="markInfo.note">
          </el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="markOrderDialogVisible = false">Cancel</el-button>
        <el-button @click="handleMarkOrder" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {
    closeOrder,
    deleteOrder,
    getOrderDetail,
    updateMoneyInfo,
    updateOrderNote,
    updateReceiverInfo
  } from '@/api/order';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';

  const defaultReceiverInfo = {
    orderId: null,
    receiverName: null,
    receiverPhone: null,
    receiverPostCode: null,
    receiverDetailAddress: null,
    receiverProvince: null,
    receiverCity: null,
    receiverRegion: null,
    status: null
  };
  export default {
    name: 'orderDetail',
    components: {VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        receiverDialogVisible: false,
        receiverInfo: Object.assign({}, defaultReceiverInfo),
        moneyDialogVisible: false,
        moneyInfo: {orderId: null, freightAmount: 0, discountAmount: 0, status: null},
        messageDialogVisible: false,
        message: {title: null, content: null},
        closeDialogVisible: false,
        closeInfo: {note: null, id: null},
        markOrderDialogVisible: false,
        markInfo: {note: null},
        logisticsDialogVisible: false
      }
    },
    created() {
      this.id = this.list = this.$route.query.id;
      getOrderDetail(this.id).then(response => {
        this.order = response.data;
      });
    },
    filters: {
      formatNull(value) {
        if (value === undefined || value === null || value === '') {
          return 'No';
        } else {
          return value;
        }
      },
      formatLongText(value) {
        if (value === undefined || value === null || value === '') {
          return 'No';
        } else if (value.length > 8) {
          return value.substr(0, 8) + '...';
        } else {
          return value;
        }
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
      formatOrderType(value) {
        if (value === 1) {
          return 'Flash Promotion Order';
        } else {
          return 'Normal Order';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
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
      formatPayStatus(value) {
        if (value === 0) {
          return 'Unpaid';
        } else if (value === 4) {
          return 'Refunded';
        } else {
          return 'Paid';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0 || value === 1) {
          return 'Not shipped';
        } else {
          return 'Shipped';
        }
      },
      formatProductAttr(value) {
        if (value == null) {
          return '';
        } else {
          let attr = JSON.parse(value);
          let result = '';
          for (let i = 0; i < attr.length; i++) {
            result += attr[i].key;
            result += ":";
            result += attr[i].value;
            result += ";";
          }
          return result;
        }
      }
    },
    methods: {
      onSelectRegion(data) {
        this.receiverInfo.receiverProvince = data.province.value;
        this.receiverInfo.receiverCity = data.city.value;
        this.receiverInfo.receiverRegion = data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === 1) {
          //To be Delivered
          return 2;
        } else if (value === 2) {
          //Shipped
          return 3;
        } else if (value === 3) {
          //Completed
          return 4;
        } else {
          //Pending Payment、Closed、Unlimited orders
          return 1;
        }
      },
      showUpdateReceiverDialog() {
        this.receiverDialogVisible = true;
        this.receiverInfo = {
          orderId: this.order.id,
          receiverName: this.order.receiverName,
          receiverPhone: this.order.receiverPhone,
          receiverPostCode: this.order.receiverPostCode,
          receiverDetailAddress: this.order.receiverDetailAddress,
          receiverProvince: this.order.receiverProvince,
          receiverCity: this.order.receiverCity,
          receiverRegion: this.order.receiverRegion,
          status: this.order.status
        }
      },
      handleUpdateReceiverInfo() {
        this.$confirm('Do you want to modify the receipt information?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response => {
            this.receiverDialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showUpdateMoneyDialog() {
        this.moneyDialogVisible = true;
        this.moneyInfo.orderId = this.order.id;
        this.moneyInfo.freightAmount = this.order.freightAmount;
        this.moneyInfo.discountAmount = this.order.discountAmount;
        this.moneyInfo.status = this.order.status;
      },
      handleUpdateMoneyInfo() {
        this.$confirm('Do you want to modify the cost information?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response => {
            this.moneyDialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showMessageDialog() {
        this.messageDialogVisible = true;
        this.message.title = null;
        this.message.content = null;
      },
      handleSendMessage() {
        this.$confirm('Do you want to send an internal message?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.messageDialogVisible = false;
          this.$message({
            type: 'success',
            message: 'Sent Successfully!'
          });
        });
      },
      showCloseOrderDialog() {
        this.closeDialogVisible = true;
        this.closeInfo.note = null;
        this.closeInfo.id = this.id;
      },
      handleCloseOrder() {
        this.$confirm('Do you want to close?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", [this.closeInfo.id]);
          params.append("note", this.closeInfo.note);
          closeOrder(params).then(response => {
            this.closeDialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Order closed successfully!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showMarkOrderDialog() {
        this.markOrderDialogVisible = true;
        this.markInfo.id = this.id;
        this.closeOrder.note = null;
      },
      handleMarkOrder() {
        this.$confirm('Do you want to Confirm the order?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("id", this.markInfo.id);
          params.append("note", this.markInfo.note);
          params.append("status", this.order.status);
          updateOrderNote(params).then(response => {
            this.markOrderDialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Order note successfully!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      handleDeleteOrder() {
        this.$confirm('Do you want to delete it?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", [this.id]);
          deleteOrder(params).then(response => {
            this.$message({
              message: 'successfully deleted！',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
          });
        })
      },
      showLogisticsDialog() {
        this.logisticsDialogVisible = true;
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>



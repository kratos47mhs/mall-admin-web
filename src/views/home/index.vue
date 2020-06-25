<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">Back-end project</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall">mall</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">Front-end project</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall-admin-web">mall-admin-web</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">Mall Learning</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall-learning">mall-learning</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">Total orders today</div>
            <div class="total-value">200</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">Total sales today</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">Total sales yesterday</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <!--<el-col :span="6">-->
        <!--<div class="total-frame">-->
        <!--<svg-icon icon-class="total-week" class="total-icon">-->
        <!--</svg-icon>-->
        <!--<div class="total-title">Total sales in the last 7 days</div>-->
        <!--<div class="total-value">￥50000.00</div>-->
        <!--</div>-->
        <!--</el-col>-->
      </el-row>
    </div>
    <el-card class="mine-layout">
      <div style="text-align: center">
        <img height="150px" src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg"
             width="150px">
      </div>
      <div style="text-align: center">Full set of learning tutorials in mall！</div>
      <div style="text-align: center;margin-top: 5px"><span class="color-main">Pay attention to the public number</span>，Get
        it the first time.
      </div>
    </el-card>
    <div class="un-handle-layout">
      <div class="layout-title">Pending transaction</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending order</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Completed order</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending receipt confirmation</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending order</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">New Out of Stock Registration</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending refund application</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Shipped order</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Pending return order</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">Ad slot is about to expire</span>
              <span class="color-danger" style="float: right">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">Product Overview</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">400</el-col>
                <el-col :span="6" class="color-danger overview-item-value">50</el-col>
                <el-col :span="6" class="color-danger overview-item-value">500</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">Withdrawn</el-col>
                <el-col :span="6" class="overview-item-title">It has been added to</el-col>
                <el-col :span="6" class="overview-item-title">Tight inventory</el-col>
                <el-col :span="6" class="overview-item-title">all products</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">User Overview</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">Added today</el-col>
                <el-col :span="6" class="overview-item-title">Added yesterday</el-col>
                <el-col :span="6" class="overview-item-title">New this month</el-col>
                <el-col :span="6" class="overview-item-title">Total members</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">Order statistics</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">Total orders this month</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">Same as last month</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">Total orders this week</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">Same as last week</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">Total sales this month</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">Same as last month</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">Total sales this week</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">Same as last week</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              :picker-options="pickerOptions"
              @change="handleDateChange"
              align="right"
              end-placeholder="End date"
              range-separator="to"
              size="small"
              start-placeholder="Start date"
              style="float: right;z-index: 1"
              type="daterange"
              unlink-panels
              v-model="orderCountDate">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :data-empty="dataEmpty"
                :legend-visible="false"
                :loading="loading"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';

  const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount', 'orderAmount'],
    rows: [
      {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
      {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
      {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
      {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
      {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
      {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
    ]
  };
  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area: true,
          axisSite: {right: ['orderAmount']},
          labelMap: {'orderCount': 'Quantity of Order', 'orderAmount': 'Order Amount'}
        },
        chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    created() {
      this.initOrderCountDate();
      this.getData();
    },
    methods: {
      handleDateChange() {
        this.getData();
      },
      initOrderCountDate() {
        let start = new Date();
        start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate = [start, end];
      },
      getData() {
        setTimeout(() => {
          this.chartData = {
            columns: ['date', 'orderCount', 'orderAmount'],
            rows: []
          };
          for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
            let item = DATA_FROM_BACKEND.rows[i];
            let currDate = str2Date(item.date);
            let start = this.orderCountDate[0];
            let end = this.orderCountDate[1];
            if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
              this.chartData.rows.push(item);
            }
          }
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }

  .address-content {
    padding: 20px;
    font-size: 18px
  }
</style>

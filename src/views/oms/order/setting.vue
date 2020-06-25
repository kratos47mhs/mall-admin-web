<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="orderSetting"
             :rules="rules"
             label-width="150px"
             ref="orderSettingForm">
      <el-form-item label="Flash Promotion orders exceeded：" prop="flashOrderOvertime">
        <el-input class="input-width" v-model="orderSetting.flashOrderOvertime">
          <template slot="append">分</template>
        </el-input>
        <span class="note-margin">Unpaid，Orders are automatically Closed</span>
      </el-form-item>
      <el-form-item label="Normal order exceeds：" prop="normalOrderOvertime">
        <el-input class="input-width" v-model="orderSetting.normalOrderOvertime">
          <template slot="append">分</template>
        </el-input>
        <span class="note-margin">Unpaid，Orders are automatically Closed</span>
      </el-form-item>
      <el-form-item label="Shipped over：" prop="confirmOvertime">
        <el-input class="input-width" v-model="orderSetting.confirmOvertime">
          <template slot="append">Day</template>
        </el-input>
        <span class="note-margin">Unreceived，Orders are automatically completed</span>
      </el-form-item>
      <el-form-item label="Order completion exceeded：" prop="finishOvertime">
        <el-input class="input-width" v-model="orderSetting.finishOvertime">
          <template slot="append">Day</template>
        </el-input>
        <span class="note-margin">Automatically close the transaction，Cannot apply for after sales</span>
      </el-form-item>
      <el-form-item label="Order completion exceeded：" prop="commentOvertime">
        <el-input class="input-width" v-model="orderSetting.commentOvertime">
          <template slot="append">Day</template>
        </el-input>
        <span class="note-margin">Automatic five-star praise</span>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="confirm('orderSettingForm')"
          type="primary">Submit
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {getOrderSetting, updateOrderSetting} from '@/api/orderSetting';

  const defaultOrderSetting = {
    id: null,
    flashOrderOvertime: 0,
    normalOrderOvertime: 0,
    confirmOvertime: 0,
    finishOvertime: 0,
    commentOvertime: 0
  };
  const checkTime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('Time cannot be empty'));
    }
    console.log("checkTime", value);
    let intValue = parseInt(value);
    if (!Number.isInteger(intValue)) {
      return callback(new Error('Please enter a numeric value'));
    }
    callback();
  };
  export default {
    name: 'orderSetting',
    data() {
      return {
        orderSetting: Object.assign({}, defaultOrderSetting),
        rules: {
          flashOrderOvertime: {validator: checkTime, trigger: 'blur'},
          normalOrderOvertime: {validator: checkTime, trigger: 'blur'},
          confirmOvertime: {validator: checkTime, trigger: 'blur'},
          finishOvertime: {validator: checkTime, trigger: 'blur'},
          commentOvertime: {validator: checkTime, trigger: 'blur'}
        }
      }
    },
    created() {
      this.getDetail();
    },
    methods: {
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('Do you want to submit changes?', 'Prompt', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              updateOrderSetting(1, this.orderSetting).then(response => {
                this.$message({
                  type: 'success',
                  message: 'Submitted successfully!',
                  duration: 1000
                });
              })
            });
          } else {
            this.$message({
              message: 'Submit parameter is invalid',
              type: 'warning'
            });
            return false;
          }
        });
      },
      getDetail() {
        getOrderSetting(1).then(response => {
          this.orderSetting = response.data;
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
</style>



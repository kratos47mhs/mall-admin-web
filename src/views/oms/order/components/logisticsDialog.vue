<template>
  <el-dialog :before-close="handleClose"
             :visible.sync="visible"
             title="Order Tracking"
             width="40%">
    <el-steps :active="6"
              direction="vertical"
              finish-status="success"
              space="50px">
      <el-step :description="item.time"
               :key="item.name"
               :title="item.name"
               v-for="item in logisticsList"></el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
  const defaultLogisticsList = [
    {name: 'Order has been submitted, waiting for payment', time: '2017-04-01 12:00:00 '},
    {name: 'Order payment successful', time: '2017-04-01 12:00:00 '},
    {name: 'Scan for subordinate locations in Beijing, waiting for payment', time: '2017-04-01 12:00:00 '},
    {name: 'Carry out unloading scan at the distribution center Guangdong Shenzhen Company, waiting for payment', time: '2017-04-01 12:00:00 '},
    {name: 'Scanning issued in Guangdong Shenzhen company', time: '2017-04-01 12:00:00 '},
    {name: 'Arrival at the destination Shenzhen Guangdong Shenzhen company, the express will be delivered soon', time: '2017-04-01 12:00:00 '},
    {name: 'The order has been signed and I look forward to serving you again', time: '2017-04-01 12:00:00 '}
  ];
  export default {
    name: 'logisticsDialog',
    props: {
      value: Boolean
    },
    computed: {
      visible: {
        get() {
          return this.value;
        },
        set(visible) {
          this.value = visible;
        }
      }
    },
    data() {
      return {
        logisticsList: Object.assign({}, defaultLogisticsList)
      }
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleClose() {
        this.emitInput(false);
      }
    }
  }
</script>
<style></style>



<template>
  <div style="margin-top: 50px">
    <el-form :model="value" label-width="120px" ref="productSaleForm" size="small" style="width: 600px">
      <el-form-item label="Gift Points：">
        <el-input v-model="value.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="Gift Growth Value：">
        <el-input v-model="value.giftGrowth"></el-input>
      </el-form-item>
      <el-form-item label="Use Point Limit：">
        <el-input v-model="value.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="Preview Status：">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="value.previewStatus">
        </el-switch>
      </el-form-item>
      <el-form-item label="Product on the shelf：">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="value.publishStatus">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">New Product</span>
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="value.newStatus">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">Recommendation</span>
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="value.recommandStatus">
        </el-switch>
      </el-form-item>
      <el-form-item label="Service Guarantee：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Detailed page title：">
        <el-input v-model="value.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="Detailed page description：">
        <el-input v-model="value.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="Product keywords：">
        <el-input v-model="value.keywords"></el-input>
      </el-form-item>
      <el-form-item label="Product Note：">
        <el-input :autoSize="true" type="textarea" v-model="value.note"></el-input>
      </el-form-item>
      <el-form-item label="Choose Promotion Type：">
        <el-radio-group size="small" v-model="value.promotionType">
          <el-radio-button :label="0">No discount</el-radio-button>
          <el-radio-button :label="1">Special Promotion</el-radio-button>
          <el-radio-button :label="2">member price</el-radio-button>
          <el-radio-button :label="3">Ladder price</el-radio-button>
          <el-radio-button :label="4">Full price</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="value.promotionType===1">
        <div>
          Starting time：
          <el-date-picker
            :picker-options="pickerOptions1"
            placeholder="Choose Start Time"
            type="datetime"
            v-model="value.promotionStartTime"
            value-format="timestamp">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          End Time：
          <el-date-picker
            :picker-options="pickerOptions1"
            placeholder="Choose End Time"
            type="datetime"
            v-model="value.promotionEndTime"
            value-format="timestamp">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          Sales price：
          <el-input placeholder="Enter Promotional price" style="width: 220px" v-model="value.promotionPrice"></el-input>
        </div>

      </el-form-item>
      <el-form-item v-show="value.promotionType===2">
        <div :class="{littleMargin:index!==0}" v-for="(item, index) in value.memberPriceList">
          {{item.memberLevelName}}：
          <el-input style="width: 200px" v-model="item.memberPrice"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="value.promotionType===3">
        <el-table :data="value.productLadderList"
                  border style="width: 80%">
          <el-table-column
            align="center"
            label="Quantity"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Discount"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Manipulate">
            <template slot-scope="scope">
              <el-button @click="handleRemoveProductLadder(scope.$index, scope.row)" type="text">Delete</el-button>
              <el-button @click="handleAddProductLadder(scope.$index, scope.row)" type="text">Add</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="value.promotionType===4">
        <el-table :data="value.productFullReductionList"
                  border style="width: 80%">
          <el-table-column
            align="center"
            label="Full"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Reduce"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Manipulate">
            <template slot-scope="scope">
              <el-button @click="handleRemoveFullReduction(scope.$index, scope.row)" type="text">Delete</el-button>
              <el-button @click="handleAddFullReduction(scope.$index, scope.row)" type="text">Add</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button @click="handlePrev" size="medium">Previous，Fill in product information</el-button>
        <el-button @click="handleNext" size="medium" type="primary">Next step，Fill in product attributes</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchList as fetchMemberLevelList} from '@/api/memberLevel'

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //Date picker configuration
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        }
      }
    },
    created() {
      if (this.isEdit) {
        // this.handleEditCreated();
      } else {
        fetchMemberLevelList({defaultStatus: 0}).then(response => {
          let memberPriceList = [];
          for (let i = 0; i < response.data.length; i++) {
            let item = response.data[i];
            memberPriceList.push({memberLevelId: item.id, memberLevelName: item.name})
          }
          this.value.memberPriceList = memberPriceList;
        });
      }
    },
    computed: {
      //选中的服务保证
      selectServiceList: {
        get() {
          let list = [];
          if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') return list;
          let ids = this.value.serviceIds.split(',');
          for (let i = 0; i < ids.length; i++) {
            list.push(Number(ids[i]));
          }
          return list;
        },
        set(newValue) {
          let serviceIds = '';
          if (newValue != null && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              serviceIds += newValue[i] + ',';
            }
            if (serviceIds.endsWith(',')) {
              serviceIds = serviceIds.substr(0, serviceIds.length - 1)
            }
            this.value.serviceIds = serviceIds;
          } else {
            this.value.serviceIds = null;
          }
        }
      }
    },
    methods: {
      handleEditCreated() {
        let ids = this.value.serviceIds.split(',');
        console.log('handleEditCreated', ids);
        for (let i = 0; i < ids.length; i++) {
          this.selectServiceList.push(Number(ids[i]));
        }
      },
      handleRemoveProductLadder(index, row) {
        let productLadderList = this.value.productLadderList;
        if (productLadderList.length === 1) {
          productLadderList.pop();
          productLadderList.push({
            count: 0,
            discount: 0,
            price: 0
          })
        } else {
          productLadderList.splice(index, 1);
        }
      },
      handleAddProductLadder(index, row) {
        let productLadderList = this.value.productLadderList;
        if (productLadderList.length < 3) {
          productLadderList.push({
            count: 0,
            discount: 0,
            price: 0
          })
        } else {
          this.$message({
            message: 'You can only add Three item',
            type: 'warning'
          });
        }
      },
      handleRemoveFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length === 1) {
          fullReductionList.pop();
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          fullReductionList.splice(index, 1);
        }
      },
      handleAddFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length < 3) {
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          this.$message({
            message: 'You can only add Three item',
            type: 'warning'
          });
        }
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>

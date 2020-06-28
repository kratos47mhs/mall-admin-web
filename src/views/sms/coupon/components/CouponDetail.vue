<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="coupon"
             :rules="rules"
             label-width="150px"
             ref="couponFrom"
             size="small">
      <el-form-item label="Coupon type：">
        <el-select v-model="coupon.type">
          <el-option
            :key="type.value"
            :label="type.label"
            :value="type.value"
            v-for="type in typeOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Coupon name：" prop="name">
        <el-input class="input-width" v-model="coupon.name"></el-input>
      </el-form-item>
      <el-form-item label="Coupon platform：">
        <el-select v-model="coupon.platform">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in platformOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Total Issue：" prop="publishCount">
        <el-input class="input-width" placeholder="Only positive integers can be entered" v-model.number="coupon.publishCount"></el-input>
      </el-form-item>
      <el-form-item label="面额：" prop="amount">
        <el-input class="input-width" placeholder="The face value can only be a numeric value, limited to 2 decimal places" v-model.number="coupon.amount">
          <template slot="append">Dollar</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每人限领：">
        <el-input class="input-width" placeholder="Only positive integers can be entered" v-model="coupon.perLimit">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Use threshold：" prop="minPoint">
        <el-input class="input-width" placeholder="Only positive integers can be entered" v-model.number="coupon.minPoint">
          <template slot="prepend">Full</template>
          <template slot="append">Yuan available</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Expiry date：">
        <el-date-picker placeholder="Select Date" style="width: 150px" type="date" v-model="coupon.startTime"></el-date-picker>
        <span style="margin-left: 20px;margin-right: 20px">To</span>
        <el-date-picker placeholder="Select Date" style="width: 150px" type="date" v-model="coupon.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="Usable products：">
        <el-radio-group v-model="coupon.useType">
          <el-radio-button :label="0">Universal</el-radio-button>
          <el-radio-button :label="1">Designated category</el-radio-button>
          <el-radio-button :label="2">Designated product</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="coupon.useType===1">
        <el-cascader
          :options="productCateOptions"
          clearable
          placeholder="Please select a category name"
          v-model="selectProductCate">
        </el-cascader>
        <el-button @click="handleAddProductCategoryRelation()">Add</el-button>
        <el-table :data="coupon.productCategoryRelationList"
                  border
                  ref="productCateRelationTable"
                  style="width: 100%;margin-top: 20px">
          <el-table-column align="center" label="Category Name">
            <template slot-scope="scope">{{scope.row.parentCategoryName}}>{{scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column align="center" label="Manipulate" width="100">
            <template slot-scope="scope">
              <el-button @click="handleDeleteProductCateRelation(scope.$index, scope.row)"
                         size="mini"
                         type="text">Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="coupon.useType===2">
        <el-select
          :loading="selectProductLoading"
          :remote-method="searchProductMethod"
          filterable
          placeholder="Product Name/Product SerialNumber"
          remote
          reserve-keyword
          v-model="selectProduct">
          <el-option
            :key="item.productId"
            :label="item.productName"
            :value="item.productId"
            v-for="item in selectProductOptions">
            <span style="float: left">{{ item.productName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.productSn }}</span>
          </el-option>
        </el-select>
        <el-button @click="handleAddProductRelation()">Add</el-button>
        <el-table :data="coupon.productRelationList"
                  border
                  ref="productRelationTable"
                  style="width: 100%;margin-top: 20px">
          <el-table-column align="center" label="Product Name">
            <template slot-scope="scope">{{scope.row.productName}}</template>
          </el-table-column>
          <el-table-column align="center" label="Product SerialNumber" width="120">
            <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
          </el-table-column>
          <el-table-column align="center" label="Manipulate" width="100">
            <template slot-scope="scope">
              <el-button @click="handleDeleteProductRelation(scope.$index, scope.row)"
                         size="mini"
                         type="text">Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="Note：">
        <el-input
          :rows="5"
          class="input-width"
          placeholder="Please Enter"
          type="textarea"
          v-model="coupon.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('couponFrom')" type="primary">Submit</el-button>
        <el-button @click="resetForm('couponFrom')" v-if="!isEdit">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCoupon, getCoupon, updateCoupon} from '@/api/coupon';
  import {fetchSimpleList as fetchProductList} from '@/api/product';
  import {fetchListWithChildren} from '@/api/productCate'

  const defaultCoupon = {
    type: 0,
    name: null,
    platform: 0,
    amount: null,
    perLimit: 1,
    minPoint: null,
    startTime: null,
    endTime: null,
    useType: 0,
    note: null,
    publishCount: null,
    productRelationList: [],
    productCategoryRelationList: []
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
  const defaultPlatformOptions = [
    {
      label: 'Full platform',
      value: 0
    },
    {
      label: 'Mobile platform',
      value: 1
    },
    {
      label: 'PC platform',
      value: 2
    }
  ];
  export default {
    name: 'CouponDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupon: Object.assign({}, defaultCoupon),
        typeOptions: Object.assign({}, defaultTypeOptions),
        platformOptions: Object.assign({}, defaultPlatformOptions),
        rules: {
          name: [
            {required: true, message: 'Please enter the coupon name', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ],
          publishCount: [
            {type: 'number', required: true, message: 'Only positive integers can be entered', trigger: 'blur'}
          ],
          amount: [
            {type: 'number', required: true, message: 'The face value can only be a numeric value, 0.01-10000, limited to 2 decimal places', trigger: 'blur'}
          ],
          minPoint: [
            {type: 'number', required: true, message: 'Only positive integers can be entered', trigger: 'blur'}
          ]
        },
        selectProduct: null,
        selectProductLoading: false,
        selectProductOptions: [],
        selectProductCate: null,
        productCateOptions: []
      }
    },
    created() {
      if (this.isEdit) {
        getCoupon(this.$route.query.id).then(response => {
          this.coupon = response.data;
        });
      }
      this.getProductCateList();
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('Whether to Submit Data', 'Prompt', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateCoupon(this.$route.query.id, this.coupon).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: 'Successfully modified',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createCoupon(this.coupon).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: 'Submitted successfully',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              }
            });
          } else {
            this.$message({
              message: 'Verification Failed',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.coupon = Object.assign({}, defaultCoupon);
      },
      searchProductMethod(query) {
        if (query !== '') {
          this.loading = true;
          fetchProductList({keyword: query}).then(response => {
            this.loading = false;
            let productList = response.data;
            this.selectProductOptions = [];
            for (let i = 0; i < productList.length; i++) {
              let item = productList[i];
              this.selectProductOptions.push({productId: item.id, productName: item.name, productSn: item.productSn});
            }
          });
        } else {
          this.selectProductOptions = [];
        }
      },
      handleAddProductRelation() {
        if (this.selectProduct === null) {
          this.$message({
            message: 'Please select the product first',
            type: 'warning'
          });
          return
        }
        this.coupon.productRelationList.push(this.getProductById(this.selectProduct));
        this.selectProduct = null;
      },
      handleDeleteProductRelation(index, row) {
        this.coupon.productRelationList.splice(index, 1);
      },
      handleAddProductCategoryRelation() {
        if (this.selectProductCate === null || this.selectProductCate.length === 0) {
          this.$message({
            message: 'Please select the product category first',
            type: 'warning'
          });
          return
        }
        this.coupon.productCategoryRelationList.push(this.getProductCateByIds(this.selectProductCate));
        this.selectProductCate = [];
      },
      handleDeleteProductCateRelation(index, row) {
        this.coupon.productCategoryRelationList.splice(index, 1);
      },
      getProductById(id) {
        for (let i = 0; i < this.selectProductOptions.length; i++) {
          if (id === this.selectProductOptions[i].productId) {
            return this.selectProductOptions[i];
          }
        }
        return null;
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        });
      },
      getProductCateByIds(ids) {
        let name;
        let parentName;
        for (let i = 0; i < this.productCateOptions.length; i++) {
          if (this.productCateOptions[i].value === ids[0]) {
            parentName = this.productCateOptions[i].label;
            for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
              if (this.productCateOptions[i].children[j].value === ids[1]) {
                name = this.productCateOptions[i].children[j].label;
              }
            }
          }
        }
        return {productCategoryId: ids[1], productCategoryName: name, parentCategoryName: parentName};
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>



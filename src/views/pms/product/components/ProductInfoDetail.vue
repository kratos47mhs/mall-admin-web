<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" label-width="120px" ref="productInfoForm" size="small" style="width: 600px">
      <el-form-item label="Categories：" prop="productCategoryId">
        <el-cascader
          :options="productCateOptions"
          v-model="selectProductCateValue">
        </el-cascader>
      </el-form-item>
      <el-form-item label="Product Name：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="Subtitle：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="Product Brand：" prop="brandId">
        <el-select
          @change="handleBrandChange"
          placeholder="Please select a brand"
          v-model="value.brandId">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in brandOptions">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Product Desciption：">
        <el-input
          :autoSize="true"
          placeholder="Please Enter"
          type="textarea"
          v-model="value.description"></el-input>
      </el-form-item>
      <el-form-item label="Product SerialNumber：">
        <el-input v-model="value.productSn"></el-input>
      </el-form-item>
      <el-form-item label="Product price：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="Original Price：">
        <el-input v-model="value.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="Product stocks：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item label="Unit of Measurement：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="Product Weight：">
        <el-input style="width: 300px" v-model="value.weight"></el-input>
        <span style="margin-left: 20px">Weight</span>
      </el-form-item>
      <el-form-item label="Sort">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button @click="handleNext('productInfoForm')" size="medium" type="primary">Next step，Fill in product promotion</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated: false,
        //The value of the selected product category
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
        rules: {
          name: [
            {required: true, message: 'Please enter the product name', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ],
          subTitle: [{required: true, message: 'Please enter the Product Subtitle', trigger: 'blur'}],
          productCategoryId: [{required: true, message: 'Please select Product Category', trigger: 'blur'}],
          brandId: [{required: true, message: 'Please select Product Brand', trigger: 'blur'}],
          description: [{required: true, message: 'Please enter the Product Description', trigger: 'blur'}],
          requiredProp: [{required: true, message: 'This item is Required', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateList();
      this.getBrandList();
    },
    computed: {
      //Product ID
      productId() {
        return this.value.id;
      }
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return;
        if (this.hasEditCreated) return;
        if (newValue === undefined || newValue == null || newValue === 0) return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName = this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName = null;
        }
      }
    },
    methods: {
      //Processing editing logic
      handleEditCreated() {
        if (this.value.productCategoryId != null) {
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated = true;
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
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getCateNameById(id) {
        let name = null;
        for (let i = 0; i < this.productCateOptions.length; i++) {
          for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
            if (this.productCateOptions[i].children[j].value === id) {
              name = this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
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
      handleBrandChange(val) {
        let brandName = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            brandName = this.brandOptions[i].label;
            break;
          }
        }
        this.value.brandName = brandName;
      }
    }
  }
</script>

<style scoped>
</style>

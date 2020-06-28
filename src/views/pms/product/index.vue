<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          @click="handleSearchList()"
          size="small"
          style="float: right"
          type="primary">
          Search Result
        </el-button>
        <el-button
          @click="handleResetSearch()"
          size="small"
          style="float: right;margin-right: 15px">
          Reset
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px" size="small">
          <el-form-item label="Enter search：">
            <el-input placeholder="Product Name" style="width: 203px" v-model="listQuery.keyword"></el-input>
          </el-form-item>
          <el-form-item label="Product SerialNumber：">
            <el-input placeholder="Product SerialNumber" style="width: 203px" v-model="listQuery.productSn"></el-input>
          </el-form-item>
          <el-form-item label="Categories：">
            <el-cascader
              :options="productCateOptions"
              clearable
              v-model="selectProductCateValue">
            </el-cascader>
          </el-form-item>
          <el-form-item label="Product Brand：">
            <el-select clearable placeholder="Please select a brand" v-model="listQuery.brandId">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in brandOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Product on the shelf：">
            <el-select clearable placeholder="All" v-model="listQuery.publishStatus">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in publishStatusOptions">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Verify Status：">
            <el-select clearable placeholder="All" v-model="listQuery.verifyStatus">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in verifyStatusOptions">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button
        @click="handleAddProduct()"
        class="btn-add"
        size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="productTable"
                style="width: 100%"
                v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product Picture" width="120">
          <template slot-scope="scope"><img :src="scope.row.pic" style="height: 80px"></template>
        </el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>Brand：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Price/Product SerialNumber" width="120">
          <template slot-scope="scope">
            <p>Price：${{scope.row.price}}</p>
            <p>Product SerialNumber：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Label" width="140">
          <template slot-scope="scope">
            <p>Put on shelf：
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>New Product：
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="handleNewStatusChange(scope.$index, scope.row)"
                v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>Recommendation：
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column align="center" label="SKU inventory" width="100">
          <template slot-scope="scope">
            <el-button @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle icon="el-icon-edit"
                       type="primary"></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sales" width="100">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column align="center" label="Verify Status" width="100">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button
                @click="handleShowVerifyDetail(scope.$index, scope.row)"
                type="text">Verify Detail
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="160">
          <template slot-scope="scope">
            <p>
              <el-button
                @click="handleShowProduct(scope.$index, scope.row)"
                size="mini">Show Product
              </el-button>
              <el-button
                @click="handleUpdateProduct(scope.$index, scope.row)"
                size="mini">Update Product
              </el-button>
            </p>
            <p>
              <el-button
                @click="handleShowLog(scope.$index, scope.row)"
                size="mini">Show Log
              </el-button>
              <el-button
                @click="handleDelete(scope.$index, scope.row)"
                size="mini"
                type="danger">Delete
              </el-button>
            </p>
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
          v-for="item in operates">
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
      :visible.sync="editSkuInfo.dialogVisible"
      title="Edit product information"
      width="40%">
      <span>Product SerialNumber：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="Search by sku number" size="small" style="width: 50%;margin-left: 20px" v-model="editSkuInfo.keyword">
        <el-button @click="handleSearchEditSku" icon="el-icon-search" slot="append"></el-button>
      </el-input>
      <el-table :data="editSkuInfo.stockList"
                border
                style="width: 100%;margin-top: 20px">
        <el-table-column
          align="center"
          label="SKU number">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.id"
          :label="item.name"
          align="center"
          v-for="(item,index) in editSkuInfo.productAttr">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="Selling Price"
          width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="Product stocks"
          width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="Stock warning value"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editSkuInfo.dialogVisible = false">Cancel</el-button>
        <el-button @click="handleEditSkuConfirm" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updatePublishStatus,
    updateRecommendStatus
  } from '@/api/product'
  import {fetchList as fetchSkuStockList, update as updateSkuStockList} from '@/api/skuStock'
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchListWithChildren} from '@/api/productCate'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo: {
          dialogVisible: false,
          productId: null,
          productSn: '',
          productAttributeCategoryId: null,
          stockList: [],
          productAttr: [],
          keyword: null
        },
        operates: [
          {
            label: "Product on the shelf",
            value: "publishOn"
          },
          {
            label: "Product off the shelf",
            value: "publishOff"
          },
          {
            label: "Set as recommendation",
            value: "recommendOn"
          },
          {
            label: "Cancel recommendation",
            value: "recommendOff"
          },
          {
            label: "Set as new",
            value: "newOn"
          },
          {
            label: "Cancel new",
            value: "newOff"
          },
          {
            label: "Move to category",
            value: "transferCategory"
          },
          {
            label: "Move to recycle bin",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: 'Put on shelf'
        }, {
          value: 0,
          label: 'Off shelf'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: 'examination passed'
        }, {
          value: 0,
          label: 'Unreviewed'
        }]
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return 'examination passed';
        } else {
          return 'Unreviewed';
        }
      }
    },
    methods: {
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if (spData != null && index < spData.length) {
          return spData[index].value;
        } else {
          return null;
        }
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
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
      handleShowSkuEditDialog(index, row) {
        this.editSkuInfo.dialogVisible = true;
        this.editSkuInfo.productId = row.id;
        this.editSkuInfo.productSn = row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword = null;
        fetchSkuStockList(row.id, {keyword: this.editSkuInfo.keyword}).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
        if (row.productAttributeCategoryId != null) {
          fetchProductAttrList(row.productAttributeCategoryId, {type: 0}).then(response => {
            this.editSkuInfo.productAttr = response.data.list;
          });
        }
      },
      handleSearchEditSku() {
        fetchSkuStockList(this.editSkuInfo.productId, {keyword: this.editSkuInfo.keyword}).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
      },
      handleEditSkuConfirm() {
        if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
          this.$message({
            message: 'No sku information',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('Do you want to modify', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
            this.$message({
              message: 'Successfully modified',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible = false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path: '/pms/addProduct'});
      },
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: 'Please select the type of operation',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: 'Please select the product to be operated',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('Do you want to do this batch operation?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1, ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0, ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1, ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0, ids);
              break;
            case this.operates[4].value:
              this.updateNewStatus(1, ids);
              break;
            case this.operates[5].value:
              this.updateNewStatus(0, ids);
              break;
            case this.operates[6].value:
              break;
            case this.operates[7].value:
              this.updateDeleteStatus(1, ids);
              break;
            default:
              break;
          }
          this.getList();
        });
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.publishStatus, ids);
      },
      handleNewStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.newStatus, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.recommandStatus, ids);
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row) {
        this.$confirm('Do you want to delete?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1, ids);
        });
      },
      handleUpdateProduct(index, row) {
        this.$router.push({path: '/pms/updateProduct', query: {id: row.id}});
      },
      handleShowProduct(index, row) {
        console.log("handleShowProduct", row);
      },
      handleShowVerifyDetail(index, row) {
        console.log("handleShowVerifyDetail", row);
      },
      handleShowLog(index, row) {
        console.log("handleShowLog", row);
      },
      updatePublishStatus(publishStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('publishStatus', publishStatus);
        updatePublishStatus(params).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateNewStatus(newStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('newStatus', newStatus);
        updateNewStatus(params).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: 'successfully deleted',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>
<style></style>



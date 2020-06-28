<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleSelectProduct()" class="btn-add" size="mini" style="margin-left: 20px">Add</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="productRelationTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">{{scope.row.product.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product SerialNumber" width="140">
          <template slot-scope="scope">NO.{{scope.row.product.productSn}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product price" width="100">
          <template slot-scope="scope">${{scope.row.product.price}}</template>
        </el-table-column>
        <el-table-column align="center" label="Remaining amount" width="100">
          <template slot-scope="scope">{{scope.row.product.stock}}</template>
        </el-table-column>
        <el-table-column align="center" label="Flash Promotion price" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.flashPromotionPrice!==null">
              ${{scope.row.flashPromotionPrice}}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Number of Flash Promotion" width="100">
          <template slot-scope="scope">{{scope.row.flashPromotionCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Limit of Flash Promotion" width="100">
          <template slot-scope="scope">{{scope.row.flashPromotionLimit}}</template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="100">
          <template slot-scope="scope">
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">Update Product
            </el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="mini"
                       type="text">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog :visible.sync="selectDialogVisible" title="Choose product" width="50%">
      <el-input placeholder="Product name search"
                size="small"
                style="width: 250px;margin-bottom: 20px"
                v-model="dialogData.listQuery.keyword">
        <el-button @click="handleSelectSearch()" icon="el-icon-search" slot="append"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="Product Name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product SerialNumber" width="160">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column align="center" label="Price" width="120">
          <template slot-scope="scope">${{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="dialogData.total"
          @current-change="handleDialogCurrentChange"
          @size-change="handleDialogSizeChange"
          background
          layout="prev, pager, next">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button @click="selectDialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleSelectDialogConfirm()" size="small" type="primary">OK</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogVisible"
               title="Edit flash promotion product information"
               width="40%">
      <el-form :model="flashProductRelation"
               label-width="150px"
               ref="flashProductRelationForm" size="small">
        <el-form-item label="Product Name：">
          <span>{{flashProductRelation.product.name}}</span>
        </el-form-item>
        <el-form-item label="Product SerialNumber：">
          <span>NO.{{flashProductRelation.product.productSn}}</span>
        </el-form-item>
        <el-form-item label="Product price：">
          <span>${{flashProductRelation.product.price}}</span>
        </el-form-item>
        <el-form-item label="Flash Promotion price：">
          <el-input class="input-width" v-model="flashProductRelation.flashPromotionPrice">
            <template slot="prepend">$</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Remaining amount：">
          <span>{{flashProductRelation.product.stock}}</span>
        </el-form-item>
        <el-form-item label="Number of Flash Promotion：">
          <el-input class="input-width" v-model="flashProductRelation.flashPromotionCount"></el-input>
        </el-form-item>
        <el-form-item label="Limit of Flash Promotion：">
          <el-input class="input-width" v-model="flashProductRelation.flashPromotionLimit"></el-input>
        </el-form-item>
        <el-form-item label="Sort：">
          <el-input class="input-width" v-model="flashProductRelation.sort"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleEditDialogConfirm()" size="small" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    createFlashProductRelation,
    deleteFlashProductRelation,
    fetchList,
    updateFlashProductRelation
  } from '@/api/flashProductRelation';
  import {fetchList as fetchProductList} from '@/api/product';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    flashPromotionId: null,
    flashPromotionSessionId: null
  };
  export default {
    name: 'flashPromotionProductRelationList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        selectDialogVisible: false,
        dialogData: {
          list: null,
          total: null,
          multipleSelection: [],
          listQuery: {
            keyword: null,
            pageNum: 1,
            pageSize: 5
          }
        },
        editDialogVisible: false,
        flashProductRelation: {
          product: {}
        }
      }
    },
    created() {
      this.listQuery.flashPromotionId = this.$route.query.flashPromotionId;
      this.listQuery.flashPromotionSessionId = this.$route.query.flashPromotionSessionId;
      this.getList();
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSelectProduct() {
        this.selectDialogVisible = true;
        this.getDialogList();
      },
      handleUpdate(index, row) {
        this.editDialogVisible = true;
        this.flashProductRelation = Object.assign({}, row);
      },
      handleDelete(index, row) {
        this.$confirm('Do you want to delete this product?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteFlashProductRelation(row.id).then(response => {
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
            this.getList();
          });
        });
      },
      handleSelectSearch() {
        this.getDialogList();
      },
      handleDialogSizeChange(val) {
        this.dialogData.listQuery.pageNum = 1;
        this.dialogData.listQuery.pageSize = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dialogData.listQuery.pageNum = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val) {
        this.dialogData.multipleSelection = val;
      },
      handleSelectDialogConfirm() {
        if (this.dialogData.multipleSelection < 1) {
          this.$message({
            message: 'Please select a record',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let selectProducts = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
          selectProducts.push({
            productId: this.dialogData.multipleSelection[i].id,
            flashPromotionId: this.listQuery.flashPromotionId,
            flashPromotionSessionId: this.listQuery.flashPromotionSessionId
          });
        }
        this.$confirm('Use to add action?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          createFlashProductRelation(selectProducts).then(response => {
            this.selectDialogVisible = false;
            this.dialogData.multipleSelection = [];
            this.getList();
            this.$message({
              type: 'success',
              message: 'Added successfully!'
            });
          });
        });
      },
      handleEditDialogConfirm() {
        this.$confirm('Do you want to confirm?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateFlashProductRelation(this.flashProductRelation.id, this.flashProductRelation).then(response => {
            this.$message({
              message: 'Successfully modified！',
              type: 'success'
            });
            this.editDialogVisible = false;
            this.getList();
          })
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getDialogList() {
        fetchProductList(this.dialogData.listQuery).then(response => {
          this.dialogData.list = response.data.list;
          this.dialogData.total = response.data.total;
        })
      }
    }
  }
</script>
<style scoped>
  .operate-container {
    margin-top: 0;
  }

  .input-width {
    width: 200px;
  }
</style>



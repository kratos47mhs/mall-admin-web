<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Datasheets</span>
      <el-button
        @click="addProductAttrCate()"
        class="btn-add"
        size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="productAttrCateTable"
                style="width: 100%"
                v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="类型名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="属性数量" width="200">
          <template slot-scope="scope">{{scope.row.attributeCount==null?0:scope.row.attributeCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="参数数量" width="200">
          <template slot-scope="scope">{{scope.row.paramCount==null?0:scope.row.paramCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="Setting" width="200">
          <template slot-scope="scope">
            <el-button
              @click="getAttrList(scope.$index, scope.row)"
              size="mini">Attribute List
            </el-button>
            <el-button
              @click="getParamList(scope.$index, scope.row)"
              size="mini">Parameter List
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini">Update Product
            </el-button>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
              size="mini"
              type="danger">Delete
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="productAttrCate" :rules="rules" label-width="120px" ref="productAttrCatForm">
        <el-form-item label="类型名称" prop="name">
          <el-input auto-complete="off" v-model="productAttrCate.name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="handleConfirm('productAttrCatForm')" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {createProductAttrCate, deleteProductAttrCate, fetchList, updateProductAttrCate} from '@/api/productAttrCate'

  export default {
    name: 'productAttrCateList',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        dialogVisible: false,
        dialogTitle: '',
        productAttrCate: {
          name: '',
          id: null
        },
        rules: {
          name: [
            {required: true, message: 'Please enter the type name', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      addProductAttrCate() {
        this.dialogVisible = true;
        this.dialogTitle = "Add Type";
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
      handleDelete(index, row) {
        this.$confirm('Do you want to delete the brand', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteProductAttrCate(row.id).then(response => {
            this.$message({
              message: 'successfully deleted',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.dialogTitle = "Edit type";
        this.productAttrCate.name = row.name;
        this.productAttrCate.id = row.id;
      },
      getAttrList(index, row) {
        this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 0}})
      },
      getParamList(index, row) {
        this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 1}})
      },
      handleConfirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = new URLSearchParams();
            data.append("name", this.productAttrCate.name);
            if (this.dialogTitle === "Add Type") {
              createProductAttrCate(data).then(response => {
                this.$message({
                  message: 'Added successfully',
                  type: 'success',
                  duration: 1000
                });
                this.dialogVisible = false;
                this.getList();
              });
            } else {
              updateProductAttrCate(this.productAttrCate.id, data).then(response => {
                this.$message({
                  message: 'Successfully modified',
                  type: 'success',
                  duration: 1000
                });
                this.dialogVisible = false;
                this.getList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>



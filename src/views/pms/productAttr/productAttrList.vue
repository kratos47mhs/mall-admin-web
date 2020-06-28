<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">

      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Datasheets</span>
      <el-button
        @click="addProductAttr()"
        class="btn-add"
        size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="productAttrTable"
                style="width: 100%"
                v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Attribute name" width="140">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Product Types" width="140">
          <template slot-scope="scope">{{$route.query.cname}}</template>
        </el-table-column>
        <el-table-column align="center" label="Whether the attribute is optional" width="120">
          <template slot-scope="scope">{{scope.row.selectType|selectTypeFilter}}</template>
        </el-table-column>
        <el-table-column align="center" label="How to enter attribute values" width="150">
          <template slot-scope="scope">{{scope.row.inputType|inputTypeFilter}}</template>
        </el-table-column>
        <el-table-column align="center" label="List of optional values">
          <template slot-scope="scope">{{scope.row.inputList}}</template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort}}</template>
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
  </div>
</template>
<script>
  import {deleteProductAttr, fetchList} from '@/api/productAttr'

  export default {
    name: 'productAttrList',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5,
          type: this.$route.query.type
        },
        operateType: null,
        multipleSelection: [],
        operates: [
          {
            label: "Delete",
            value: "deleteProductAttr"
          }
        ]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.$route.query.cid, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      addProductAttr() {
        this.$router.push({
          path: '/pms/addProductAttr',
          query: {cid: this.$route.query.cid, type: this.$route.query.type}
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: 'Please select a record',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType !== 'deleteProductAttr') {
          this.$message({
            message: 'Please select bulk operation type',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.handleDeleteProductAttr(ids);
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
      handleUpdate(index, row) {
        this.$router.push({path: '/pms/updateProductAttr', query: {id: row.id}});
      },
      handleDeleteProductAttr(ids) {
        this.$confirm('Do you want to delete this attribute', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let data = new URLSearchParams();
          data.append("ids", ids);
          deleteProductAttr(data).then(response => {
            this.$message({
              message: 'successfully deleted',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleDelete(index, row) {
        let ids = [];
        ids.push(row.id);
        this.handleDeleteProductAttr(ids);
      },
    },
    filters: {
      inputTypeFilter(value) {
        if (value === 1) {
          return 'Choose from the list';
        } else {
          return 'Manual input'
        }
      },
      selectTypeFilter(value) {
        if (value === 1) {
          return 'Radio button';
        } else if (value === 2) {
          return 'Check box';
        } else {
          return '唯一'
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>



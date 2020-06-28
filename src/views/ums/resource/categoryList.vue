<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini">Add</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="resourceCategoryTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Name">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Creation time">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="Sort">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="180">
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
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加分类"
      width="40%">
      <el-form :model="resourceCategory"
               label-width="150px"
               ref="resourceCategoryForm" size="small">
        <el-form-item label="Name：">
          <el-input style="width: 250px" v-model="resourceCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="Sort：">
          <el-input style="width: 250px" v-model="resourceCategory.sort"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleDialogConfirm()" size="small" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    createResourceCategory,
    deleteResourceCategory,
    listAllCate,
    updateResourceCategory
  } from '@/api/resourceCategory';
  import {formatDate} from '@/utils/date';

  const defaultResourceCategory = {
    name: null,
    sort: 0
  };
  export default {
    name: 'resourceCategoryList',
    data() {
      return {
        list: null,
        listLoading: false,
        dialogVisible: false,
        isEdit: false,
        resourceCategory: Object.assign({}, defaultResourceCategory)
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.resourceCategory = Object.assign({}, defaultResourceCategory);
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.resourceCategory = Object.assign({}, row);
      },
      handleDelete(index, row) {
        this.$confirm('Do you want to delete the category?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteResourceCategory(row.id).then(response => {
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
            this.getList();
          });
        });
      },
      handleDialogConfirm() {
        this.$confirm('Do you want to confirm?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateResourceCategory(this.resourceCategory.id, this.resourceCategory).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createResourceCategory(this.resourceCategory).then(response => {
              this.$message({
                message: 'Added successfully！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          }
        })
      },
      getList() {
        this.listLoading = true;
        listAllCate({}).then(response => {
          this.listLoading = false;
          this.list = response.data;
        });
      }
    }
  }
</script>
<style>
</style>



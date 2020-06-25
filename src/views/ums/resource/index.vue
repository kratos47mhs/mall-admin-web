<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>Filter search</span>
        <el-button
          @click="handleSearchList()"
          size="small"
          style="float:right"
          type="primary">
          Query search
        </el-button>
        <el-button
          @click="handleResetSearch()"
          size="small"
          style="float:right;margin-right: 15px">
          Reset
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px" size="small">
          <el-form-item label="资源名称：">
            <el-input class="input-width" clearable placeholder="资源名称" v-model="listQuery.nameKeyword"></el-input>
          </el-form-item>
          <el-form-item label="资源路径：">
            <el-input class="input-width" clearable placeholder="资源路径" v-model="listQuery.urlKeyword"></el-input>
          </el-form-item>
          <el-form-item label="资源分类：">
            <el-select class="input-width" clearable placeholder="All" v-model="listQuery.categoryId">
              <el-option :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         v-for="item in categoryOptions">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini" style="margin-left: 20px">添加</el-button>
      <el-button @click="handleShowCategory()" class="btn-add" size="mini">资源分类</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="resourceTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="资源名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="资源路径">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" width="160">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="140">
          <template slot-scope="scope">
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">
              编辑
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
        :page-sizes="[10,15,20]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes,prev, pager, next,jumper">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑资源':'添加资源'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="resource"
               label-width="150px"
               ref="resourceForm" size="small">
        <el-form-item label="资源名称：">
          <el-input style="width: 250px" v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input style="width: 250px" v-model="resource.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select clearable placeholder="All" style="width: 250px" v-model="resource.categoryId">
            <el-option :key="item.value"
                       :label="item.label"
                       :value="item.value"
                       v-for="item in categoryOptions">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input :rows="5"
                    style="width: 250px"
                    type="textarea"
                    v-model="resource.description"></el-input>
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
  import {createResource, deleteResource, fetchList, updateResource} from '@/api/resource';
  import {listAllCate} from '@/api/resourceCategory';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    nameKeyword: null,
    urlKeyword: null,
    categoryId: null
  };
  const defaultResource = {
    id: null,
    name: null,
    url: null,
    categoryId: null,
    description: ''
  };
  export default {
    name: 'resourceList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        resource: Object.assign({}, defaultResource),
        isEdit: false,
        categoryOptions: [],
        defaultCategoryId: null
      }
    },
    created() {
      this.getList();
      this.getCateList();
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
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
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
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.resource = Object.assign({}, defaultResource);
        this.resource.categoryId = this.defaultCategoryId;
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该资源?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteResource(row.id).then(response => {
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.resource = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateResource(this.resource.id, this.resource).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createResource(this.resource).then(response => {
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
      handleShowCategory() {
        this.$router.push({path: '/ums/resourceCategory'})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getCateList() {
        listAllCate().then(response => {
          let cateList = response.data;
          for (let i = 0; i < cateList.length; i++) {
            let cate = cateList[i];
            this.categoryOptions.push({label: cate.name, value: cate.id});
          }
          this.defaultCategoryId = cateList[0].id;
        })
      }
    }
  }
</script>
<style></style>



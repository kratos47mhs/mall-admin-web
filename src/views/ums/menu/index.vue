<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">Datasheets</span>
      <el-button
        @click="handleAddMenu()"
        class="btn-add"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="menuTable"
                style="width: 100%" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="菜单名称">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column align="center" label="菜单级数" width="100">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column align="center" label="前端名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="前端图标" width="100">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Whether to show" width="100">
          <template slot-scope="scope">
            <el-switch
              :active-value="0"
              :inactive-value="1"
              @change="handleHiddenChange(scope.$index, scope.row)"
              v-model="scope.row.hidden">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column align="center" label="设置" width="120">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)"
              size="mini"
              type="text">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini"
              type="text">编辑
            </el-button>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
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
  </div>
</template>

<script>
  import {deleteMenu, fetchList, updateHidden} from '@/api/menu'

  export default {
    name: "menuList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        parentId: 0
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      $route(route) {
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId() {
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      handleAddMenu() {
        this.$router.push('/ums/addMenu');
      },
      getList() {
        this.listLoading = true;
        fetchList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
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
      handleHiddenChange(index, row) {
        updateHidden(row.id, {hidden: row.hidden}).then(response => {
          this.$message({
            message: 'Successfully modified',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/ums/menu', query: {parentId: row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/ums/updateMenu', query: {id: row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该菜单', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteMenu(row.id).then(response => {
            this.$message({
              message: 'successfully deleted',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },
    filters: {
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>

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
          <el-form-item label="Enter search：">
            <el-input class="input-width" clearable placeholder="角色名称" v-model="listQuery.keyword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="roleTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="角色名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column align="center" label="用户数" width="100">
          <template slot-scope="scope">{{scope.row.adminCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" width="160">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="Whether to enable" width="140">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="160">
          <template slot-scope="scope">
            <el-row>
              <el-button @click="handleSelectMenu(scope.$index, scope.row)"
                         size="mini"
                         type="text">分配菜单
              </el-button>
              <el-button @click="handleSelectResource(scope.$index, scope.row)"
                         size="mini"
                         type="text">分配资源
              </el-button>
            </el-row>
            <el-row>
              <el-button @click="handleUpdate(scope.$index, scope.row)"
                         size="mini"
                         type="text">
                编辑
              </el-button>
              <el-button @click="handleDelete(scope.$index, scope.row)"
                         size="mini"
                         type="text">Delete
              </el-button>
            </el-row>
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
      :title="isEdit?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="role"
               label-width="150px"
               ref="roleForm" size="small">
        <el-form-item label="角色名称：">
          <el-input style="width: 250px" v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input :rows="5"
                    style="width: 250px"
                    type="textarea"
                    v-model="role.description"></el-input>
        </el-form-item>
        <el-form-item label="Whether to enable：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">Yes</el-radio>
            <el-radio :label="0">No</el-radio>
          </el-radio-group>
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
  import {createRole, deleteRole, fetchList, updateRole, updateStatus} from '@/api/role';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    keyword: null
  };
  const defaultRole = {
    id: null,
    name: null,
    description: null,
    adminCount: 0,
    status: 1
  };
  export default {
    name: 'roleList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        role: Object.assign({}, defaultRole),
        isEdit: false
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
        this.role = Object.assign({}, defaultRole);
      },
      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(response => {
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该角色?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteRole(params).then(response => {
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
        this.role = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateRole(this.role.id, this.role).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createRole(this.role).then(response => {
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
      handleSelectMenu(index, row) {
        this.$router.push({path: '/ums/allocMenu', query: {roleId: row.id}})
      },
      handleSelectResource(index, row) {
        this.$router.push({path: '/ums/allocResource', query: {roleId: row.id}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      }
    }
  }
</script>
<style></style>



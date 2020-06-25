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
            <el-input class="input-width" clearable placeholder="帐号/姓名" v-model="listQuery.keyword"></el-input>
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
                ref="adminTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="帐号">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column align="center" label="邮箱">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" width="160">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="最后登录" width="160">
          <template slot-scope="scope">{{scope.row.loginTime | formatDateTime}}</template>
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
        <el-table-column align="center" label="Manipulate" width="180">
          <template slot-scope="scope">
            <el-button @click="handleSelectRole(scope.$index, scope.row)"
                       size="mini"
                       type="text">分配角色
            </el-button>
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
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="admin"
               label-width="150px"
               ref="adminForm" size="small">
        <el-form-item label="帐号：">
          <el-input style="width: 250px" v-model="admin.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input style="width: 250px" v-model="admin.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input style="width: 250px" v-model="admin.email"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input style="width: 250px" type="password" v-model="admin.password"></el-input>
        </el-form-item>
        <el-form-item label="Note：">
          <el-input :rows="5"
                    style="width: 250px"
                    type="textarea"
                    v-model="admin.note"></el-input>
        </el-form-item>
        <el-form-item label="Whether to enable：">
          <el-radio-group v-model="admin.status">
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
    <el-dialog
      :visible.sync="allocDialogVisible"
      title="分配角色"
      width="30%">
      <el-select multiple placeholder="请选择" size="small" style="width: 80%" v-model="allocRoleIds">
        <el-option
          :key="item.id"
          :label="item.name"
          :value="item.id"
          v-for="item in allRoleList">
        </el-option>
      </el-select>
      <span class="dialog-footer" slot="footer">
        <el-button @click="allocDialogVisible = false" size="small">Cancel</el-button>
        <el-button @click="handleAllocDialogConfirm()" size="small" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {allocRole, createAdmin, deleteAdmin, fetchList, getRoleByAdmin, updateAdmin, updateStatus} from '@/api/login';
  import {fetchAllRoleList} from '@/api/role';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
  };
  const defaultAdmin = {
    id: null,
    username: null,
    password: null,
    nickName: null,
    email: null,
    note: null,
    status: 1
  };
  export default {
    name: 'adminList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        admin: Object.assign({}, defaultAdmin),
        isEdit: false,
        allocDialogVisible: false,
        allocRoleIds: [],
        allRoleList: [],
        allocAdminId: null
      }
    },
    created() {
      this.getList();
      this.getAllRoleList();
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
        this.admin = Object.assign({}, defaultAdmin);
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
        this.$confirm('是否要删除该用户?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteAdmin(row.id).then(response => {
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
        this.admin = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateAdmin(this.admin.id, this.admin).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createAdmin(this.admin).then(response => {
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
      handleAllocDialogConfirm() {
        this.$confirm('是否要确认?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("adminId", this.allocAdminId);
          params.append("roleIds", this.allocRoleIds);
          allocRole(params).then(response => {
            this.$message({
              message: '分配成功！',
              type: 'success'
            });
            this.allocDialogVisible = false;
          })
        })
      },
      handleSelectRole(index, row) {
        this.allocAdminId = row.id;
        this.allocDialogVisible = true;
        this.getRoleListByAdmin(row.id);
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getAllRoleList() {
        fetchAllRoleList().then(response => {
          this.allRoleList = response.data;
        });
      },
      getRoleListByAdmin(adminId) {
        getRoleByAdmin(adminId).then(response => {
          let allocRoleList = response.data;
          this.allocRoleIds = [];
          if (allocRoleList != null && allocRoleList.length > 0) {
            for (let i = 0; i < allocRoleList.length; i++) {
              this.allocRoleIds.push(allocRoleList[i].id);
            }
          }
        });
      }
    }
  }
</script>
<style></style>



<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="flashSessionTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="秒杀时间段名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="每日开始时间">
          <template slot-scope="scope">{{scope.row.startTime | formatTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="每日结束时间">
          <template slot-scope="scope">{{scope.row.endTime | formatTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="启用">
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
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">编辑
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
      title="添加时间段"
      width="40%">
      <el-form :model="flashSession"
               label-width="150px"
               ref="flashSessionForm" size="small">
        <el-form-item label="秒杀时间段名称：">
          <el-input style="width: 250px" v-model="flashSession.name"></el-input>
        </el-form-item>
        <el-form-item label="每日开始时间：">
          <el-time-picker
            placeholder="Please Select Time"
            v-model="flashSession.startTime">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="每日结束时间：">
          <el-time-picker
            placeholder="Please Select Time"
            v-model="flashSession.endTime">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="Whether to enable">
          <el-radio-group v-model="flashSession.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
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
  import {createSession, deleteSession, fetchList, updateSession, updateStatus} from '@/api/flashSession';
  import {formatDate} from '@/utils/date';

  const defaultFlashSession = {
    name: null,
    startTime: null,
    endTime: null,
    status: 0
  };
  export default {
    name: 'flashPromotionSessionList',
    data() {
      return {
        list: null,
        listLoading: false,
        dialogVisible: false,
        isEdit: false,
        flashSession: Object.assign({}, defaultFlashSession)
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'hh:mm:ss')
      }
    },
    methods: {
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashSession = Object.assign({}, defaultFlashSession);
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
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.flashSession = Object.assign({}, row);
        this.flashSession.startTime = new Date(row.startTime);
        this.flashSession.endTime = new Date(row.endTime);
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该时间段?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteSession(row.id).then(response => {
            this.$message({
              type: 'success',
              message: 'successfully deleted!'
            });
            this.getList();
          });
        });
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateSession(this.flashSession.id, this.flashSession).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createSession(this.flashSession).then(response => {
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
        fetchList({}).then(response => {
          this.listLoading = false;
          this.list = response.data;
        });
      }
    }
  }
</script>
<style scoped>
  .operate-container {
    margin-top: 0;
  }
</style>



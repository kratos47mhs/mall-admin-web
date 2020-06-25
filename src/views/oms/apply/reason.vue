<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button
        @click="handleAdd"
        class="btn-add"
        size="mini">Add to
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                border
                ref="returnReasonTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="80">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Reason type">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column align="center" label="Sort" width="100">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column align="center" label="it's usable or not">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index,scope.row)"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="add time" width="180">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="Manipulate" width="160">
          <template slot-scope="scope">
            <el-button
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini">Edit
            </el-button>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
              size="mini">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        placeholder="Bulk operations"
        size="small" v-model="operateType">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-for="item in operateOptions">
        </el-option>
      </el-select>
      <el-button
        @click="handleBatchOperate"
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
      :visible.sync="dialogVisible"
      title="Add return reason" width="30%">
      <el-form :model="returnReason"
               label-width="150px" ref="reasonForm">
        <el-form-item label="Reason type：">
          <el-input class="input-width" v-model="returnReason.name"></el-input>
        </el-form-item>
        <el-form-item label="Sort：">
          <el-input class="input-width" v-model="returnReason.sort"></el-input>
        </el-form-item>
        <el-form-item label="Whether to enable：">
          <el-switch :active-value="1" :inactive-value="0" v-model="returnReason.status"></el-switch>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="handleConfirm" type="primary">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {addReason, deleteReason, fetchList, getReasonDetail, updateReason, updateStatus} from '@/api/returnReason';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5
  };
  const defaultReturnReason = {
    name: null,
    sort: 0,
    status: 1,
    createTime: null
  };
  export default {
    name: 'returnReasonList',
    data() {
      return {
        list: null,
        total: null,
        multipleSelection: [],
        listLoading: true,
        listQuery: Object.assign({}, defaultListQuery),
        operateType: null,
        operateOptions: [
          {
            label: "Delete",
            value: 1
          }
        ],
        dialogVisible: false,
        returnReason: Object.assign({}, defaultReturnReason),
        operateReasonId: null
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      handleAdd() {
        this.dialogVisible = true;
        this.operateReasonId = null;
        this.returnReason = Object.assign({}, defaultReturnReason);
      },
      handleConfirm() {
        if (this.operateReasonId == null) {
          //Add operation
          addReason(this.returnReason).then(response => {
            this.dialogVisible = false;
            this.operateReasonId = null;
            this.$message({
              message: 'Added successfully！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        } else {
          //Edit operation
          updateReason(this.operateReasonId, this.returnReason).then(response => {
            this.dialogVisible = false;
            this.operateReasonId = null;
            this.$message({
              message: 'Successfully modified！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        }
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.operateReasonId = row.id;
        getReasonDetail(row.id).then(response => {
          this.returnReason = response.data;
        });
      },
      handleDelete(index, row) {
        let ids = [];
        ids.push(row.id);
        this.deleteReason(ids);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        let param = new URLSearchParams();
        param.append("status", row.status);
        param.append("ids", ids);
        updateStatus(param).then(response => {
          this.$message({
            message: 'Status modified successfully',
            type: 'success'
          });
        });
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: 'Please select the item to operate',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 1) {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          this.deleteReason(ids);
        }
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
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      deleteReason(ids) {
        this.$confirm('Do you want to delete it?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteReason(params).then(response => {
            this.$message({
              message: 'successfully deleted！',
              type: 'success',
              duration: 1000
            });
            this.listQuery.pageNum = 1;
            this.getList();
          });
        })
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 80%;
  }
</style>



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
          <el-form-item label="Event name：">
            <el-input class="input-width" clearable placeholder="Event name" v-model="listQuery.keyword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Datasheets</span>
      <el-button @click="handleAdd()" class="btn-add" size="mini" style="margin-left: 20px">Add event</el-button>
      <el-button @click="handleShowSessionList()" class="btn-add" size="mini">Flash Promotion time period list</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                border
                ref="flashTable"
                style="width: 100%;" v-loading="listLoading">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" label="SerialNumber" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column align="center" label="Event title">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column align="center" label="Active status" width="140">
          <template slot-scope="scope">{{scope.row |formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column align="center" label="Starting time" width="140">
          <template slot-scope="scope">{{scope.row.startDate | formatDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="End Time" width="140">
          <template slot-scope="scope">{{scope.row.endDate | formatDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="Online/Offline" width="200">
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
            <el-button @click="handleSelectSession(scope.$index, scope.row)"
                       size="mini"
                       type="text">Set up products
            </el-button>
            <el-button @click="handleUpdate(scope.$index, scope.row)"
                       size="mini"
                       type="text">
              Update Product
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
    <el-dialog
      :visible.sync="dialogVisible"
      title="Add event"
      width="40%">
      <el-form :model="flashPromotion"
               label-width="150px"
               ref="flashPromotionForm" size="small">
        <el-form-item label="Event title：">
          <el-input style="width: 250px" v-model="flashPromotion.title"></el-input>
        </el-form-item>
        <el-form-item label="Starting time：">
          <el-date-picker
            placeholder="Please Select Time"
            type="date"
            v-model="flashPromotion.startDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End Time：">
          <el-date-picker
            placeholder="Please Select Time"
            type="date"
            v-model="flashPromotion.endDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Online/Offline">
          <el-radio-group v-model="flashPromotion.status">
            <el-radio :label="1">Online</el-radio>
            <el-radio :label="0">Offline</el-radio>
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
  import {createFlash, deleteFlash, fetchList, updateFlash, updateStatus} from '@/api/flash';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    keyword: null
  };
  const defaultFlashPromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'flashPromotionList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        flashPromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.endDate) {
          return 'Event in progress';
        } else if (nowTime > row.endDate) {
          return 'Event is over';
        } else {
          return 'Event has not started';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
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
        this.flashPromotion = Object.assign({}, defaultFlashPromotion);
      },
      handleShowSessionList() {
        this.$router.push({path: '/sms/flashSession'})
      },
      handleStatusChange(index, row) {
        this.$confirm('Do you want to modify the status?', 'Prompt', {
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
            message: 'Cancel modification'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('Do you want to delete the event?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteFlash(row.id).then(response => {
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
        this.flashPromotion = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$confirm('Do you want to confirm?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateFlash(this.flashPromotion.id, this.flashPromotion).then(response => {
              this.$message({
                message: 'Successfully modified！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            })
          } else {
            createFlash(this.flashPromotion).then(response => {
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
      handleSelectSession(index, row) {
        this.$router.push({path: '/sms/selectSession', query: {flashPromotionId: row.id}})
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



<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="menu"
             :rules="rules"
             label-width="150px"
             ref="menuFrom">
      <el-form-item label="菜单名称：" prop="title">
        <el-input v-model="menu.title"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单：">
        <el-select placeholder="请选择菜单"
                   v-model="menu.parentId">
          <el-option
            :key="item.id"
            :label="item.title"
            :value="item.id"
            v-for="item in selectMenuList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前端名称：" prop="name">
        <el-input v-model="menu.name"></el-input>
      </el-form-item>
      <el-form-item label="前端图标：" prop="icon">
        <el-input style="width: 80%" v-model="menu.icon"></el-input>
        <svg-icon :icon-class="menu.icon" style="margin-left: 8px"></svg-icon>
      </el-form-item>
      <el-form-item label="Whether to show：">
        <el-radio-group v-model="menu.hidden">
          <el-radio :label="0">Yes</el-radio>
          <el-radio :label="1">No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Sort：">
        <el-input v-model="menu.sort"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('menuFrom')" type="primary">Submit</el-button>
        <el-button @click="resetForm('menuFrom')" v-if="!isEdit">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {createMenu, fetchList, getMenu, updateMenu} from '@/api/menu';

  const defaultMenu = {
    title: '',
    parentId: 0,
    name: '',
    icon: '',
    hidden: 0,
    sort: 0
  };
  export default {
    name: "MenuDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        menu: Object.assign({}, defaultMenu),
        selectMenuList: [],
        rules: {
          title: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入前端名称', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '请输入前端图标', trigger: 'blur'},
            {min: 2, max: 140, message: '2 to 140 characters in length', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        getMenu(this.$route.query.id).then(response => {
          this.menu = response.data;
        });
      } else {
        this.menu = Object.assign({}, defaultMenu);
      }
      this.getSelectMenuList();
    },
    methods: {
      getSelectMenuList() {
        fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectMenuList = response.data.list;
          this.selectMenuList.unshift({id: 0, title: '无上级菜单'});
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('Whether to Submit Data', 'Prompt', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateMenu(this.$route.query.id, this.menu).then(response => {
                  this.$message({
                    message: 'Successfully modified',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createMenu(this.menu).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: 'Submitted successfully',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              }
            });

          } else {
            this.$message({
              message: 'Verification Failed',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.menu = Object.assign({}, defaultMenu);
        this.getSelectMenuList();
      },
    }
  }
</script>

<style scoped>

</style>

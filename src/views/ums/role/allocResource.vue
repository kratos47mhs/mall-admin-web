<template>
  <el-card class="form-container" shadow="never">
    <div :class="index===0?'top-line':null" :key="'cate'+cate.id" v-for="(cate,index) in allResourceCate">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox :indeterminate="isIndeterminate(cate.id)"
                     @change="handleCheckAllChange(cate)"
                     v-model="cate.checked">
          {{cate.name}}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col :key="resource.id" :span="8" style="padding: 4px 0" v-for="resource in getResourceByCate(cate.id)">
          <el-checkbox @change="handleCheckChange(resource)" v-model="resource.checked">
            {{resource.name}}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div align="center" style="margin-top: 20px">
      <el-button @click="handleSave()" type="primary">Save</el-button>
      <el-button @click="handleClear()">Clear</el-button>
    </div>

  </el-card>
</template>

<script>
  import {fetchAllResourceList} from '@/api/resource';
  import {listAllCate} from '@/api/resourceCategory';
  import {allocResource, listResourceByRole} from '@/api/role';

  export default {
    name: "allocResource",
    data() {
      return {
        roleId: null,
        allResource: null,
        allResourceCate: null
      };
    },
    created() {
      this.roleId = this.$route.query.roleId;
      this.getAllResourceCateList();
    },
    methods: {
      getAllResourceList() {
        fetchAllResourceList().then(response => {
          this.allResource = response.data;
          for (let i = 0; i < this.allResource.length; i++) {
            this.allResource[i].checked = false;
          }
          this.getResourceByRole(this.roleId);
        });
      },
      getAllResourceCateList() {
        listAllCate().then(response => {
          this.allResourceCate = response.data;
          for (let i = 0; i < this.allResourceCate.length; i++) {
            this.allResourceCate[i].checked = false;
          }
          this.getAllResourceList();
        });
      },
      getResourceByCate(categoryId) {
        let cateResource = [];
        if (this.allResource == null) return null;
        for (let i = 0; i < this.allResource.length; i++) {
          let resource = this.allResource[i];
          if (resource.categoryId === categoryId) {
            cateResource.push(resource);
          }
        }
        return cateResource;
      },
      getResourceByRole(roleId) {
        listResourceByRole(roleId).then(response => {
          let allocResource = response.data;
          this.allResource.forEach(item => {
            item.checked = this.getResourceChecked(item.id, allocResource);
          });
          this.allResourceCate.forEach(item => {
            item.checked = this.isAllChecked(item.id);
          });
          this.$forceUpdate();
        });
      },
      getResourceChecked(resourceId, allocResource) {
        if (allocResource == null || allocResource.length === 0) return false;
        for (let i = 0; i < allocResource.length; i++) {
          if (allocResource[i].id === resourceId) {
            return true;
          }
        }
        return false;
      },
      isIndeterminate(categoryId) {
        let cateResources = this.getResourceByCate(categoryId);
        if (cateResources == null) return false;
        let checkedCount = 0;
        for (let i = 0; i < cateResources.length; i++) {
          if (cateResources[i].checked === true) {
            checkedCount++;
          }
        }
        return !(checkedCount === 0 || checkedCount === cateResources.length);
      },
      isAllChecked(categoryId) {
        let cateResources = this.getResourceByCate(categoryId);
        if (cateResources == null) return false;
        let checkedCount = 0;
        for (let i = 0; i < cateResources.length; i++) {
          if (cateResources[i].checked === true) {
            checkedCount++;
          }
        }
        if (checkedCount === 0) {
          return false;
        }
        return checkedCount === cateResources.length;
      },
      handleSave() {
        this.$confirm('Whether to allocate resources？', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let checkedResourceIds = new Set();
          if (this.allResource != null && this.allResource.length > 0) {
            this.allResource.forEach(item => {
              if (item.checked) {
                checkedResourceIds.add(item.id);
              }
            });
          }
          let params = new URLSearchParams();
          params.append("roleId", this.roleId);
          params.append("resourceIds", Array.from(checkedResourceIds));
          allocResource(params).then(response => {
            this.$message({
              message: 'Assigned successfully',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
          })
        })
      },
      handleClear() {
        this.allResourceCate.forEach(item => {
          item.checked = false;
        });
        this.allResource.forEach(item => {
          item.checked = false;
        });
        this.$forceUpdate();
      },
      handleCheckAllChange(cate) {
        let cateResources = this.getResourceByCate(cate.id);
        for (let i = 0; i < cateResources.length; i++) {
          cateResources[i].checked = cate.checked;
        }
        this.$forceUpdate();
      },
      handleCheckChange(resource) {
        this.allResourceCate.forEach(item => {
          if (item.id === resource.categoryId) {
            item.checked = this.isAllChecked(resource.categoryId);
          }
        });
        this.$forceUpdate();
      }
    }
  }
</script>

<style scoped>
  .table-layout {
    padding: 20px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .top-line {
    border-top: 1px solid #DCDFE6;
  }
</style>

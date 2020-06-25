<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item :key="item.path" v-for="(item,index)  in levelList" v-if="item.meta.title">
        <span class="no-redirect"
              v-if="item.redirect==='noredirect'||index==levelList.length-1">{{item.meta.title}}</span>
        <router-link :to="item.redirect||item.path" v-else>{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        levelList: null
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== 'home') {
          matched = [{path: '/home', meta: {title: 'Home'}}].concat(matched)
        }
        this.levelList = matched
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>

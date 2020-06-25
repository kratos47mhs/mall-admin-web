<template>
  <scroll-bar>
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      :show-timeout="200"
      active-text-color="#409EFF"
      background-color="#304156"
      mode="vertical"
      text-color="#bfcbd9"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: {SidebarItem, ScrollBar},
    computed: {
      ...mapGetters([
        'sidebar',
        'routers'
      ]),
      routes() {
        // return this.$router.options.routes
        return this.routers
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>

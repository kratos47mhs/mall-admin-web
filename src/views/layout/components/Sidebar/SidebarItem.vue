<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link :key="item.children[0].name"
                   :to="item.path+'/'+item.children[0].path"
                   v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow">
        <el-menu-item :class="{'submenu-title-noDropdown':!isNest}" :index="item.path+'/'+item.children[0].path">
          <svg-icon :icon-class="item.children[0].meta.icon"
                    v-if="item.children[0].meta&&item.children[0].meta.icon"></svg-icon>
          <span slot="title"
                v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu :index="item.name||item.path" :key="item.name" v-else>
        <template slot="title">
          <svg-icon :icon-class="item.meta.icon" v-if="item.meta&&item.meta.icon"></svg-icon>
          <span slot="title" v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" :key="child.path" :routes="[child]"
                        class="nest-menu" v-if="child.children&&child.children.length>0"></sidebar-item>

          <router-link :key="child.name" :to="item.path+'/'+child.path" v-else>
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon :icon-class="child.meta.icon" v-if="child.meta&&child.meta.icon"></svg-icon>
              <span slot="title" v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hasOneShowingChildren(children) {
        const showingChildren = children.filter(item => {
          return !item.hidden
        });
        if (showingChildren.length === 1) {
          return true
        }
        return false
      }
    }
  }
</script>

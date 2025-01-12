<script setup>
import { Menu } from "@element-plus/icons-vue"

import { categorys } from "../global/widget_register"
</script>


<template>
  <el-menu
    style="height: 100vh"
  >
    <el-sub-menu index="widget">
      <template #title><span>组件</span></template>
      <el-menu-item index="widget/all" @click="$emit('widgetPage', '')">
        <span>全部组件</span>
      </el-menu-item>
      <el-menu-item
        v-for="category in categorys"
        :index="'category/' + category"
        @click="$emit('widgetPage', category)"
      >
        <span>{{ category }}</span>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="theme" @click="$emit('themePage')">
      <span>主题</span>
    </el-menu-item>
    <el-menu-item index="develop" @click="$emit('developPage')"
      style="position: absolute; bottom: 0; width: 100%;"
    >
    <el-icon><Menu /></el-icon>
      <span>开发</span>
    </el-menu-item>
  </el-menu>
</template>


<style>
.el-menu-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>

<script setup>
import { Menu } from "@element-plus/icons-vue"
</script>


<template>
  <el-menu
    style="height: 100vh"
  >
    <el-menu-item index="widget" @click="$emit('widgetPage')">
      <span>组件</span>
    </el-menu-item>
    <el-menu-item index="wallpaper" @click="$emit('wallpaperPage')">
      <span>壁纸</span>
    </el-menu-item>
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

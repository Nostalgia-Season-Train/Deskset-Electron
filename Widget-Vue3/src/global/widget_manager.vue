<script setup>
import { ref } from 'vue'
import { Clock, ChatDotSquare, Monitor, Notebook } from "@element-plus/icons-vue"

import widgets from "./widget_register"

const value按钮 = ref(Array(widgets.length).fill(false))

let categorys = []
let widgetTree = []
for (const widget of widgets) {
  if (!categorys.includes(widget.category)) {
    categorys.push(widget.category)
    widgetTree[widget.category] = []
  }
  widgetTree[widget.category].push(widget)
}
</script>


<template>
<el-scrollbar height="100vh">
  <el-menu>
    <el-sub-menu v-for="category in categorys" :index="category">
      <template #title>
        <el-icon size="20" v-if="category === '时间日期'"><Clock /></el-icon>
        <el-icon size="20" v-if="category === '问候语'"><ChatDotSquare /></el-icon>
        <el-icon size="20" v-if="category === '系统监控'"><Monitor /></el-icon>
        <el-icon size="20" v-if="category === '日记'"><Notebook /></el-icon>
        <span>&nbsp;</span>
        <span>{{ category }}</span>
      </template>
      <el-menu-item v-for="widget in widgetTree[category]" :index="widget.strID">
        {{ widget.name }}
        <el-switch
          v-model="value按钮[widget.numID]"
          @change="$emit('triggerDisplay', widget.strID, value按钮[widget.numID])"
        />
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</el-scrollbar>
</template>


<style>
.el-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

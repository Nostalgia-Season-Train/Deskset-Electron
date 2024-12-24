<script setup>
import { ref } from "vue"
import { Operation } from "@element-plus/icons-vue"

import widgetManager from "./global/widget_manager.vue"
import widgets from "./global/widget_register"

const isOpenNav = ref(false)

function switchDisplay(strID, isDisplay) {
  for (const widget of widgets)
    if (widget.strID == strID)
      widget.isDisplay.value = isDisplay
}
</script>


<template>
<body>
  <!-- 组件容器 -->
  <div class="container">
    <div v-for="widget in widgets">
      <component :is="widget.content" v-if="widget.isDisplay.value"/>
    </div>
  </div>

  <!-- 组件导航：控制组件显示 -->
  <!-- size="25vw" 方便开着控制台调试，实际部署 16vw -->
  <el-drawer v-model="isOpenNav" direction="ltr" :with-header="false"
    size="25vw"
    style="--el-drawer-padding-primary: 0;"
    >
    <widgetManager @triggerDisplay="switchDisplay"/>
  </el-drawer>
  <div style="position: fixed; top: 5px; right: 5px;" v-widget-drag>
    <el-button type="primary" @click="isOpenNav = true">
      <el-icon :size="30"><Operation /></el-icon>
    </el-button>
  </div>
</body>
</template>


<style scoped>
* {
  box-sizing: border-box;
  margin: 0; padding: 0;

  user-select: none;
}

body {
  width: 100vw; height: 100vh;

  background: url("./调试背景.jpg") no-repeat center center / cover fixed;
  /* background-color: transparent; */

  display: flex; flex-direction: row;
}

.container {
  min-width: 100vw; min-height: 100vh;

  display: flex; flex-direction: column;
  align-items: center;
}
</style>

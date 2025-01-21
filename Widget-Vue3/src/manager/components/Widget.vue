<script setup>
// 组件预览：计算 id，找到相关组件并预览
import { shallowRef } from "vue"
import { widgets, categorys } from "../../global/widget_register"

const widgetNow = shallowRef()

const handleSelect = (key, keyPath) => {
  const id = keyPath[0] + key

  for (const widget of widgets) {
    if (widget.id == id) {
      widgetNow.value = widget.content
    }
  }
}


// 桌面管理
const bc = new BroadcastChannel("Desktop")

const triggerDisplay = (id, isDisplay) => {
  bc.postMessage({
    "action": "switchDisplay",
    "id": id,
    "isDisplay": isDisplay
  })
}
</script>


<template>
<el-container>

  <el-aside width="25%">
    <el-scrollbar>
      <el-menu @select="handleSelect">
        <el-sub-menu v-for="category in [...categorys.keys()]" :index="category + '/'">
          <template #title>
            <span>{{ category }}</span>
          </template>
          <el-menu-item v-for="widget in categorys.get(category)" :index="widget">
            <span>{{ widget }}</span><!-- widget 是 categorys 中的组件名 -->
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>

  <el-main>
    <component :is="widgetNow"/>
  </el-main>

</el-container>
</template>


<style scoped>
.el-container {
  width: 100%;
  height: 100%;
}

:deep(.el-aside .el-scrollbar__thumb) {
  display: none;
}
</style>

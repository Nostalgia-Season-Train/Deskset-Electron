<script setup>
import { Refresh, CopyDocument } from "@element-plus/icons-vue"

const refreshManagerPage = () => {
  location.reload()
}


// 桌面管理：桌面刷新，桌面开发工具
const bc = new BroadcastChannel("Desktop")

const refreshPage = () => {
  bc.postMessage({ "action": "refreshPage" })
}

const openDevTool = () => {
  bc.postMessage({ "action": "openDevTool" })
}
</script>


<template>
<p>
  <span>刷新管理页面</span>
  <el-button type="primary" circle @click="refreshManagerPage">
    <el-icon style="margin: 0;"><Refresh /></el-icon>
  </el-button>
</p>

<p>
  <span>刷新</span>
  <el-button type="primary" circle @click="refreshPage">
    <el-icon style="margin: 0;"><Refresh /></el-icon>
  </el-button>
</p>

<p>
  <span>开发工具</span>
  <el-button type="primary" circle @click="openDevTool">
    <el-icon style="margin: 0;"><CopyDocument /></el-icon>
  </el-button>
</p>
</template>

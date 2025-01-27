<script setup>
import { Refresh, CopyDocument, Upload } from "@element-plus/icons-vue"


// 跟 Desktop 跨页面通信：桌面刷新，桌面开发工具
const bc = new BroadcastChannel("Desktop")

const refreshPage = () => {
  bc.postMessage({ "action": "refreshPage" })
}

const openDevTool = () => {
  bc.postMessage({ "action": "openDevTool" })
}
</script>


<template>
<el-scrollbar>

  <div class="option">
    <div class="word">
      <div class="name">刷新</div>
      <div class="description">强制刷新桌面，相当于 F5</div>
    </div>
    <div class="icon">
      <el-button type="primary" @click="refreshPage">
        <el-icon style="margin: 0;"><Refresh /></el-icon>
      </el-button>
    </div>
  </div>

  <div class="option">
    <div class="word">
      <div class="name">开发工具</div>
      <div class="description">打开开发者工具</div>
    </div>
    <div class="icon">
      <el-button type="primary" @click="openDevTool">
        <el-icon style="margin: 0;"><CopyDocument /></el-icon>
      </el-button>
    </div>
  </div>

  <div class="option">
    <div class="word">
      <div class="name">导出日志</div>
      <div class="description">导出运行日志，以供调试</div>
    </div>
    <div class="icon">
      <el-button type="primary" @click="console.log('还未开发，按钮用来占位')">
        <el-icon style="margin: 0;"><Upload /></el-icon>
      </el-button>
    </div>
  </div>

</el-scrollbar>
</template>


<style scoped>
.option {
  margin: 10px 10px 0 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option>.word>.name {
  font-size: 16px;
  color: black;
}
.option>.word>.description {
  font-size: 14px;
  color: gray;
}
</style>

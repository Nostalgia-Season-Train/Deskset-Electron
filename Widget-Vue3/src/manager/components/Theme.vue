<script setup>
import { DocumentAdd } from "@element-plus/icons-vue"

const bc = new BroadcastChannel("Desktop")

const saveTheme = () => {
  bc.postMessage({ "action": "saveTheme" })
}

const openTheme = () => {
  console.log('openTheme')
  // bc.postMessage({ "action": "openTheme" })
}

const openThemeConfig = () => {
  console.log('openThemeConfig')
  // bc.postMessage({ "action": "openThemeConfig" })
}
</script>


<template>
<el-scrollbar>

  <div class="theme-save">
    <el-card shadow="hover" @click="saveTheme">
      <div class="content">
        <span>保存主题</span>
        <el-icon size="20px"><DocumentAdd /></el-icon>
      </div>
    </el-card>
  </div>

  <div class="theme-container" v-for="n in 100">
    <div class="left">
      <el-card shadow="never"></el-card>
    </div>
    <div class="right">
      <div class="word">
        <div class="name">
          <span><b>{{ n }}</b></span>
        </div>
        <div class="save-time">
          <span>保存日期：</span>
          <span>2025-1-12</span>
        </div>
      </div>
      <div class="button">
        <el-button type="primary" plain @click="openTheme">
          应用主题
        </el-button>
        <el-button type="primary" plain @click="openThemeConfig">
          打开配置
        </el-button>
      </div>
    </div>
  </div>

</el-scrollbar>
</template>


<style scoped>
/* 主题保存：保存按钮 */
.theme-save {
  margin: 5px 5px 0 5px;
}

.theme-save :deep(.el-card) {
  width: 240px;
  height: 135px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-save .content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 主题容器：显示保存的主题 */
.theme-container {
  margin: 5px;
  display: flex;
}

.theme-container>.left :deep(.el-card) {
  width: 240px;
  height: 135px;
}

.theme-container>.right {
  margin-left: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.theme-container>.right>.word>.name {
  font-size: 16px;
}

.theme-container>.right>.word>.save-time {
  font-size: 14px;
  color: gray;
}

.theme-container>.right>.button {
  display: flex;
  justify-content: center;
}
</style>

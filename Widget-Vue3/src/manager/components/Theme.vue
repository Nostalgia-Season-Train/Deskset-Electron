<script setup>
import { DocumentAdd } from "@element-plus/icons-vue"

const bc = new BroadcastChannel("Desktop")

const saveTheme = () => {
  bc.postMessage({ "action": "saveTheme" })
}
</script>


<template>
  <el-card shadow="hover" @click="saveTheme"
    style="
      width: 275px; height: 150px;
      display: flex; justify-content: center; align-items: center;
    "
  >
    <div style="
        display: flex; justify-content: center; align-items: center;
      "
    >
      保存主题
      <el-icon size="20px"><DocumentAdd /></el-icon>
    </div>
  </el-card>
  加载主题
</template>

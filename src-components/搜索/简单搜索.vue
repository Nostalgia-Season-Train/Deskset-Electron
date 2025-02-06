<script setup>
import { ref } from "vue"
import { Search } from "@element-plus/icons-vue"

const input = ref("")

const refresh = () => {
  console.log(input.value)
}
</script>


<template>
  <div class="search">
    <el-input v-model="input" :prefix-icon="Search" placeholder="搜索"
      style="width: 320px; height: 45px;"
      @input="refresh"
    />
  </div>
</template>


<style scoped>
/* 搜索框字体上下居中 */
:deep(.el-input__inner) {
  display: flex;
  align-items: center;
  /* 上面偶尔生效，直接文字抬高 0.25px */
  padding-bottom: 0.25px;
}
</style>

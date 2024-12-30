<script setup>
import { ref } from "vue"
import { Search } from "@element-plus/icons-vue"

const input = ref("")

const refresh = () => {
  console.log(input.value)
}
</script>


<template>
  <div class="search" v-widget-drag>
    <el-input v-model="input" :prefix-icon="Search" placeholder="搜索"
      style="width: 320px; height: 45px;"
      @input="refresh"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { marked } from 'marked'

// 禁用外部链接
const render = new marked.Renderer()

render.link = (href) => {
  return `<a href="#">${href.href}</a>`
}

const content = ref()

const refresh = async () => {
  const response = await axios.get("http://127.0.0.1:8000/v0/diary/content")
  const diary = response.data.data
  content.value.innerHTML = marked(diary?.content, { renderer: render })
}
refresh()
defineExpose({ refresh })


import { useIntervalFn } from "@vueuse/core"

useIntervalFn(refresh, 30000)
</script>


<template>
<div class="conten-card">
  <el-scrollbar height="32vh">
    <div ref="content"></div>
  </el-scrollbar>
</div>
</template>


<style scoped>
/* md 渲染样式 */
.conten-card {
  color: white;
  background: #FFFFFF01;
}
.conten-card :deep(*) {
  margin: 0;
}
.conten-card :deep(a) {
  color: rgb(224, 224, 224);
}
.conten-card :deep(ul) {
  padding-left: 30px;
}
</style>

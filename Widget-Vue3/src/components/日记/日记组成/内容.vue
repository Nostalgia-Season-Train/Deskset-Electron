<script setup>
import { ref } from "vue"
import axios from "axios"

const content = ref()

const refresh = async () => {
  const response = await axios.get("http://127.0.0.1:8000/v0/diary/content")
  const diary = response.data.data
  content.value = diary?.content
}
refresh()
defineExpose({ refresh })


import { useIntervalFn } from "@vueuse/core"

useIntervalFn(refresh, 30000)
</script>


<template>
<el-card style="
  color: white;
  background: transparent; backdrop-filter: blur(10px);
  --el-card-padding: 16px;
">
  {{ content }}
</el-card>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

const data = ref(null)

const response = async () => {
  const response = await axios.get("http://127.0.0.1:8000/helloworld")

  data.value = response.data.data
}

response()
</script>


<template>
  <div class="template" v-widget-drag>{{ data }}</div>
</template>


<style scoped>
* {
  box-sizing: border-box;
  margin: 0; padding: 0;
}
</style>

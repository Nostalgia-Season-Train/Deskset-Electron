<script setup>
import { ref } from "vue"
import axios from "axios"

const hour   = ref("00")
const minute = ref("00")
const ampm   = ref("am")

const time = async () => {
  const response = await axios.get("http://127.0.0.1:8000/v0/datetime/time12")
  hour.value = response.data.data.hour
  minute.value = response.data.data.minute
  ampm.value = response.data.data.ampm
}
time()


import { useIntervalFn } from "@vueuse/core"

useIntervalFn(time, 1000)
</script>


<template>
  <div class="time" v-widget-drag>
    <span class="hour-minute">{{ hour }}:{{ minute }}</span>
    <span class="ampm">{{ ampm }}</span>
  </div>
</template>


<style scoped>
.time {
  color: white;
}

.time>.hour-minute {
  font-size: 60px;
}

.time>.ampm {
  font-size: 48px;
}
</style>

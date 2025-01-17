<script setup>
import { ref } from "vue"
import axios from "axios"

const month = ref("12")
const day   = ref("24")

const date = async () => {
  const response_date = await axios.get("http://127.0.0.1:8000/v0/datetime/date")
  month.value = response_date.data.data.month
  day.value = response_date.data.data.day
}
date()


import { useIntervalFn } from '@vueuse/core'

useIntervalFn(date, 60000)
</script>


<template>
  <div class="date">
    <span class="year-month-day">{{ month }} 月 {{ day }} 日</span>
  </div>
</template>


<style scoped>
.date {
  color: white;
}

.year-month-day {
  font-size: 28px;
}
</style>

import { ref } from 'vue'
import { defineStore } from 'pinia'

import { number } from '../../global/widget_register'

export const widgetStore = defineStore('status', {
  state: () => ({
    isDisplay: ref(Array(number).fill(false))  // 实际上是组件开关按钮的状态
  })
})

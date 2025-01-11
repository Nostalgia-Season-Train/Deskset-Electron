import { ref } from 'vue'
import { defineStore } from 'pinia'

import widgets from '../../global/widget_register'

export const widgetStore = defineStore('status', {
  state: () => ({
    isDisplay: ref(Array(widgets.length).fill(false))  // 实际上是组件开关按钮的状态
  })
})

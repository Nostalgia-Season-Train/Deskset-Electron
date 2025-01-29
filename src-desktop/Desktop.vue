<script setup>
/* === 组件 === */
import { shallowRef, triggerRef } from 'vue'
import { defineAsyncComponent } from 'vue'
import { widgets, number } from '../src-components/widget_register'

const widgetNowList = shallowRef([])

// 初始化组件清单
// 快速开发，后面优化掉这部分
const initWidgetNowList = async () => {
  let widgetListInit = []
  for (let n = 0; n < number; n++) {
    widgetListInit.push({
      id: undefined,      // 组件 id
      style: undefined,   // 包裹组件的外部样式
      isDisplay: false,   // 是否显示组件
      content: undefined  // 组件内容，通过异步加载
    })
  }
  widgetNowList.value = widgetListInit
}
initWidgetNowList()

// 切换组件显示
const switchWidgetDisplay = async (widgetId, isDisplay, style=undefined) => {
  const num = widgets.findIndex(widget => widget.id == widgetId)
  if (num == -1) {
    throw Error(`没有 ${widgetId} 组件`)
  }

  if (isDisplay) {
    widgetNowList.value[num].id = widgets[num].id
    widgetNowList.value[num].content = defineAsyncComponent(widgets[num].content)
    widgetNowList.value[num].isDisplay = true
    if (style != undefined)
      widgetNowList.value[num].style = style
  } else {
    widgetNowList.value[num].id = undefined
    widgetNowList.value[num].style = undefined
    widgetNowList.value[num].isDisplay = false
    widgetNowList.value[num].content = undefined
  }

  // shallowRef.value.arry 不是响应式的，手动更新
  triggerRef(widgetNowList)
}


/* === 主题 === */

// 保存主题
import dayjs from "dayjs"

const saveTheme = async (themeName) => {
  let themeData = {}

  // 保存日期
  themeData['savetime'] = String(dayjs().format('YYYY-MM-DD HH:mm:ss'))

  // 组件状态
  let widgetStatus = []

  for (const widget of widgets) {
    const widgetHTML = document.getElementById(widget.id)
    if (widgetHTML != null) {
      widgetStatus.push({
        id: widget.id,
        style: widgetHTML.style.cssText
      })
    }
  }

  themeData['widgets'] = widgetStatus

  // 发送主题数据
  const theme = {
    name: themeName,
    widget: themeData
  }

  window.winDesktop.saveTheme(theme)
}

// 使用主题
const useTheme = async (themeName) => {
  const theme = await window.winDesktop.getOneTheme(themeName)
  if (theme == undefined) {
    throw Error(`主题 ${themeName} 读取失败`)
  }

  const widgets = theme?.data?.widgets
  if (widgets == undefined) {
    throw Error(`主题 ${themeName} 中的组件读取失败`)
  }

  await initWidgetNowList()
  for (const widget of widgets) {
    const widgetId = widget?.id
    if (widgetId != undefined) {
      await switchWidgetDisplay(widgetId, true, widget?.style)
    }
  }
}


/* === 开发 === */

// 刷新桌面
const refreshPage = async () => {
  location.reload()
}


/* === 管理页控制桌面页 === */

// 桌面管理：跨页面通信，管理页 /manager.html
const bc = new BroadcastChannel("pageDesktop")

bc.onmessage = async (event) => {
  /* 组件 */
  if (event.data?.action == "switchDisplay") {
    const id = event.data?.id
    const isDisplay = event.data?.isDisplay
    if (id != undefined && isDisplay != undefined) {
      switchWidgetDisplay(id, isDisplay)
    }
  }

  /* 主题 */
  if (event.data?.action == "saveTheme") {
    saveTheme(event.data?.themeName)
  }
  if (event.data?.action == "useTheme") {
    useTheme(event.data?.themeName)
  }

  /* 开发 */
  if (event.data?.action == "refreshPage") {
    refreshPage()
  }
}
</script>


<template>
<body>
  <!-- 组件容器 -->
  <div class="container">
    <div v-for="widget in widgetNowList">
      <Suspense>
        <div
          :id="widget.id"
          :style="widget.style"
          v-if="widget.isDisplay"
          v-widget-drag
        >
          <component :is="widget.content"/>
        </div>
      </Suspense>
    </div>
  </div>
</body>
</template>


<style scoped>
* {
  box-sizing: border-box;
  margin: 0; padding: 0;

  user-select: none;
}

body {
  width: 100vw; height: 100vh;

  background-color: transparent;

  display: flex; flex-direction: row;
}

.container {
  min-width: 100vw; min-height: 100vh;

  display: flex; flex-direction: column;
  align-items: center;
}
</style>

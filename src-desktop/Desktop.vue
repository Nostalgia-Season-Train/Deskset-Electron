<script setup>
// 组件显示
import { defineAsyncComponent } from "vue"
import { widgets } from "../src-components/widget_register"

function switchDisplay(id, isDisplay) {
  for (const widget of widgets)
    if (widget.id == id)
      widget.isDisplay.value = isDisplay
}

// 刷新桌面
const refreshPage = () => {
  location.reload()
}

// 主题保存
import dayjs from "dayjs"

const saveTheme = (themeName) => {
  let themeData = {}

  // 保存日期
  themeData['savetime'] = String(dayjs().format('YYYY-MM-DD HH:mm:ss'))

  // 组件状态
  let widgetStatus = []

  for (const widget of widgets) {
    if (widget.isDisplay.value == true) {
      const widgetHTML = document.getElementById(widget.id)
      const widgetHTMLInfo = widgetHTML.getBoundingClientRect()

      widgetStatus.push({
        id: widget.id,
        pos: { x: widgetHTMLInfo.x,
               y: widgetHTMLInfo.y }
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


// 桌面管理：跨页面通信，管理页 /manager.html
const bc = new BroadcastChannel("pageDesktop")

bc.onmessage = (event) => {
  if (event.data?.action == "refreshPage") {
    refreshPage()
  }

  if (event.data?.action == "switchDisplay") {
    const id = event.data?.id
    const isDisplay = event.data?.isDisplay
    if (id != undefined && isDisplay != undefined) {
      switchDisplay(id, isDisplay)
    }
  }

  if (event.data?.action == "saveTheme") {
    saveTheme(event.data?.themeName)
  }
}
</script>


<template>
<body>
  <!-- 组件容器 -->
  <div class="container">
    <div v-for="widget in widgets">
      <Suspense>
        <component
          :id="widget.id"
          :is="defineAsyncComponent(widget.content)"
          v-if="widget.isDisplay.value"
          v-widget-drag
        />
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

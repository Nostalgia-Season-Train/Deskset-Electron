<script setup>
// 组件显示
import widgets from "./global/widget_register"

function switchDisplay(strID, isDisplay) {
  for (const widget of widgets)
    if (widget.strID == strID)
      widget.isDisplay.value = isDisplay
}

// 桌面刷新，开发工具
const refreshPage = () => {
  location.reload()
}
const openDevTool = () => {
  electron.openDevTool()
}

// 主题保存
const saveTheme = () => {
  let widgetStatus = []

  for (const widget of widgets) {
    if (widget.isDisplay.value != true) {
      break
    }

    const widgetHTML = document.getElementById(widget.strID)
    const widgetHTMLInfo = widgetHTML.getBoundingClientRect()

    widgetStatus.push({
      id: widget.strID,
      pos: {
        x: widgetHTMLInfo.x,
        y: widgetHTMLInfo.y
      }
    })
  }

  const theme = {
    name: 'Default',
    widget: widgetStatus
  }

  electron.saveTheme(theme)
}


// 桌面管理：跨页面通信，管理页 /manager.html
const bc = new BroadcastChannel("Desktop")

bc.onmessage = (event) => {
  if (event.data?.action == "refreshPage") {
    refreshPage()
  }
  if (event.data?.action == "openDevTool") {
    openDevTool()
  }

  if (event.data?.action == "switchDisplay") {
    const strID = event.data?.strID
    const isDisplay = event.data?.isDisplay
    if (strID != undefined && isDisplay != undefined) {
      switchDisplay(strID, isDisplay)
    }
  }

  if (event.data?.action == "saveTheme") {
    saveTheme()
  }
}
</script>


<template>
<body>
  <!-- 组件容器 -->
  <div class="container">
    <div v-for="widget in widgets">
      <component :id="widget.strID" :is="widget.content" v-if="widget.isDisplay.value" v-widget-drag/>
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

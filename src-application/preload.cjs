window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
      if(document.getElementById(selector))
          element.innerText = text
  }

  for(const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
  }
})


/* 渲染进程所需函数 */
const { contextBridge, webUtils } = require('electron')
const { ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  /* 文件绝对路径 */
  showFilePath: (file) => {
    const path = webUtils.getPathForFile(file)
    console.log(`拖拽文件路径：${path}`)
  },

  /* 打开外部浏览器 */
  openBrowser: (url) => {
    ipcRenderer.send('openBrowser', url)
  },

  /* 返回所有组件信息 */
  getAllWidgets: () => ipcRenderer.invoke('getAllWidgets'),

  /* 返回所有主题信息 */
  getAllThemes: () => ipcRenderer.invoke('getAllThemes')
})


/* === 桌面窗口 === */
// 当 ipc 函数满足以下条件，建议写在此处：
// - 管理 => 桌面窗口
// - 管理 => 桌面页面 => 桌面窗口
contextBridge.exposeInMainWorld('winDesktop', {
  /* 主题 */
  // 保存主题
  saveTheme: (theme) => ipcRenderer.send('saveTheme', theme),

  /* 开发 */
  // 打开开发者工具
  openDevTool: () => ipcRenderer.send('openDevTool')
})

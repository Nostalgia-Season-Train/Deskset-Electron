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

  /* 主题 */
  getAllThemes: () => ipcRenderer.invoke('getAllThemes'),
  deleteTheme: (themeName) => ipcRenderer.send('deleteTheme', themeName)
})


/* === 桌面窗口 === */
// 当 ipc 函数满足以下条件，建议写在此处：
// - 管理 => 桌面窗口
// - 管理 => 桌面页面 => 桌面窗口
contextBridge.exposeInMainWorld('winDesktop', {
  /* 主题 */
  saveTheme: (theme) => ipcRenderer.send('saveTheme', theme),
  getOneTheme: (themeName) => ipcRenderer.invoke('getOneTheme', themeName),

  /* 开发 */
  openDevTool: () => ipcRenderer.send('openDevTool')
})

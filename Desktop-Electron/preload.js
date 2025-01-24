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

  /* 打开开发者工具 */
  openDevTool: () => {
    ipcRenderer.send('openDevTool')
  },

  /* 保存主题 */
  saveTheme: (theme) => {
    ipcRenderer.send('saveTheme', theme)
  },

  /* 打开外部浏览器 */
  openBrowser: (url) => {
    ipcRenderer.send('openBrowser', url)
  }
})

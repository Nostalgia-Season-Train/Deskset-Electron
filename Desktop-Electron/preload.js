window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
      if(document.getElementById(selector))
          element.innerText = text
  }

  for(const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
  }
})


// 拖拽文件路径
const { contextBridge, webUtils } = require('electron')
const { ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  showFilePath: (file) => {
    const path = webUtils.getPathForFile(file)
    console.log(`拖拽文件路径：${path}`)
  },
  openDevTool: () => {
    ipcRenderer.send('openDevTool')
  },
  saveTheme: (theme) => {
    ipcRenderer.send('saveTheme', theme)
  }
})

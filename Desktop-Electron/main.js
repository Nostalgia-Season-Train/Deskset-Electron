const { app, BrowserWindow, screen } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')

const { DataType, open, close, define } = require('ffi-rs')

// === 调试模式 ===
// - 1、加载 Vite 服务器页面，而不是构建的文件
// - 2、显示主菜单 Menu 方便刷新页面
const DEBUG_MODE = true


// === Desktop 窗口 ===
const createDesktop = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    // 全屏
    fullscreen: true,
    resizable: false,
    movable: false,

    // 透明
    transparent: true,
    frame: false,

    // 不能聚焦，不在任务栏显示
    focusable: false
  })

  if (DEBUG_MODE) {
    win.loadURL('http://localhost:5173/index.html')
  } else {
    win.loadFile('../dist/index.html')
  }

  // 打开开发者工具
  ipcMain.on('openDevTool', () => {
    win.webContents.openDevTools({ mode: 'detach' })
  })

  // 窗口置底
  const handleBuffer = win.getNativeWindowHandle()
  const handleNumber = handleBuffer.readInt32LE()

  const setBottom = define({
    main: {
      library: 'setBottom.dll',
      retType: DataType.I32,
      paramsType: [DataType.I32, DataType.I32]
    }
  })
  console.log(setBottom.main([handleNumber, 0]))

  // 透明点击
  const checkTransInterval = setInterval(() => {
    try {
      const point = screen.getCursorScreenPoint()
      const [x, y] = win?.getPosition()
      const [w, h] = win?.getSize()
      if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
        updateIgnoreMouseEvents(point.x - x, point.y - y)
      }
    } catch (error) {
      clearInterval(checkTransInterval)
    }
  }, 100)
  const updateIgnoreMouseEvents = async (x, y) => {
    const image = await win.webContents.capturePage({
      x, y, width: 1, height: 1
    })
    let buffer = image.getBitmap()

    win.setIgnoreMouseEvents(!buffer[3])
  }

  // 保存桌面组件截图
  ipcMain.on('saveTheme', async (event, theme) => {
    const fs = require('fs').promises

    const nativeImage = await win.webContents.capturePage({
      x: 0,
      y: 0,
      width: screen.getPrimaryDisplay().workAreaSize.width,
      height: screen.getPrimaryDisplay().workAreaSize.height
    })
    const bitmap = nativeImage.toPNG()

    const folder = '../theme'
    try {
      await fs.access(folder)
    } catch (error) {
      await fs.mkdir(folder)
    }

    const name = String(theme?.name) || 'default'  // 这里是 stem 无后缀名
    const widgetJSON = JSON.stringify(theme?.widget, null, 2)

    const path = folder + '/' + name
    fs.writeFile(path + '.png', bitmap)
    fs.writeFile(path + '.json', widgetJSON, { encoding: 'utf-8' })
  })

  // 打开外部浏览器
  ipcMain.on('openBrowser', async (event, url) => {
    const { shell } = require('electron')
    shell.openExternal(url)
  })

  // 关闭窗口时，清除透明度检查
  win.on('close', () => {
    clearInterval(checkTransInterval)
  })
}


// === Manager 窗口 ===
const createManager = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    width: 800,
    height: 600,

    // 数字桌搭图标
    icon: path.join(__dirname, './assets/Deskset.png')
  })

  if (DEBUG_MODE) {
    win.loadURL('http://localhost:5173/manager.html')
  } else {
    win.loadFile('../dist/manager.html')
  }

  if (!DEBUG_MODE) {
    win.removeMenu()  // macOS 上不生效
  }

  // 管理窗口关闭，退出应用
  win.on('close', () => {
    appClose()
  })
}


// === 应用 App 打开关闭 ===
const appOpen = () => {
  open({
    library: 'setBottom.dll',
    path: './module_C/setBottom.dll'
  })

  createDesktop()
  createManager()
}

const appClose = () => {
  close('setBottom.dll')

  app.quit()
}

app.whenReady().then(() => {
  appOpen()
})

app.on('window-all-closed', () => {
  appClose()
})

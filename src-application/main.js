const { app, BrowserWindow, screen } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')

const { DataType, open, close, define } = require('ffi-rs')

// === 组件信息 ===
const widgetInfo = require('./widget_register')


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

  // 保存主题
  ipcMain.on('saveTheme', async (event, theme) => {
    const fs = require('fs').promises

    const nativeImage = await win.webContents.capturePage({
      x: 0,
      y: 0,
      width: screen.getPrimaryDisplay().workAreaSize.width,
      height: screen.getPrimaryDisplay().workAreaSize.height
    })
    const bitmap = nativeImage.toPNG()

    const name = String(theme?.name) || 'default'        // 主题名称
    const data = JSON.stringify(theme?.widget, null, 2)  // 主题数据（配置）
    const relpath = './theme/' + name + '/'  // 保存在 .theme/主题名称/ 下

    // 创建目录
    try {
      await fs.access(relpath)
    } catch (error) {
      await fs.mkdir(relpath, { recursive: true })
    }

    // 保存文件
    fs.writeFile(relpath + 'preview.png', bitmap)
    fs.writeFile(relpath + 'data.json', data, { encoding: 'utf-8' })
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

  ipcMain.handle('getWidgetInfo', async () => {
    return widgetInfo
  })
  ipcMain.handle('getThemeInfo', async () => {
    // 开发环境下 Electron 生成的主题跟 Vue3 不在同一目录，复制主题给 Vue3
    if (DEBUG_MODE) {
      const { exec } = require('child_process')
      try {
        // 防止意外执行，请在开发时取消注释
        // exec('robocopy ".\\theme" "..\\Widget-Vue3\\theme" /MIR')
      } catch {
        // 捕获非零退出：robocopy 成功复制的退出代码是 1
      }
    }

    // 返回主题信息
    const { getAllThemes } = require('./theme_register')
    const themeInfo = await getAllThemes()
    return themeInfo
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

const { app, BrowserWindow, screen } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')

const { DataType, open, close, define } = require('ffi-rs')

// === 调试模式 ===
// - 1、加载 Vite 服务器页面，而不是构建的文件
// - 2、显示主菜单 Menu 方便刷新页面
const args = process.argv.slice(2)
const DEBUG_MODE = args.includes('-debug') || false


// === Desktop 窗口 ===
const createDesktop = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'src-application/preload.cjs')
    },
    // 全屏
    fullscreen: true,
    resizable: false,
    movable: false,

    // 透明
    transparent: true,
    frame: false,

    // 禁用聚焦，不在任务栏显示
    // focusable: false  // 已废弃，影响输入框 input
  })

  if (DEBUG_MODE) {
    win.loadURL('http://127.0.0.1:5173/desktop.html')
  } else {
    win.loadFile('./dist/desktop.html')
  }

  // 打开开发者工具
  ipcMain.on('openDevTool', () => {
    win.webContents.openDevTools({ mode: 'detach' })
  })
  win.removeMenu()  // 去掉 Menu 可以避免 Ctrl + Shift + I 意外在桌面窗口中打开 DevTools

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

    // 关于透明穿透的一些问题：
    // 1、阻止透明穿透 background-color: #FFFFFF01; 此时 buffer[3] = 1 且背景足以不可见
    // 2、transparent 不一定全透明，换成 #FFFFFF00

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
    const relpath = './themes/' + name + '/'  // 保存在 ./themes/主题名称/ 下

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

  // 返回单个主题
  ipcMain.handle('getOneTheme', async (event, themeName) => {
    const { getOneTheme } = require('./src-application/theme_register.cjs')
    const theme = await getOneTheme(themeName)
    return theme
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
      preload: path.join(__dirname, './src-application/preload.cjs')
    },
    width: 800,
    height: 600,

    // 数字桌搭图标
    icon: path.join(__dirname, './static/icons/Deskset.png')
  })

  if (DEBUG_MODE) {
    win.loadURL('http://127.0.0.1:5173/manager.html')
  } else {
    win.loadFile('./dist/manager.html')
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
// 启动数字桌搭后端
const { spawn } = require('child_process')
const back = !DEBUG_MODE ? spawn('./Deskset-Back.exe') : undefined

const appOpen = () => {
  open({
    library: 'setBottom.dll',
    // path: './src-application/module_C/setBottom.dll'  // 这是打包前的
    path: './setBottom.dll'  // 这是打包后的，需要手动复制
  })

  /* 身份认证 */
  ipcMain.handle('server', async () => {
    let port = 6527
    let token = undefined

    try {
      // 读取配置
      const fs = require('fs').promises
      const dataRaw = await fs.readFile('./config/deskset.json', 'utf8')
      const config = JSON.parse(dataRaw)

      port = config['server-port']
      const username = config.username
      const password = config.password

      // 获取 token
      const { default: axios } = require('axios')
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const repLogin = await axios.post(`http://127.0.0.1:${port}/v0/access/login`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      token = repLogin.data.access_token
    } catch {
      // - [ ] 添加日志
    }

    // 返回服务器
    return {
      port: port,
      token: token
    }
  })

  /* 组件：测试中，动态导入外部组件 */
  ipcMain.handle('getAllWidgets', async () => {
    const widgets = require('./src-application/widget_register.cjs')
    return widgets
  })

  /* 主题 */
  ipcMain.handle('getAllThemes', async () => {
    const { getAllThemes } = require('./src-application/theme_register.cjs')
    const themes = await getAllThemes()
    return themes
  })
  ipcMain.on('deleteTheme', async (event, themeName) => {
    const { deleteTheme } = require('./src-application/theme_register.cjs')
    deleteTheme(themeName)
  })

  /* 组件：以 Base64 编码返回文件图标 */
  ipcMain.handle('retFileIcon', async (event, filePath) => {
    return (await app.getFileIcon(filePath, { size: 'normal' })).toDataURL()
  })

  createDesktop()
  createManager()
}

const appClose = () => {
  close('setBottom.dll')

  app.quit()
  if (back != undefined) {
    back.kill()
  }
}

app.whenReady().then(() => {
  setTimeout(appOpen, 1000)  // 先启动后端服务
})

app.on('window-all-closed', () => {
  appClose()
})

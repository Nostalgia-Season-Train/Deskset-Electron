const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

const { DataType, open, close, define } = require('ffi-rs')

const createWindow = () => {
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
  win.loadURL('http://localhost:5173')

  // 检查网页标题，如果有 -debug 则打开开发者工具
  win.webContents.on('page-title-updated', () => {
    const pageTitle = win.webContents.getTitle()
    if (pageTitle.includes('-debug')) {
      // 打开方式：分离模式，一个单独窗口，不影响透明效果
      win.webContents.openDevTools({ mode: 'detach' })
    }
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
}

app.whenReady().then(() => {
  open({
    library: 'setBottom.dll',
    path: './module_C/setBottom.dll'
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    close('setBottom.dll')

    app.quit()
  }
})

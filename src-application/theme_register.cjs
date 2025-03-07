/* === 环境 === */
const args = process.argv.slice(2)
const DEVELOP_ENV = args.includes('-dev') || false


/* === 解释 === */
// 主题：一个主题对应一个文件夹
// - 主题库   theme/
// - 主题     theme/theme-name/
// - 主题文件 theme/theme-name/theme-file

const THEME_LIB = './themes'      // 程序用路径，对应 electron.exe 同级目录
// const THEME_LIB_VITE = '/themes'  // 网页用路径，对应 vite.config.js 同级目录
// const THEME_LIB_VITE = '../themes'  // 构建出的网页所用路径，对应 dist 同级目录
const THEME_LIB_VITE = DEVELOP_ENV ? '/themes' : '../../../themes'  // 打包后的路径...相对于 resources/app.asar/dist


/* === 函数 === */
const fs = require('fs').promises
const path = require('path')
const glob = require('glob')

// 读取主题
const readTheme = async (themeName) => {
  const themeDir = path.join(THEME_LIB, themeName)
  const themeDirVite = path.join(THEME_LIB_VITE, themeName)

  // 检查：主题是否存在
  try {
    const stat = await fs.stat(themeDir)
    if (!stat.isDirectory())
      throw Error  // 路径存在，但不是文件夹
  } catch {
    throw new Error(`Theme ${themeName} not exist`)
  }

  // 检查：主题要有 preview.png 和 data.json 文件
  const files = await glob.glob('*.*', { cwd: themeDir })
  if (!files.includes('preview.png') || !files.includes('data.json')) {
    throw new Error(`Theme ${themeName} lack preview or data`)
  }

  // 读取：主题预览（路径）
  const preview = path.join(themeDirVite, 'preview.png')

  // 读取：主题数据
  const dataPath = path.join(themeDir, 'data.json')
  const dataRaw = await fs.readFile(dataPath, 'utf8')
  const data = JSON.parse(dataRaw)

  // 读取：主题样式（路径）
  const stylePath = path.join(themeDirVite, 'style.css')
  const style = files.includes('style.css') ? stylePath : undefined

  const theme = {
    name:    themeName,
    preview: preview,
    data:    data,
    style:   style
  }

  return theme
}

// 返回所有主题
const getAllThemes = async () => {
  const themeList = await fs.readdir(THEME_LIB)
  themeList.sort((a, b) => a.localeCompare(b, 'zh-cn'))

  // 遍历主题库，找到所有主题
  let themes = []

  for (const themeName of themeList) {
    try {
      const theme = await readTheme(themeName)
      themes.push(theme)
    } catch (error) {
      console.log(`读取 ${themeName} 主题失败\n`, error)
    }
  }

  return themes
}

// 返回单个主题
const getOneTheme = async (themeName) => {
  try {
    const theme = await readTheme(themeName)
    return theme
  } catch (error) {
    console.log(`返回 ${themeName} 主题失败\n`, error)
  }
}

// 删除主题
const deleteTheme = async (themeName) => {
  try {
    await readTheme(themeName)
    const themeDir = path.join(THEME_LIB, themeName)
    fs.rm(themeDir, { recursive: true })
  } catch (error) {
    console.log(`删除 ${themeName} 主题失败\n`, error)
  }
}


/* === 导出 === */
module.exports = {
  getAllThemes,
  getOneTheme,
  deleteTheme
}

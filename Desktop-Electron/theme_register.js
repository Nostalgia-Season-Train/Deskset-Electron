// 主题：一个主题对应一个文件夹
// - 主题库   ./theme
// - 主题     ./theme/theme-name
// - 主题文件 ./theme/theme-name/theme-file

const THEME_LIB = './theme'      // 程序用路径，对应 electron.exe 同级目录
const THEME_LIB_VITE = '/theme'  // 网页用路径，对应 vite.config.js 同级目录


// === 获取所有主题 ===
const fs = require('fs').promises
const path = require('path')
const glob = require('glob')

const getAllThemes = async () => {
  // 读取主题库下的条目
  const themeList = await fs.readdir(THEME_LIB)

  themeList.sort((a, b) => a.localeCompare(b, 'zh-cn'))  // 按照中文排序

  // 遍历主题库下的条目，找到所有主题
  let themes = []

  for (const themeName of themeList) {
    try {
      // 检查：条目是否为主题文件夹
      const themeDir = path.join(THEME_LIB, themeName)
      const stat = await fs.stat(themeDir)
      if (!stat.isDirectory()) {
        continue
      }

      // 检查：主题文件夹要有 preview.png 和 data.json 文件
      const files = await glob.glob('*.*', { cwd: themeDir })
      if (!files.includes('preview.png') || !files.includes('data.json')) {
        continue
      }

      // 读取该主题数据
      const dataPath = path.join(THEME_LIB, themeName, 'data.json')
      const dataRaw = await fs.readFile(dataPath, 'utf8')
      const data = JSON.parse(dataRaw)

      // 压入该主题信息
      themes.push({
        name:    themeName,
        preview: path.join(THEME_LIB_VITE, themeName, 'preview.png'),
        data:    data
      })
    } catch (error) {
      console.log(`读取 ${themeName} 主题失败`, error)
    }
  }

  // 返回所有主题
  return themes
}


module.exports = { getAllThemes }

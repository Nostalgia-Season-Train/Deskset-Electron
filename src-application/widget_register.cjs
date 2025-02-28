// === 常量 ===
const args = process.argv.slice(2)
const DEVELOP_ENV = args.includes('-debug') || false

const WIDGET_EXTN = DEVELOP_ENV ? 'vue' : 'js'  // 组件后缀
const WIDGET_DIR = DEVELOP_ENV ? './src-components' : './components'  // 存放组件的目录


// === 检索组件目录，返回组件列表 ===
const glob = require('glob')

const rawComponents = glob.sync(`*/*.${ WIDGET_EXTN }`, { cwd: `./${ WIDGET_DIR }` })

// 按中文排序
const components = rawComponents.sort((a, b) => a.localeCompare(b, 'zh-CN'))


// === 遍历组件列表，生成组件信息 ===
const path = require('path')

let categorys = new Map()
let widgets = []
let number = 0

for (const filePath of components) {
  const category = path.dirname(filePath)
  const name     = path.basename(filePath, `.${ WIDGET_EXTN }`)
  const id = category + '/' + name

  if (!categorys.has(category)) {
    categorys.set(category, [])
  }
  categorys.get(category).push(name)

  widgets.push({
    num: number,  // 组件次序，提供临时数字索引
    id:       id,
    category: category,
    name:     name,
    relpath: `../../${ WIDGET_DIR }/${ id }.${ WIDGET_EXTN }`,  // file 协议 import(relpath)，构建后相对于 dist/assets
    isDisplay: false
  })

  number++
}


// === 导出组件信息 ===
module.exports = {
  categorys,
  widgets,
  number
}

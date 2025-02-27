// === 检索组件目录，返回组件列表 ===
const glob = require('glob')

const components = glob.sync('*/*.js', { cwd: './components' })


// === 遍历组件列表，生成组件信息 ===
const path = require('path')

let categorys = new Map()
let widgets = []
let number = 0

for (const filePath of components) {
  const category = path.dirname(filePath)
  const name     = path.basename(filePath, '.js')
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
    relpath: `../../components/${ id }.js`,  // file 协议 import(relpath)，构建后相对于 dist/assets
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

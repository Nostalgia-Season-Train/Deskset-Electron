import { ref } from "vue"

const components = import.meta.glob("../components/*/*.vue", { eager: true })


let categoryList = new Map()
let widgetList = []
let num = 0

for (const [path, value] of Object.entries(components)) {
  const path_parts = path.replace(".vue", "").split("/").slice(2)

  const id = path_parts.join("/")  // 组件 ID = 类型/名称 - 文件夹/文件名
  const category = path_parts[0]   // 类型 - 文件夹
  const name     = path_parts[1]   // 名称 - 文件名

  if (!categoryList.has(category)) {
    categoryList.set(category, [])
  }
  categoryList.get(category).push(name)

  widgetList.push({
    num: num,  // 临时给一些简单遍历场景提供索引
    id:       id,
    category: category,
    name:     name,
    content: value.default,
    isDisplay: ref(false)
  })

  num++
}

export const categorys = categoryList
export const widgets = widgetList
export const number = num

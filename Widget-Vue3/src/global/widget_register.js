import { ref } from "vue"

const components = import.meta.glob("../components/*/*.vue", { eager: true })


let widgets = []
let num = 0
for (const [path, value] of Object.entries(components)) {
  const path_parts = path.replace(".vue", "").split("/").slice(2)

  widgets.push({
    numID: num,                   // 临时给一些简单遍历场景提供索引
    strID: path_parts.join("/"),  // 实际用到的 ID：文件夹/文件
    category: path_parts[0],
    name: path_parts[1],
    content: value.default,
    isDisplay: ref(false)
  })
  num++
}


export default widgets

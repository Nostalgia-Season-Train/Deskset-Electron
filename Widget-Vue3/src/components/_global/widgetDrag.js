const dragAndDrop = () => {
  return function down(event) {
    let x = event.offsetX
    let y = event.offsetY

    const move = (event) => {
      this.style.position = "fixed"
      this.style.left = event.clientX - x + "px"
      this.style.top = event.clientY - y + "px"
    }

    const up = () => {
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", up)
    }

    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
  }
}

/* export default 后，import 任意符号 from 文件 */
export default {
  /* 以插件形式暴露自定义指令 */
  install(app) {
    /* widgetDrag 对应 v-widget-drag 指令 */
    app.directive("widgetDrag", {
      mounted: (el) => {
        el.addEventListener("mousedown", dragAndDrop())
      },
      unmounted: (el) => {
        el.removeEventListener("mousedown")
      }
    })
  }
}

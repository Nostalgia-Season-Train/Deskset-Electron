function dragAndDrop() {
  // 上次移动距离
  let originX = 0
  let originY = 0

  return function down(event) {
    let beginX = event.clientX
    let beginY = event.clientY
    let moveX = 0
    let moveY = 0

    // 如果没有移动，那么 moveX、moveY 将不被 move 函数计算
    const move = (event) => {
      moveX = event.clientX - beginX + originX
      moveY = event.clientY - beginY + originY

      this.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    const up = () => {
      if (moveX !== 0 && moveY !== 0) {
        originX = moveX
        originY = moveY
      }

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
      mounted: (el, binding) => {
        binding.value = dragAndDrop()
        el.addEventListener("mousedown", binding.value)
      },
      unmounted: (el, binding) => {
        el.removeEventListener("mousedown", binding.value)
      }
    })
  }
}

import { createApp } from 'vue'
import './style.css'

import Desktop from './Desktop.vue'
import drag from './components/_global/widgetDrag'


// 创建 VUE3 页面
const app = createApp(Desktop)

app.use(drag)
app.mount('#desktop')

import { createApp } from 'vue'
import './style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Desktop from './Desktop.vue'
import drag from './global/widgetDrag'


const app = createApp(Desktop)

app.use(ElementPlus)
app.use(drag)
app.mount('#desktop')

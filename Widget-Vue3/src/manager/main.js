import { createApp } from 'vue'
import './style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Manager from './Manager.vue'


const app = createApp(Manager)
  .use(ElementPlus)
  .mount('#manager')

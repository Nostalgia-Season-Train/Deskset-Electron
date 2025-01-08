import { createApp } from 'vue'
import './style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Manager from './Manager.vue'


// 动态路由
import { createMemoryHistory, createRouter } from 'vue-router'

import Widget    from './components/Widget.vue'
import Wallpaper from './components/Wallpaper.vue'
import Theme     from './components/Theme.vue'
import Develop   from './components/Develop.vue'

const routes = [
  { path: '/',          component: Widget },
  { path: '/widget',    component: Widget },
  { path: '/wallpaper', component: Wallpaper },
  { path: '/theme',     component: Theme },
  { path: '/develop',   component: Develop }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


// 应用
const app = createApp(Manager)
  .use(router)
  .use(ElementPlus)
  .mount('#manager')

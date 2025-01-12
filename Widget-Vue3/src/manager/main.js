import { createApp } from 'vue'
import './style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Manager from './Manager.vue'


// 动态路由
import { createMemoryHistory, createRouter } from 'vue-router'

import WidgetAll from './components/WidgetAll.vue'
import Theme     from './components/Theme.vue'
import Develop   from './components/Develop.vue'

import Widget from './components/Widget.vue'

const routes = [
  { path: '/', component: WidgetAll },

  { path: '/widget-all', component: WidgetAll },
  { path: '/theme',      component: Theme },
  { path: '/develop',    component: Develop },

  { path: '/widget/:category', component: Widget }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


// 持久化
import { createPinia } from 'pinia'

const pinia = createPinia()


// 应用
const app = createApp(Manager)
  .use(router)
  .use(pinia)
  .use(ElementPlus)
  .mount('#manager')

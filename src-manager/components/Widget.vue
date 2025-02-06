<script setup>
// 组件预览：计算 id，找到相关组件并预览
import { shallowRef, defineAsyncComponent } from "vue"
import { widgets, categorys, number } from "../../src-components/widget_register"

const widgetNow = shallowRef(widgets[0])
const widgetPreview = shallowRef(defineAsyncComponent(widgets[0].content))

const handleSelect = (key, keyPath) => {
  const id = keyPath[0] + key

  for (const widget of widgets) {
    if (widget.id == id) {
      widgetNow.value = widget
      widgetPreview.value = defineAsyncComponent(widget.content)
    }
  }

  // 选择一次，查询一次桌面上的组件信息
  desktop.getWidgetOnDesktop(id)
}


// 组件信息显示
import { onBeforeUnmount } from 'vue'

const pageManager = new BroadcastChannel('pageManager')

pageManager.onmessage = async (event) => {
  value按钮.value = event.data?.isDisplay
}
onBeforeUnmount(() => { pageManager.onmessage = null })  // 解除绑定，否则重进页面后 onmessage 会执行两次以上
desktop.getWidgetOnDesktop(widgets[0].id)  // 每次进入页面，查询第一个桌面上的组件


// 组件开关
import { ref } from 'vue'

const value按钮 = ref(false)


// 控制桌面上的组件
import desktop from './desktop'

const triggerDisplay = (id, isDisplay) => {
  desktop.switchWidget(id, isDisplay)
}
</script>


<template>
<el-container>

  <el-aside width="30%">
    <el-scrollbar>
      <el-menu
        :default-active="widgets[0].name"
        :default-openeds="[String(categorys.keys().next().value + '/')]"
        @select="handleSelect"
      >
        <el-sub-menu v-for="category in [...categorys.keys()]" :index="category + '/'">
          <template #title>
            <span>{{ category }}</span>
          </template>
          <el-menu-item v-for="widget in categorys.get(category)" :index="widget">
            <span>{{ widget }}</span><!-- widget 是 categorys 中的组件名 -->
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>

  <el-main>
    <el-scrollbar>
      <div class="preview">
        <Suspense>
          <component :is="widgetPreview"/>
        </Suspense>
      </div>
      <!-- 就让 v-model 变化触发 el-switch 切换动画，当成特性 -->
      <el-switch
        v-model="value按钮"
        @click="triggerDisplay(widgetNow.id, value按钮)"
      />
    </el-scrollbar>
  </el-main>

</el-container>
</template>


<style scoped>
.el-container {
  width: 100%;
  height: 100%;
}

/* 去掉侧边栏滚动条和分界线 */
:deep(.el-scrollbar__thumb) {
  display: none;
}
.el-menu {
  border: 0;
}

.el-main {
  padding: 10px;
}
.preview {
  padding: 5px;
  pointer-events: none;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup>
// 组件开关
import { widgetStore } from "../store/widget"

const value按钮 = widgetStore().isDisplay


// 刷新
import { ref, shallowRef } from "vue"
import { widgets } from "../../global/widget_register"

const categoryNow = ref('')
const widgetNow = shallowRef([])

const refresh = (category) => {
  categoryNow.value = category

  widgetNow.value = []
  for (const widget of widgets) {
    if (widget.category == category) {  
      widgetNow.value.push(widget)
    }
  }
}


// 按照路由参数显示
import { watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

refresh(route.params.category)  // 进入页面刷新

watch(                          // 路由更改刷新
  () => route.params.category,
  async (category) => {
    refresh(category)
  }
)


// 桌面管理
const bc = new BroadcastChannel("Desktop")

const triggerDisplay = (id, isDisplay) => {
  bc.postMessage({
    "action": "switchDisplay",
    "id": id,
    "isDisplay": isDisplay
  })
}
</script>


<template>
<div>
  <el-scrollbar height="100vh">
    <div class="category-title">
      <div>{{ categoryNow }}</div>
    </div>
    <div class="category-content">
      <div class="widget" v-for="widget in widgetNow" :index="widget.id">
        <div class="widget-preview">
          <component :is="widget.content"/>
        </div>
        <div>{{ widget.name }}</div>
        <el-switch
          v-model="value按钮[widget.numID]"
          @change="triggerDisplay(widget.id, value按钮[widget.numID])"
        />
      </div>
    </div>
  </el-scrollbar>
</div>
</template>


<style scoped>
.category-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;

  margin-left: 5px;
  margin-right: 5px;
}

.widget {
  box-shadow: 0 0 0 1px #ccc inset;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.widget-preview {
  width: 100%;
  height: 100%;
  padding: 1px;
  background-color: gray;

  display: flex;
  justify-content: center;
  align-items: center;

  pointer-events: none;
}
</style>

<script setup>
// 组件开关
import { widgetStore } from "../store/widget"

const value按钮 = widgetStore().isDisplay


// 显示
import { widgets } from "../../global/widget_register"

let categorys = []
let widgetCategory = []

for (const widget of widgets) {
  if (!categorys.includes(widget.category)) {
    categorys.push(widget.category)
    widgetCategory[widget.category] = []
  }

  widgetCategory[widget.category].push(widget)
}


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
    <div class="category" v-for="category in categorys" :index="category">
      <div class="category-title">
        <div>{{ category }}</div>
      </div>
      <div class="category-content">
        <div class="widget" v-for="widget in widgetCategory[category]" :index="widget.id">
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
  padding: 1px;  /* 越过了边框，后面处理 */
  background-color: gray;

  display: flex;
  justify-content: center;
  align-items: center;

  pointer-events: none;
}
</style>

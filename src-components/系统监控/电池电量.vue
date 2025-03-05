<script setup>
import { ref } from 'vue'
import { desksetReq } from '../request'

const battery_percent = ref(100)

const refresh = async () => {
  const rep = await desksetReq.get('/v0/device/battery')
  battery_percent.value = rep.data.data.percent
}
refresh()


import { useIntervalFn } from '@vueuse/core'

useIntervalFn(refresh, 1000)
</script>


<template>
<div>
  <div class="battery">
    <div class="charging"></div>
  </div>
</div>
</template>


<style scoped>
.battery {
  position: relative;  /* 帮助伪元素定位 */
  width: 60px;
  height: 25px;
  box-sizing: border-box;  /* 确保总宽总高为 60 * 25 */

  padding: 2px;

  border: 3px solid #FFF;
}
.battery::after {  /* 电池头 */
  position: absolute;
  width: 4px;
  height: 60%;

  content: '';
  background-color: #FFF;

  top: 50%;                     /* 相对父级下移 50% 左上垂直居中父级 */
  transform: translateY(-50%);  /* 相对自身上移 50% 中心垂直居中父级 */
  right: -10px;
}

.charging {
  width: v-bind(battery_percent + '%');
  height: 100%;
  background-color: white;
}
</style>

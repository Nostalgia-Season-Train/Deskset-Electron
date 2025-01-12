<script setup>
import { ref } from "vue"
import { Operation } from "@element-plus/icons-vue"

import Navigate from "./Navigate.vue"
const isOpenNav = ref(false)

import { useRouter } from "vue-router"
const router = useRouter()

const widgetPage = (category) => {
  if (category != '') {
    router.push({ path: `/widget/${category}` })
  } else {
    router.push({ path: '/widget-all' })
  }
}

const themePage   = () => { router.push({ path: "/theme"   }) }
const developPage = () => { router.push({ path: "/develop" }) }
</script>


<template>
<body>
  <main>
    <RouterView />
  </main>
  <nav>
    <el-drawer v-model="isOpenNav" direction="ltr" :with-header="false"
      size="25vw"
      style="--el-drawer-padding-primary: 0;"
    >
      <Navigate
        @widgetPage="widgetPage"
        @themePage="themePage"
        @developPage="developPage"
      />
    </el-drawer>
    <div style="position: fixed; top: 5px; right: 5px;">
      <el-button type="primary" @click="isOpenNav = true"
        style="padding: 0;"
      >
        <el-icon :size="30"><Operation /></el-icon>
      </el-button>
    </div>
  </nav>
</body>
</template>


<style scoped>
* {
  margin: 0; padding: 0;
  user-select: none;
}

main {
  width: 100%; height: 100%;
}
</style>

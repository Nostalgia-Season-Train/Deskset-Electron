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
  <nav>
    <Navigate
      @widgetPage="widgetPage"
      @themePage="themePage"
      @developPage="developPage"
    />
  </nav>
  <main>
    <RouterView />
  </main>
</body>
</template>


<style scoped>
* {
  margin: 0; padding: 0;
  user-select: none;
}

body {
  display: flex;
}

nav {
  width: 25%; height: 100%;
}
main {
  width: 75%; height: 100%;
}
</style>

<script setup>
/* 顶部导航 */
import Navigate from "./Navigate.vue"


/* 路由 */
import { useRouter } from "vue-router"

const router = useRouter()

const themePage   = () => { router.push({ path: "/theme"   }) }
const widgetPage  = () => { router.push({ path: "/widget"  }) }
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

nav {
  height: 10vh;
}
main {
  height: 90vh;
}
</style>

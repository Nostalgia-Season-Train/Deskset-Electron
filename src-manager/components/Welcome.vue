<script setup>
const openReleasePage = (url) => {
  window.electron.openBrowser(url)
}
</script>


<template>
<el-scrollbar>
<div class="container">

  <div class="center">
    <div>
      <img src="/static/icons/Deskset.png" width="160px"></img>
    </div>
    <div>欢迎使用数字桌搭 Deskset</div>
    <div>一款桌面美化软件</div>
    <div>基于 Web 技术开发</div>
    <div>实现桌面美化与笔记应用间的互动</div>
  </div>

  <!-- 这里之后放使用方法 -->

  <h2>注意</h2>
  <div>
    目前，数字桌搭正处于早期开发阶段，选择 Electron + FastAPI 的组合以快速构建项目。
    不过，当项目成熟后，计划加入 Tauri 框架作为前端显示，减少资源占用并提升性能
  </div>
  <div>
    同时，为了避免潜在错误，建议定期备份数字桌搭所绑定的笔记仓库
  </div>

  <h2>下载</h2>
  <div style="color: #F44336;">
    注：数字桌搭跟桌面图标有些冲突，使用前需要隐藏桌面图标
  </div>
  <div>Electron 版本：
    <a href="" style="color: #616161;"
      @click="openReleasePage('https://github.com/Nostalgia-Season-Train/Deskset-Electron')"
    >Deskset-Electron</a>
  </div>
  <div>Tauri 版本（开发中）：
    <a href="" style="color: #616161;"
      @click="openReleasePage('https://github.com/Nostalgia-Season-Train/Deskset-Tauri')"
    >Deskset-Tauri</a>
  <div>Gitee 地址：
    <a href="" style="color: #616161;"
      @click="openReleasePage('https://gitee.com/Nostalgia-Season-Train/Deskset-Electron')"
    >Deskset-Electron</a>
    <span>、</span>
    <a href="" style="color: #616161;"
      @click="openReleasePage('https://gitee.com/Nostalgia-Season-Train/Deskset-Tauri')"
    >Deskset-Tauri</a>
  </div>
  </div>

  <h2>交流</h2>
  <div>QQ 群：770889923</div>

  <h2>问答</h2>
  <div>问：为什么不采用 Qt、WPF 开发？而是占用内存和硬盘更高的 Web 技术</div>
  <div>答：
    相较于 C++、C#，Web 很容易二次开发。
    如果实在讨厌 Web，可以选择市面上更加成熟且轻量的美化程序，如 Rainmeter、SAO Utils 2 等
  </div>

</div>
</el-scrollbar>
</template>


<style scoped>
/* 去掉滚动条 */
:deep(.el-scrollbar__thumb) {
  display: none;
}

.container {
  padding: 10px;
  user-select: text;  /* 允许复制文字 */
}

.center>div {
  text-align: center;
}
</style>

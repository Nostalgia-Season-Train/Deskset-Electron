<script setup>
function fileDrop(event) {
  const file = event.dataTransfer.files[0]  // 暂不考虑多文件
  electron.showFilePath(file)
}
</script>


<template>
  <div style="width: 300px; height: 400px; background-color: white;"
    @drop="fileDrop"
    @drop.prevent
    @dragover.prevent
  >
    <span>拖拽获取文件路径</span>
  </div>
</template>

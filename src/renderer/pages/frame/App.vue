<template>
  <div class="frame-titlebar"></div>
  <iframe class="frame-iframe" :src="target" />
</template>

<script setup lang="ts" name="FrameView">
const query = new URLSearchParams(window.location.search);
const target = query.get("target"); // web页面地址
</script>

<style lang="scss">
$titleBarHeight: 35px; // 标题栏高度

body {
  margin: 0;
}

.frame-titlebar {
  -webkit-app-region: drag;
  height: $titleBarHeight;
  background-color: rgb(250, 250, 250);
}

.frame-iframe {
  display: block;
  border: none;
  width: 100%;
  height: calc(100vh - $titleBarHeight);
}
</style>

<template>
  <div class="frame-titlebar">
    <i-icons-logo
      v-if="isDev"
      class="frame-titlebar__logo"
      @click="handleReload"
    />
  </div>
  <iframe class="frame-iframe" :src="target" />
</template>

<script setup lang="ts" name="FrameView">
const isDev = process.env.NODE_ENV === "development";

const query = new URLSearchParams(window.location.search);
const target = query.get("target"); // web页面地址

/**
 * 刷新页面
 */
const handleReload = () => {
  window.location.reload();
};
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

  &__logo {
    -webkit-app-region: no-drag;
    margin-left: 15px;
    vertical-align: middle;
    cursor: pointer;
    padding: 3px;
    border: 1px solid transparent;

    &:hover {
      border-color: black;
    }
  }
}

.frame-iframe {
  display: block;
  border: none;
  width: 100%;
  height: calc(100vh - $titleBarHeight);
}
</style>

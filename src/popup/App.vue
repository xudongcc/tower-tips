<template>
  <div id="app">
    <header class="tips-header">Tower.im Tips</header>
    <router-view class="tips-main" />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
}

.tips-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background-color: rgb(118, 193, 197);
  color: #fff;
  font-size: 16px;
}

.tips-main {
  flex: 1;
  overflow: auto;
}
</style>

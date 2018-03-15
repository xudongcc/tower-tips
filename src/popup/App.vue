<template>
  <div id="app">
    <header class="tips-header">
      <div class="tips-header__icon">
        <font-awesome-icon icon="check" />
      </div>
      <h1 class="tips-header__title">Tower.im Tips</h1>
      <div class="tips-header__icon">
        <font-awesome-icon icon="cog" />
      </div>
    </header>
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

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  &__title {
    flex: 1;
    display: flex;
    font-size: 16px;
    justify-content: center;
  }
}

.tips-main {
  flex: 1;
  overflow: auto;
}
</style>

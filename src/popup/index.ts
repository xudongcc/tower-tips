import Vant from "vant";
import "vant/lib/vant-css/index.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const backgroundPage = chrome.extension.getBackgroundPage();

let background: any;
if (backgroundPage) {
  background = (window as any).background = (backgroundPage.window as any).background;
}

Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");

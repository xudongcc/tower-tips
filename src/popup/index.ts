import Vant from "vant";
import "vant/lib/vant-css/index.css";

import Raven from "raven-js";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const backgroundPage = chrome.extension.getBackgroundPage();

let background: any;
if (backgroundPage) {
    background = (window as any).background = (backgroundPage.window as any).background;
}

Raven
    .config("https://a2dde95b2714404ba3f90f4738ef3bea@sentry.io/1164047")
    .install();

Vue.use(Vant);

Vue.config.productionTip = false;

Raven.setUserContext({ clientId: background.clientId });

Raven.context(() => {
  new Vue({
    render: (h) => h(App),
    router,
    store,
  }).$mount("#app");
});

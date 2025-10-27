import "./assets/styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { devtools } from "@vue/devtools";
import { isDev } from "@/common/utils/env";

if (isDev()) {
  devtools.connect(
    "http://localhost",
    Number(process.env.VUE_DEVTOOLS_PORT) || undefined
  );
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

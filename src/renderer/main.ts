import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { devtools } from "@vue/devtools";

if (process.env.NODE_ENV === "development") {
  devtools.connect("http://localhost", 8090);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

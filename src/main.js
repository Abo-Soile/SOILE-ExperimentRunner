import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { setupAxios } from "./axios";
// use pinia for state management
import { createPinia } from "pinia";
import { router } from "./helpers/router";

// import primevue styles and package
import PrimeVue from "primevue/config";
//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";
//core
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

// primeflex for layouting
import "primeflex/primeflex.css";

//SOILE Specific css
import "@/assets/globalStyles.css";

// localisation support
import i18n from "./i18n";

// set up axios URLs
setupAxios(import.meta.env);

// set up the app.
const app = createApp(App);
app
  .use(i18n)
  .directive("tooltip", Tooltip)
  .use(createPinia())
  .use(PrimeVue)
  .use(ToastService)
  .use(router)
  .mount("#app");

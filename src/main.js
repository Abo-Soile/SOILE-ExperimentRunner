import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './axios'
// use pinia for state management
import { createPinia } from 'pinia'
import { router } from './helpers';
// Import Bootstrap and BootstrapVue CSS files (order is important)
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);
app.use(BootstrapVue)
.use(IconsPlugin)
.use(createPinia())
.use(router)
.mount('#app')

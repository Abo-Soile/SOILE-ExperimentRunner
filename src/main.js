import Vue from 'vue'
import './style.css'
import App from './App.vue'
import './axios'
// use pinia for state management
import { createPinia } from 'pinia'
import { router } from './helpers';
// Import Bootstrap and BootstrapVue CSS files (order is important)
import { BootstrapVue, IconsPlugin, BVToastPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BaklavaVuePlugin } from '@baklavajs/plugin-renderer-vue'
import '@baklavajs/plugin-renderer-vue/dist/styles.css'
import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(BVToastPlugin)
Vue.use(BaklavaVuePlugin)
Vue.use(createPinia())
const app = new Vue({ router, render : h=> h(App)})
.$mount('#app')

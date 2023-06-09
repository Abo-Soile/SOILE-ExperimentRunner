import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
console.log(import.meta.env)

import './axios'
// use pinia for state management
import { createPinia } from 'pinia'
import { router } from './helpers/router';

// import primevue styles and package
import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";         
//core
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';

// primeflex for layouting
import 'primeflex/primeflex.css' 

const app = createApp(App);
app.use(createPinia())
.use(PrimeVue)
.use(ToastService)
.use(router)
.mount('#app')

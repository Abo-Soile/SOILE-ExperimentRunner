import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import routing components
import ExperimentRunner from './components/ExperimentRunner.vue'
import HelloWorld from './components/HelloWorld.vue'
import Home from './components/Home.vue'


const routes = [
    {
        path: '/',
        name: 'Hello',
        component: HelloWorld
    },
    {
        path: '/about',
        name: 'About',
        component: Home
    },
    {
        path: '/exp/:id',
        name: 'Experiment Runner',
        component: ExperimentRunner,
        props: true
    }
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })

const app = createApp(App);
app.use(BootstrapVue)
app.use(IconsPlugin)
app.use(router);

app.mount('#app')

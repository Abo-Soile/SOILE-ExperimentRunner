import VueRouter from 'vue-router'

import { ExperimentView, WelcomeView, SignupView ,ResearcherView } from '@/views';


const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: WelcomeView
    },
    {
        path: '/management',
        name: 'Welcome',
        component: ResearcherView
    },
    {
        path: '/exp/:id/:taskID/',        
        name: 'Experiment Runner',
        component: ExperimentView,
        props: true
    },
    {
        path: '/signup/:id',
        name: 'Signup',
        component: SignupView,
        props: true
    }
]


export const router = new VueRouter({
    mode: 'history',    
    routes: routes
});
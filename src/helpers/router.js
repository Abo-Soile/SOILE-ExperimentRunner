import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import { ExperimentView, WelcomeView, SignupView } from '@/views';


const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: WelcomeView
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


export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: routes
});

// We will skip this for

/*router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/'];    
    // signup is special.
    const authRequired = !publicPages.includes(to.path) && ! to.path.startsWith('/signup');
    const isExp = to.path.startsWith('/exp');
    const auth = useAuthStore();
    console.log("Routing to " + to.path)
    console.log("Authenticated: " + auth.authed)
    console.log("Auth required: " + authRequired)
    if (authRequired && !auth.authed ) {
        if(!isExp)
        {
            auth.returnUrl = to.fullPath;
            return '/';
        }
    }    
});*/
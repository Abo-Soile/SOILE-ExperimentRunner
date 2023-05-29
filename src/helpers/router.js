import { createRouter, createWebHistory } from 'vue-router';
import { ManagementView, SignupView, ExperimentView, ExperimentPreviewView, WelcomeView } from '@/views';
import { useUserStore } from '@/stores/users';

const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: WelcomeView
    },
    {
        path: '/management',
        name: 'ManagementView',
        component: ManagementView
    },
    {
        path: '/preview/:taskID/:taskVersion/',
        name: 'Preview',
        component: ExperimentPreviewView
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

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const userStore = useUserStore();
    // regardless on where we are, we are NOt currently running a task.
    userStore.setTaskNotRunning();
});
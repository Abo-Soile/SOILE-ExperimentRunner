import { defineStore } from 'pinia';

import axios from 'axios';
import { router } from '@/helpers';

import { useProjectStore } from './project';
import { useErrorStore } from './errors';


export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        jwtToken: localStorage.getItem('jwtToken'),
        projectToken: localStorage.getItem('projectToken'),
        returnUrl: null
    }),
    actions: {
        async refreshSession() {

        },
        async login(username, password, remember) {

            var loginData = {
                username,
                password,
                remember: remember ? '1' : '0'
            };
            console.log(loginData);
            try {
                const response = await axios.post('/login',
                    loginData,
                    {
                        headers: { "Content-Type": "application/json" }
                    })
                console.log(response?.data);
                const response2 = await axios.get('/test/auth')
                console.log(response2?.data);

                // update pinia state
                this.user = response2?.data.user;
                this.setAccessToken(response?.data.token)
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(this.user));
                const listStore = useProjectStore();
                await listStore.updateAvailableProjects();
                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            }
            catch (e) {
                this.processAxiosError(e)
            }
        },
        async logout() {
            try {
                // post to logout (invalidating session)
                const response = await axios.post('/logout')
                // reset user and update available projects.
                this.user = null;
                localStorage.removeItem('user');
                this.setAccessToken(null);
                this.setProjectToken(null);
                const listStore = useProjectStore();
                listStore.clearProject();
                await listStore.updateAvailableProjects();
                console.log("Logged Out");
            }
            catch (e) {
                this.processAxiosError(e)
            }

        },
        async signUp(projectID, accessToken) {
            const params = accessToken ? { params: { token: accessToken } } : {}
            try {
                const response = await axios.post('/projectexec/' + projectID + '/signup', params)
                this.setProjectToken(response?.data.token)
            }
            catch (failed) {
                this.processAxiosError(failed)
            }
        },
        setAccessToken(token) {
            this.jwtToken = token;
            if (token) {
                localStorage.setItem('jwtToken', JSON.stringify(this.jwtToken));
            }
            else {
                localStorage.removeItem('jwtToken');
            }
        },
        async setProjectToken(token) {
            this.projectToken = token;
            if (token) {
                localStorage.setItem('projectToken', JSON.stringify(this.projectToken));
            }
            else {
                localStorage.removeItem('projectToken');
            }
            try{
                //refresh the session cookie.
                const response2 = await axios.get('/test/auth')
                
                console.log(response2?.data);
            }
            catch(e)
            {
                this.processAxiosError(e)
            }

        },
        processAxiosError(err) {
            const errorStore = useErrorStore()
            errorStore.raiseError(err.response?.status, err.response?.data)
        }
    }
});

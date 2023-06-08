import { defineStore } from 'pinia';

import axios from 'axios';
import { useErrorStore } from './errors';

export const useProjectStore = defineStore({
    id: 'projects',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data        
        selectedProject: JSON.parse(sessionStorage.getItem('soile-selectedproject')),
        signedUpStudies: [],
        availableProjectInstances: [],
    }),
    actions: {
        async updateAvailableStudies() {
            try {
                const response = await axios.post('/projectexec/list');
                console.log(response?.data);
                // update pinia state
                this.availableProjectInstances = response?.data;
            }
            catch (e) {
                console.log("Error" + e);
                this.processAxiosError(e);
            }
        },
        selectProject(index) {
            console.log("Selecting Project")
            this.selectedProject = this.availableProjectInstances[index];
            console.log("Selected Project: ")
            console.log(this.selectedProject)
            sessionStorage.setItem('soile-selectedproject', JSON.stringify(this.selectedProject));
        },
        clearData() {
            this.selectedProject = {};
            sessionStorage.setItem('soile-selectedproject', JSON.stringify(this.selectedProject));
            this.signedUpStudies = [];
        },
        async fetchSignedUpStudies() {
            try {
                console.log("Updating signed up projects")
                const response = await axios.post('/user/activeprojects')
                this.signedUpStudies = response?.data
                console.log(response)
            }
            catch (error) {
                // unauthenticated is an expected error here, that we will ignore, but any other error should be resolved.
                if (!error.response?.status == 401) {
                    console.log(error)
                    this.processAxiosError(error)
                }

            }
        },
        processAxiosError(err) {
            const errorStore = useErrorStore()
            errorStore.processAxiosError(err)

        },
    }
});

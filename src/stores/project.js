import { defineStore } from 'pinia';

import axios from 'axios';
import { useErrorStore } from './errors';

export const useProjectStore = defineStore({
    id: 'projects',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data
        projects: [],   
        selectedProject: JSON.parse(sessionStorage.getItem('soile-selectedproject')),             
        signedUpProjects: []
    }),
    actions: {
        async updateAvailableProjects() {
            try {
                const response = await axios.post('/projectexec/list');
                console.log(response?.data);
                
                // update pinia state
                this.projects = response?.data;
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        selectProject(index)
        {            
            this.selectedProject = this.projects[index];
            sessionStorage.setItem('soile-selectedproject', JSON.stringify(this.selectedProject));            
        },
        clearData()
        {
            this.selectedProject = {};
            sessionStorage.setItem('soile-selectedproject', JSON.stringify(this.selectedProject));            
            this.signedUpProjects = [];
        },
        async fetchSignedUpProjects() {
            try {
                const response = await axios.post('/user/activeprojects')
                this.signedUpProjects = response?.data
                console.log(response)
              }
              catch (error) {
                // unauthenticated is an expected error here, that we will ignore, but any other error should be resolved.
                if(!error.response?.status == 401)
                {
                    console.log(error)
                    this.processAxiosError(error)            
                }
                
            }
        },
        processAxiosError(err) {
            const errorStore = useErrorStore()
            console.log(err);
            errorStore.raiseError(err.response?.status, err.response?.data)
        }
    }
});

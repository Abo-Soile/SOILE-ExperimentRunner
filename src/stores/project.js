import { defineStore } from 'pinia';

import axios from 'axios';
import { useErrorStore } from './errors';

export const useProjectStore = defineStore({
    id: 'projects',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data
        projects: [],   
        selectedProject: JSON.parse(sessionStorage.getItem('soile-selectedproject')),             
        signedUpProjects: [],
        availableTasks: [],
        availableExperiments: [],                
        outputInformation: new Map(),
        nodeNames: new Map(),
        nodeCounts: new Map()
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
        async updateAvailableExperiments() {
            try {
                const response = await axios.post('/experiment/list');
                console.log(response?.data);
                
                // update pinia state
                this.availableExperiments = response?.data;
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        async updateAvailableTasks() {
            try {
                const response = await axios.post('/task/list');
                console.log(response?.data);
                
                // update pinia state
                this.availableTasks = response?.data;
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        async getTaskOptions(uuid) {
            try {
                const response = await axios.post('/task/'+ uuid +'/list');
                return response?.data
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        selectProject(index)
        {            
            console.log("Selecting Project")
            this.selectedProject = this.projects[index];
            console.log("Selected Project: ")
            console.log(this.selectedProject)
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
            if(err.response?.status === 401 || err.response?.status === 403)
            {
                errorStore.raiseError("warn", "No Authorization or Authentication unsuccessful (code " + err.response?.status + ")")
            }
            else
            {
                errorStore.raiseError("danger", err.response?.message + "/" + errorStore.getReason(err.response?.status))
            }            

        },       

    }
});

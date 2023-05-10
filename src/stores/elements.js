import { defineStore } from 'pinia';

import axios from 'axios';
import { useErrorStore } from './errors';

export const useElementStore = defineStore({
    id: 'elements',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data        
        availableTasks: [],
        availableExperiments: [],                
        availableProjects: [],
    }),
    actions: {
        async updateAvailableProjects() {
            try {
                const response = await axios.post('/project/list');
                console.log(response?.data);
                
                // update pinia state
                this.availableProjects = response?.data;
                console.log(this.availableProjects);
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
        async getProjectOptions(uuid) {
            try {
                const response = await axios.post('/project/'+ uuid +'/list');
                return response?.data
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        async getExperimentOptions(uuid) {
            try {
                const response = await axios.post('/experiment/'+ uuid +'/list');
                return response?.data
            }
            catch (e) {
                console.log("Error" + e);                
                this.processAxiosError(e);
            }
        },
        // get the list of objects for the given type. Makes it easier to write reusable components
        async getListForType(type)
        {
            switch(type)
            {
                case "task": return this.availableTasks; 
                case "project": return this.availableProjects;
                case "experiment": return this.availableExperiments;
            }
        },
        async getOptionsForElement(uuid, type)
        {
            switch(type)
            {
                case "task": return await this.getTaskOptions(uuid);
                case "project": return await this.getProjectOptions(uuid);
                case "experiment": return await this.getElementOptions(uuid);
            }
        },
        async updateAvailableOptions(type)
        {
            switch(type)
            {
                case "task": await this.updateAvailableTasks();
                case "project": await this.updateAvailableProjects();
                case "experiment": await this.updateAvailableExperiments();
            }
        },        
        processAxiosError(err) {
            const errorStore = useErrorStore()
            errorStore.processAxiosError(err)          

        },       

    }
});

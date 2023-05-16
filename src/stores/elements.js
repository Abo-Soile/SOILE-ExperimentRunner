import { defineStore } from 'pinia';
import { getPersistentFromTask } from '@/javascript/experimentlang/checkElang'
import axios from 'axios';
import { useErrorStore } from './errors';

export const useElementStore = defineStore({
    id: 'elements',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data        
        availableTasks: [],
        availableExperiments: [],                
        availableProjects: [],
        elements: {task : {}, project : {} , experiment : {}}
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
        /**
         * Get an element, either load (if not yet loaded) or take from memory.
         * @param {*} uuid the uuid of the object
         * @param {*} version  the version of the object
         * @param {*} type the type (element, task or project) of the object
         */
        async getElement(uuid, version, type)
        {
            try {
                
                const element = this.elements[type][uuid] ? this.elements[type][uuid][version] : undefined;
                if(element)
                {
                    return element
                }
                else{
                    if(!this.elements[type][uuid])
                    {
                        this.elements[type][uuid] = {};
                    }
                    const response = await axios.get("/" + type.toLowerCase() + "/" + uuid + "/" + version)
                    this.elements[type][uuid][version] = response.data;
                    return this.elements[type][uuid][version];
                }                
            }
            catch (err) {
                this.processAxiosError(err)
            }
        },
        async getPersistentDataForTask(uuid, version)
        {
            const element = await this.getElement(uuid, version, "task");
            if(element.codeType.language === "elang")
            {
                return getPersistentFromTask(element.code);
            }
            else{
                return [];
            }
        },     
        async getPersistentDataForExperiment(uuid, version)
        {
            const experiment = await this.getElement(uuid, version, "experiment");            
            return getPersistentDataForExperimentInstance(experiment);
            
        },           
        async getPersistentDataForExperimentInstance(instance)
        {
            const persistentElements = new Set();
            for(const element of instance.elements)            
            {
                if(element.type === "task")
                {
                    const codeData = await this.getPersistentDataForTask(element.data.uuid, element.data.version);
                    const instanceData = element.data.persistent;
                    instanceData.array.forEach(value => {
                        persistentElements.add(value)
                    });
                    codeData.array.forEach(value => {
                        persistentElements.add(value)
                    });                
                }
                if( element.type === "experiment")
                {
                    this.getPersistentDataForExperimentInstance(element.data).forEach(value => {
                        persistentElements.add(value)
                    });
                }
            }
            return Array.from(persistentElements);
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
        reset()
        {
            this.availableTasks = [];
            this.availableExperiments = [];
            this.availableProjects= [];
            this.elements = {task : {}, project : {} , experiment : {}};
        }
    }
});

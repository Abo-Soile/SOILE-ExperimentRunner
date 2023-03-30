import { defineStore } from 'pinia';

import axios from 'axios';

export const useProjectStore = defineStore({
    id: 'projects',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data
        projects: [],   
        selectedProject: JSON.parse(localStorage.getItem('selectedproject')),             
    }),
    actions: {
        async updateAvailableProjects() {
            try {
                const response = await axios.get('/projectexec/list');
                console.log(response?.data);
                
                // update pinia state
                this.projects = response?.data;
            }
            catch (e) {
                console.log("Error" + e);
            }
        },
        selectProject(index)
        {            
            this.selectedProject = this.projects[index];
            localStorage.setItem('selectedproject', JSON.stringify(this.selectedProject));            
        },
        clearProject()
        {
            this.selectedProject = {};
            localStorage.setItem('selectedproject', JSON.stringify(this.selectedProject));
        }
    }
});

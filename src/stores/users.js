import { defineStore } from 'pinia';
import { useErrorStore } from './errors';

import axios from 'axios';


export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        // initialize state from session storage to enable user to stay logged in for the session (not using local store)
        currentTaskSettings: {},
        isRunningTask: false
    }),
    actions: {
        async updateTaskSettings(projectID) {
            console.log(projectID)
            if (projectID) {
                try {
                    const response = await axios.post("/projectexec/" + projectID + "/getcurrenttaskinfo")
                    this.currentTaskSettings = response.data;
                }
                catch (error) {
                    const errorStore = useErrorStore()
                    errorStore.processAxiosError(error)
                }
            }
        },        
        setTaskActive()
        {
            this.isRunningTask = true
        },
        setTaskNotRunning()
        {
            this.isRunningTask = false
        }
    }
});

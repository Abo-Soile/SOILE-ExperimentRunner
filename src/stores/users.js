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

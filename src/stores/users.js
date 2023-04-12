import { defineStore } from 'pinia';

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
            //const errorStore = useErrorStore()
            console.log(err);
            throw (err)
            //errorStore.raiseError(err.response?.status, err.response?.data)
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

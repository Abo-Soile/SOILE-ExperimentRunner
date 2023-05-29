import { defineStore } from 'pinia';
import { getReasonPhrase } from 'http-status-codes';
export const useErrorStore = defineStore({
    id: 'errors',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        errors: [],   
        latestError:{}     
    }),
    actions: {
        raiseError(severity, message) {
            if(!message)
            {
                message = "Unknown error"
            }
            this.errors.push({severity: severity, message: message, timestamp: new Date()});
            this.latestError = {message : message, severity: severity, timestamp: new Date()}
            console.log(severity, message)
        },
        getReason(errorCode)
        {
            if(!isNaN(errorCode))        
            {
                return getReasonPhrase(errorCode);
            }
            else{
                return "Unknown Error"
            }
        },
        clearErrors()
        {
            errors = {};
            latestError = {};
        },
        processAxiosError(err) {
            console.log(err);
            if(err.response?.status === 401 || err.response?.status === 403)
            {
                this.raiseError("warn", "No Authorization or Authentication unsuccessful (code " + err.response?.status + ")")
            }
            else if(err.response?.status === 409)
            {
                this.raiseError("error", "Conflict: " + err.response?.data)
            }
            else
            {
                this.raiseError("error", err.message + "/" + this.getReason(err.status))
            }            
        },
    }
});

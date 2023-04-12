import { defineStore } from 'pinia';
import { getReasonPhrase } from 'http-status-codes';
export const useErrorStore = defineStore({
    id: 'errors',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        errors: {},   
        latestError:{}     
    }),
    actions: {
        raiseError(errorClass, message) {
            if(!errorClass)
            {
                errorClass = 500
            }
            if(!message)
            {
                message = "Unknown error"
            }
            if(!isNaN(errorClass))        
            {
                errorClass = getReasonPhrase(errorClass);
            }
            if(!this.errors[errorClass])
            {
                this.errors[errorClass] = [];
            }
            this.errors[errorClass].push({message: message, timestamp: new Date()});
            this.latestError = {message : message, class: errorClass}
            console.log(errorClass, message)
        },
        clearErrors()
        {
            errors = {};
            latestError = {};
        }
    }
});

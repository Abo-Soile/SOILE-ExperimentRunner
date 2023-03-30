// stores/users.js
import { defineStore } from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useUserStore = defineStore("user", {
    state: () => ({
        signedUpProjects: [],
    }),
    getters: {
      getUsers(state){
          return state.signedUpProjects
        }
    },
    actions: {
      async fetchSignedUpProjects() {
        try {
          const data = await axios.get('/login')
            this.users = data.data
          }
          catch (error) {
            alert(error)
            console.log(error)
        }
      }
    },
})
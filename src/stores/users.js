/**
 * This is a store to handle user relevant actions. This also
 */
import { defineStore } from "pinia";
import { useErrorStore } from "./errors";

import axios from "axios";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    // initialize state from session storage to enable user to stay logged in for the session (not using local store)
    users: [],
  }),
  actions: {
    clearData() {
      this.users = [];
    },
    /**
     * Fetch the user data
     */
    async fetchUserData() {
      try {
        const response = await axios.post("/user/list");
        this.users = response.data;
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async updateRoleInStudy(username, newRole, studyID) {
      try {
        const permissionQuery = {
          username: username,
          command: "update",
          permissionProperties: {
            elementType: "STUDY",
            permissionSettings: [
              {
                type: newRole,
                target: studyID,
              },
            ],
          },
        };
        await axios.post("/user/setpermissions", permissionQuery);
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async createUser(userdata, register) {
      try {
        if (register) {
          await axios.post("/user/create", userdata);
        } else {
          await axios.post("/register", userdata);
        }
        await fetchUserData();
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    processAxiosError(err) {
      const errorStore = useErrorStore();
      errorStore.processAxiosError(err);
    },

    async getPermissions(user) {
      try {
        console.log("Getting permissions for " + user);
        const response = await axios.post("/user/getaccess?username=" + user);
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async changeUserRole(username, newRole) {
      try {
        await axios.post("/user/setrole", {
          username: username,
          role: newRole,
        });
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
  },
});

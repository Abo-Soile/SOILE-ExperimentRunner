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
    /**
     * Create a User, and indicate which endpoint to use
     * @param {*} userdata the data for the user
     * @param {*} register Whether to use the register end-point or the administrative end-point
     */
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

    /**
     * Get the permissions of a user.
     * @param {String} user the username
     */
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

    /**
     * General change permission implementation-
     * @param {*} user The use rto change
     * @param {*} newPermissions  the new permissions to add/set/remove
     * @param {*} type the type of object for which permissions are changed
     * @param {*} altType the alteration type (set/remove/add/update) Update will remove existing permissions and add thee given ones, i.e. removing anything that was there.
     */
    async changePermissions(user, newPermissions, type, altType) {
      try {
        console.log("Setting permissions for " + user);
        const permissionData = {
          username: user,
          command: altType,
          permissionsProperties: {
            elementType: type,
            permissionSettings: newPermissions,
          },
        };
        const response = await axios.post(
          "/user/setpermissions",
          permissionData
        );
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    /**
     * This is a hard set, for the given type of permissions.
     * @param {String} user
     * @param {Array} newPermissions the new permissions. must be an array of the following form:
     *                                [{ type : "READ"/"READ_WRITE"/"FULL", target: "idofTarget"}]
     * @param {String} type
     */
    async setPermissions(user, newPermissions, type) {
      return await this.changePermissions(user, newPermissions, type, "set");
    },
    /**
     *
     * @param {String} user
     * @param {Array} newPermissions the new permissions. must be of the following form
     *                                { type : "READ"/"READ_WRITE"/"FULL", target: "idofTarget"}
     *                                NOTE: This can only alter one Permission at a time!
     * @param {String} type
     */
    async updatePermission(user, newPermission, type) {
      return await this.changePermissions(
        user,
        [newPermission],
        type,
        "update"
      );
    },
    /**
     *
     * @param {String} user
     * @param {Array} newPermissions the new permissions. must be an array of the following form
     *                                [{ type : "READ"/"READ_WRITE"/"FULL", target: "idofTarget"}]
     * @param {String} type
     */
    async removePermission(user, newPermissions, type) {
      return await this.changePermissions(user, newPermissions, type, "remove");
    },
    /**
     * Change Role of a User
     * @param {String} username the uername
     * @param {String} newRole the role (string)
     */
    async changeUserRole(username, newRole) {
      try {
        await axios.post("/user/setrole", {
          username: username,
          role: newRole,
        });
        this.fetchUserData();
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    /**
     * Delete a user
     * @param {String} username  the username to delete
     */
    async deleteUser(username, deleteFiles) {
      try {
        await axios.post("/user/delete", {
          username: username,
          deleteFiles: deleteFiles ? true : false, // yes, we need to check here, since it can be undefined.
        });
        await this.fetchUserData();
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },

    /**
     * Get the information for a user
     * @param {String} username  The username to obtain data for
     */
    async fetchUserInfo(username) {
      try {
        const response = await axios.post("/user/getinfo?username=" + username);
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },

    /**
     * Get the information for a user
     * @param {Object} userData The data for the user (includes the username)
     */
    async setUserInfo(userData) {
      try {
        await axios.post("/user/setinfo", userData);
        // need to update the data after setting new information.
        await this.fetchUserData();
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
  },
});

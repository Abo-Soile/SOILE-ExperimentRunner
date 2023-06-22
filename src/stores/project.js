import { defineStore } from "pinia";

import axios from "axios";
import { useErrorStore } from "./errors";

export const useProjectStore = defineStore({
  id: "projects",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    selectedProject: JSON.parse(
      sessionStorage.getItem("soile-selectedproject")
    ),
    signedUpStudies: [],
    availableProjectInstances: [],

    currentTaskSettings: {},
    isRunningTask: false,
  }),
  actions: {
    clearData() {
      this.selectedProject = "";
      this.signedUpStudies = [];
      this.availableProjectInstances = [];
      this.currentTaskSettings = {};
      this.isRunningTask = false;
    },
    async updateAvailableStudies() {
      try {
        const response = await axios.post("/study/listrunning");
        console.log(response?.data);
        // update pinia state
        this.availableProjectInstances = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Selet the active project
     * @param {*} index
     */
    selectProject(index) {
      console.log("Selecting Project");
      this.selectedProject = this.availableProjectInstances[index];
      console.log("Selected Project: ");
      console.log(this.selectedProject);
      sessionStorage.setItem(
        "soile-selectedproject",
        JSON.stringify(this.selectedProject)
      );
    },
    /**
     * Clear all data
     */
    clearData() {
      this.selectedProject = {};
      sessionStorage.setItem(
        "soile-selectedproject",
        JSON.stringify(this.selectedProject)
      );
      this.signedUpStudies = [];
    },
    /**
     * Fetch the studies the current user is signed up to.
     */
    async fetchSignedUpStudies() {
      try {
        console.log("Updating signed up projects");
        const response = await axios.post("/user/activeprojects");
        this.signedUpStudies = response?.data;
        console.log(response);
      } catch (error) {
        // unauthenticated is an expected error here, that we will ignore, but any other error should be resolved.
        if (!error.response?.status == 401) {
          console.log(error);
          this.processAxiosError(error);
        }
      }
    },
    processAxiosError(err) {
      const errorStore = useErrorStore();
      errorStore.processAxiosError(err);
    },
    async updateTaskSettings(projectID) {
      console.log(projectID);
      if (projectID) {
        try {
          const response = await axios.post(
            "/study/" + projectID + "/getcurrenttaskinfo"
          );
          this.currentTaskSettings = response.data;
        } catch (error) {
          this.processAxiosError(error);
        }
      }
    },
    setTaskActive() {
      this.isRunningTask = true;
    },
    setTaskNotRunning() {
      this.isRunningTask = false;
    },
    async updaloadData(studyID, file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
          `/study/${studyID}/uploaddata`,
          formData
        );
        return response.data.id;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
  },
});

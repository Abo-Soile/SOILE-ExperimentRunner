import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "./errors";

export const useElementStore = defineStore({
  id: "elements",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    availableTasks: [],
    availableExperiments: [],
    availableProjects: [],
    elements: { task: {}, project: {}, experiment: {} },
  }),
  actions: {
    clearData() {
      this.availableTasks = [];
      this.availableExperiments = [];
      this.availableProjects = [];
      this.elements = { task: {}, project: {}, experiment: {} };
    },
    /**
     * Update the Projects available to the current user (i,.e where they have access to)
     */
    async updateAvailableProjects() {
      try {
        const response = await axios.post("/project/list");
        console.log(response?.data);

        // update pinia state
        this.availableProjects = response?.data;
        console.log(this.availableProjects);
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Update the Experiments available to the current user (i,.e where they have access to)
     */
    async updateAvailableExperiments() {
      try {
        const response = await axios.post("/experiment/list");
        console.log(response?.data);

        // update pinia state
        this.availableExperiments = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Update the Tasks available to the current user (i,.e where they have access to)
     */
    async updateAvailableTasks() {
      try {
        const response = await axios.post("/task/list");
        console.log(response?.data);

        // update pinia state
        this.availableTasks = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Get the available versions for a specific task
     * @param {string} uuid the UUID of the task
     */
    async getTaskOptions(uuid) {
      try {
        const response = await axios.post("/task/" + uuid + "/list");
        return response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Get the available versions for a specific project
     * @param {string} uuid the UUID of the project
     */
    async getProjectOptions(uuid) {
      try {
        const response = await axios.post("/project/" + uuid + "/list");
        return response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Get the available versions for a specific experiment
     * @param {string} uuid the UUID of the experiment
     */
    async getExperimentOptions(uuid) {
      try {
        const response = await axios.post("/experiment/" + uuid + "/list");
        return response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * get the list of objects for the given type. Makes it easier to write reusable components
     * @param {string} the type of element ('task','experiment' or 'project' )
     */
    async getListForType(type) {
      switch (type) {
        case "task":
          return this.availableTasks;
        case "project":
          return this.availableProjects;
        case "experiment":
          return this.availableExperiments;
      }
    },
    /**
     * Get the list of options/versions for the given element.
     * @param {string} uuid  the uuid of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     */
    async getOptionsForElement(uuid, type) {
      switch (type) {
        case "task":
          return await this.getTaskOptions(uuid);
        case "project":
          return await this.getProjectOptions(uuid);
        case "experiment":
          return await this.getExperimentOptions(uuid);
      }
    },
    /**
     * Get the list of tags for the specified items
     * @param {string} uuid  the uuid of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     */
    async getTagsForElement(uuid, type) {
      var options;
      const usedType = type.toLowerCase();
      switch (usedType) {
        case "task":
          options = await this.getTaskOptions(uuid);
          break;
        case "project":
          options = await this.getProjectOptions(uuid);
          break;
        case "experiment":
          options = await this.getExperimentOptions(uuid);
          break;
      }
      return options
        .filter((x) => x.tag)
        .map((x) => {
          return { tag: x.tag, version: x.version };
        });
    },
    /**
     * Get an element, either load (if not yet loaded) or take from memory.
     * @param {*} uuid the uuid of the object
     * @param {*} version  the version of the object
     * @param {*} type the type (element, task or project) of the object
     */
    async getElement(uuid, version, type) {
      const usedType = type.toLowerCase();
      try {
        const element = this.elements[usedType][uuid]
          ? this.elements[usedType][uuid][version]
          : undefined;
        if (element) {
          return element;
        } else {
          if (!this.elements[usedType][uuid]) {
            this.elements[usedType][uuid] = {};
          }
          const response = await axios.get(
            "/" + type.toLowerCase() + "/" + uuid + "/" + version + "/get"
          );
          this.elements[usedType][uuid][version] = response.data;
          if (!this.elements[usedType][uuid][version].tag) {
            const response = await axios.get(
              "/" + type.toLowerCase() + "/" + uuid + "/" + version + "/gettag"
            );
            this.elements[usedType][uuid][version].tag = response.data.tag;
          }
          return this.elements[usedType][uuid][version];
        }
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Write an element and return th new version.
     * @param {*} uuid the uuid of the object
     * @param {*} version  the version of the object this version is derived from.
     * @param {*} data the data of the elment (including version and uuid)
     * @param {*} type the type (element, task or project) of the object
     * @return The new Version of the element;
     */
    async updateElement(uuid, version, data, type) {
      try {
        const response = await axios.post(
          "/" + type.toLowerCase() + "/" + uuid + "/" + version + "/post",
          data
        );
        data.version = response.data.version;
        if (!this.elements[type.toLowerCase()][uuid]) {
          this.elements[type.toLowerCase()][uuid] = {};
        }
        this.elements[type.toLowerCase()][uuid][data.version] = data;
        return response.data.version;
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Write an element and return th new version.
     * @param {*} uuid the uuid of the object
     * @param {*} version  the version of the object this version is derived from.
     * @param {*} data the data of the elment (including version and uuid)
     * @param {*} type the type (element, task or project) of the object
     * @return The new Version of the element;
     */
    async createElement(name, data, type) {
      try {
        const response = await axios.post(
          "/" + type.toLowerCase() + "/create",
          null,
          {
            params: { name: name },
          }
        );
        data.UUID = response.data.UUID;
        data.version = response.data.version;
        const newVersion = await this.updateElement(
          data.UUID,
          data.version,
          data,
          type
        );
        data.version = newVersion;
        return data;
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Get the persistent data for a given task.
     * @param {*} uuid
     * @param {*} version
     */
    async getPersistentDataForTask(uuid, version) {
      const element = await this.getElement(uuid, version, "task");
      if (element.codeType.language === "elang") {
        const outputRegexp = /savevariable\( *"([^"]+)"/g;
        return [...element.code.matchAll(outputRegexp)].map((x) => x[1]);
      } else {
        return [];
      }
    },
    async getPersistentDataForExperiment(uuid, version) {
      const experiment = await this.getElement(uuid, version, "experiment");
      return this.getPersistentDataForExperimentInstance(experiment);
    },
    async getPersistentDataForExperimentInstance(instance) {
      const persistentElements = new Set();
      for (const element of instance.elements) {
        if (element.type === "task") {
          const codeData = await this.getPersistentDataForTask(
            element.data.uuid,
            element.data.version
          );
          const instanceData = element.data.persistent;
          instanceData.array.forEach((value) => {
            persistentElements.add(value);
          });
          codeData.array.forEach((value) => {
            persistentElements.add(value);
          });
        }
        if (element.type === "experiment") {
          this.getPersistentDataForExperimentInstance(element.data).forEach(
            (value) => {
              persistentElements.add(value);
            }
          );
        }
      }
      return Array.from(persistentElements);
    },
    async getPersistentDataForElement(uuid, version, type) {
      switch (type) {
        case "task":
          return await this.getPersistentDataForTask(uuid, version);
        case "experiment":
          return await this.getPersistentDataForExperiment(uuid, version);
      }
    },
    async updateAvailableOptions(type) {
      switch (type) {
        case "task":
          await this.updateAvailableTasks();
        case "project":
          await this.updateAvailableProjects();
        case "experiment":
          await this.updateAvailableExperiments();
      }
    },
    processAxiosError(err) {
      const errorStore = useErrorStore();
      errorStore.processAxiosError(err);
    },
    async getTagForVersion(type, uuid, version) {
      const currentElement = await this.getElement(uuid, version, type);
      return currentElement.tag;
    },
    async canExperimentBeRandomized(uuid, version) {
      const currentElement = await this.getElement(uuid, version, "experiment");
      for (const current of currentElement.elements) {
        // cannot be randomized if there are filters in the Experiment.
        if (current.type === "filter") {
          return false;
        }
      }
      return true;
    },
    reset() {
      this.availableTasks = [];
      this.availableExperiments = [];
      this.availableProjects = [];
      this.elements = { task: {}, project: {}, experiment: {} };
    },
    async getFilesForTask(uuid, version) {
      try {
        const response = await axios.get(
          "/task/" + uuid + "/" + version + "/filelist"
        );
        console.log(response?.data);
        return response.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    async addFileToTask(uuid, version, filename, file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
          "/task/" + uuid + "/" + version + "/resource/" + filename,
          formData
        );
        return response.data.version;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
        return null;
      }
    },
    async getResourceFile(uuid, version, filename) {
      try {
        const url = "/task/" + uuid + "/" + version + "/resource/" + filename;
        const response = await axios.get(url);
        console.log(response);
        return {
          url: url,
          data: response.data,
          type: response.headers["content-type"],
        };
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
        return null;
      }
    },
  },
});

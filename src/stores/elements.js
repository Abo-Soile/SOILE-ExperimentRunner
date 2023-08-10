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
    existingTasks: [],
    existingExperiments: [],
    existingProjects: [],
    codeOptions: [],
    elements: { task: {}, project: {}, experiment: {} },
  }),
  actions: {
    clearData() {
      this.availableTasks = [];
      this.availableExperiments = [];
      this.availableProjects = [];
      this.existingTasks = [];
      this.existingExperiments = [];
      this.existingProjects = [];
      this.codeOptions = [];
      this.elements = { task: {}, project: {}, experiment: {} };
    },
    /**
     * Update the Projects available to the current user (i,.e where they have access to)
     */
    async updateAvailableProjects(full) {
      try {
        const response = await axios.post(
          "/project/list" + (full ? "?full=true" : "")
        );
        console.log(response?.data);

        // update pinia state
        if (full) {
          this.existingProjects = response?.data;
        } else {
          this.availableProjects = response?.data;
        }
        console.log(this.availableProjects);
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Update the Experiments available to the current user (i,.e where they have access to)
     */
    async updateAvailableExperiments(full) {
      try {
        const response = await axios.post(
          "/experiment/list" + (full ? "?full=true" : "")
        );
        console.log(response?.data);

        // update pinia state
        if (full) {
          this.existingExperiments = response?.data;
        } else {
          this.availableExperiments = response?.data;
        }
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Update the Tasks available to the current user (i,.e where they have access to)
     */
    async updateAvailableTasks(full) {
      try {
        const response = await axios.post(
          "/task/list" + (full ? "?full=true" : "")
        );
        console.log(response?.data);

        // update pinia state
        if (full) {
          this.existingTasks = response?.data;
        } else {
          this.availableTasks = response?.data;
        }
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Update the Code Options available
     */
    async updateCodeOptions() {
      try {
        const response = await axios.get("/task/codeoptions");
        console.log(response?.data);

        // update pinia state
        this.codeOptions = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },

    /**
     * Get the available versions for a specific task
     * @param {string} UUID the UUID of the task
     */
    async getTaskOptions(UUID) {
      try {
        const response = await axios.post("/task/" + UUID + "/list");
        return response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Get the available versions for a specific project
     * @param {string} UUID the UUID of the project
     */
    async getProjectOptions(UUID) {
      try {
        const response = await axios.post("/project/" + UUID + "/list");
        return response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Get the available versions for a specific experiment
     * @param {string} UUID the UUID of the experiment
     */
    async getExperimentOptions(UUID) {
      try {
        const response = await axios.post("/experiment/" + UUID + "/list");
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
      const usedType = type.toLowerCase();
      switch (usedType) {
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
     * @param {string} UUID  the UUID of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     */
    async getOptionsForElement(UUID, type) {
      const usedType = type.toLowerCase();
      switch (usedType) {
        case "task":
          return await this.getTaskOptions(UUID);
        case "project":
          return await this.getProjectOptions(UUID);
        case "experiment":
          return await this.getExperimentOptions(UUID);
      }
    },
    /**
     * Get the list of tags for the specified items
     * @param {string} UUID  the UUID of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     */
    async getTagsForElement(UUID, type) {
      var options;
      const usedType = type.toLowerCase();
      switch (usedType) {
        case "task":
          options = await this.getTaskOptions(UUID);
          break;
        case "project":
          options = await this.getProjectOptions(UUID);
          break;
        case "experiment":
          options = await this.getExperimentOptions(UUID);
          break;
      }
      return options
        .filter((x) => x.tag)
        .map((x) => {
          return { tag: x.tag, version: x.version };
        });
    },
    /**
     * Remove tags for a given element.
     * @param {string} UUID  the UUID of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     * @param {array} tags the Tags to remove from the element.
     */
    async removeTagsForElement(UUID, type, tags) {
      const usedType = type.toLowerCase();
      try {
        const response = await axios.post(
          "/" + type.toLowerCase() + "/" + UUID + "/removetags",
          tags
        );
        return response.status == 200;
      } catch (err) {
        this.processAxiosError(err);
      }
    },

    /**
     * Remove tags for a given element.
     * @param {string} UUID  the UUID of the element
     * @param {string} type type of element ('task','experiment' or 'project' )
     * @param {String} tags the Tags to remove from the element.
     */
    async addTagForElement(UUID, version, type, tag) {
      try {
        const response = await axios.post(
          "/" + type.toLowerCase() + "/" + UUID + "/" + version + "/addtag",
          {
            name: tag,
          }
        );
        return response.status == 200;
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Get an element, either load (if not yet loaded) or take from memory.
     * @param {*} UUID the UUID of the object
     * @param {*} version  the version of the object
     * @param {*} type the type (element, task or project) of the object
     */
    async getElement(UUID, version, type) {
      const usedType = type.toLowerCase();
      try {
        const element = this.elements[usedType][UUID]
          ? this.elements[usedType][UUID][version]
          : undefined;
        if (element) {
          return element;
        } else {
          if (!this.elements[usedType][UUID]) {
            this.elements[usedType][UUID] = {};
          }
          const response = await axios.get(
            "/" + type.toLowerCase() + "/" + UUID + "/" + version + "/get"
          );
          this.elements[usedType][UUID][version] = response.data;
          if (!this.elements[usedType][UUID][version].tag) {
            const response = await axios.get(
              "/" + type.toLowerCase() + "/" + UUID + "/" + version + "/gettag"
            );
            this.elements[usedType][UUID][version].tag = response.data.tag;
          }
          return this.elements[usedType][UUID][version];
        }
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Write an element and return th new version.
     * @param {*} UUID the UUID of the object
     * @param {*} version  the version of the object this version is derived from.
     * @param {*} data the data of the elment (including version and UUID)
     * @param {*} type the type (element, task or project) of the object
     * @return The new Version of the element;
     */
    async updateElement(UUID, version, data, type) {
      try {
        const response = await axios.post(
          "/" + type.toLowerCase() + "/" + UUID + "/" + version + "/post",
          data
        );
        data.version = response.data.version;
        if (!this.elements[type.toLowerCase()][UUID]) {
          this.elements[type.toLowerCase()][UUID] = {};
        }
        this.elements[type.toLowerCase()][UUID][data.version] = data;
        return response.data.version;
      } catch (err) {
        this.processAxiosError(err);
      }
    },
    /**
     * Write an element and return th new version.
     * @param {*} UUID the UUID of the object
     * @param {*} version  the version of the object this version is derived from.
     * @param {*} data Only the codeType and code fields are required here.
     * @param {*} type the type (element, task or project) of the object
     * @return The new Version of the element;
     */
    async createElement(name, data, type) {
      try {
        let params;
        if (type.toLowerCase() === "task") {
          params = {
            name: name,
            codeType: data.codeType.language,
            codeVersion: data.codeType.version,
          };
        } else {
          params = { name: name };
        }
        const response = await axios.post(
          "/" + type.toLowerCase() + "/create",
          null,
          {
            params: params,
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
     * @param {*} UUID
     * @param {*} version
     */
    async getPersistentDataForTask(UUID, version) {
      const element = await this.getElement(UUID, version, "task");
      if (element.codeType.language === "elang") {
        const outputRegexp = /savevariable\( *"([^"]+)"/g;
        return [...element.code.matchAll(outputRegexp)].map((x) => x[1]);
      } else {
        return [];
      }
    },
    async getPersistentDataForExperiment(UUID, version) {
      const experiment = await this.getElement(UUID, version, "experiment");
      return this.getPersistentDataForExperimentInstance(experiment);
    },
    async getPersistentDataForExperimentInstance(instance) {
      const persistentElements = new Set();
      for (const element of instance.elements) {
        if (element.type === "task") {
          const codeData = await this.getPersistentDataForTask(
            element.data.UUID,
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
    async getPersistentDataForElement(UUID, version, type) {
      switch (type) {
        case "task":
          return await this.getPersistentDataForTask(UUID, version);
        case "experiment":
          return await this.getPersistentDataForExperiment(UUID, version);
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
    async getTagForVersion(type, UUID, version) {
      const currentElement = await this.getElement(UUID, version, type);
      return currentElement.tag;
    },
    async canExperimentBeRandomized(UUID, version) {
      const currentElement = await this.getElement(UUID, version, "experiment");
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
    /**
     * Get the list of Files for the task with the given UUID and version
     * @param {*} UUID
     * @param {*} version
     */
    async getFilesForTask(UUID, version) {
      try {
        const response = await axios.get(
          "/task/" + UUID + "/" + version + "/filelist"
        );
        return response.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    /**
     * Add a file to the given version of the given task.
     * @param {*} UUID
     * @param {*} version
     * @param {*} filename
     * @param {*} files the files to upload
     */
    async addFileToTask(UUID, version, filename, files) {
      try {
        const formData = new FormData();
        console.log(files);
        console.log(filename);
        for (const f of files) {
          console.log(f);
          formData.append("files", f.file, f.name);
        }
        const response = await axios.post(
          "/task/" + UUID + "/" + version + "/resource/" + filename,
          formData
        );

        return response.data.version;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
        return null;
      }
    },
    /**
     * Add a Multiple files to a task at a given version
     * @param {*} UUID
     * @param {*} version
     * @param {*} filename
     * @param {*} file
     */
    async addFilesToTask(UUID, version, folder, files) {
      if (files) {
        try {
          const formData = new FormData();
          formData.append("files", files);
          const response = await axios.post(
            "/task/" + UUID + "/" + version + "/resource/" + folder,
            formData
          );
          return response.data.version;
        } catch (e) {
          console.log("Error" + e);
          this.processAxiosError(e);
          return null;
        }
      }
    },

    /**
     * Remove the specified filename from the given task
     * @param {*} UUID
     * @param {*} version
     * @param {*} filename
     */
    async removeFileFromTask(UUID, version, filename) {
      try {
        const response = await axios.post(
          "/task/" +
            UUID +
            "/" +
            version +
            "/resource/" +
            filename +
            "?delete=true"
        );
        return response.data.version;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
        return null;
      }
    },
    /**
     * Get a Resource file for the given task represented by the file name
     * @param {*} UUID
     * @param {*} version
     * @param {*} filename
     */
    async getResourceFile(UUID, version, filename) {
      try {
        const url = "/task/" + UUID + "/" + version + "/resource/" + filename;
        const response = await axios.get(url);
        return {
          url: url,
          filename: filename,
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

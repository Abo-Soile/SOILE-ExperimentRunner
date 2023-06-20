import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "./errors";

export const useStudyStore = defineStore({
  id: "studies",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    currentEditedStudy: null,
    researchStudies: [],
    editableStudies: [],
  }),
  actions: {
    clearData() {
      this.currentEditedStudy = null;
      this.researchStudies = [];
      this.editableStudies = [];
    },
    async updateResearchStudies() {
      try {
        const response = await axios.post("/study/list?access=read");
        console.log(response?.data);
        // update pinia state
        this.researchStudies = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    async updateEditableStudies() {
      try {
        const response = await axios.post("/study/list?access=write");
        console.log(response?.data);
        // update pinia state
        this.editableStudies = response?.data;
      } catch (e) {
        console.log("Error" + e);
        this.processAxiosError(e);
      }
    },
    editingActive() {
      return this.currentEditedStudy != null;
    },
    /**
     *
     * @param {*} uuid the uuid of the project
     */
    async fetchProjectData(uuid) {
      try {
        const response = await axios.post("/study/" + uuid);
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
    /**
     * Generate a master token for the indicated project.
     * @param {} uuid
     */
    async generateMasterToken(uuid) {
      try {
        const response = await axios.post(
          "/study/" + uuid + "/createtokens?unique=true"
        );
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
    /***
     * Generate access tokens for the given project.
     */
    async generateTokens(uuid, count) {
      try {
        const response = await axios.post(
          "/study/" +
            uuid +
            "/createtokens?count=" +
            count +
            "&" +
            "unique=false"
        );
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
    /**
     * Get information about tokens for this project
     * @param {*} uuid
     */
    async getTokenInformation(uuid) {
      try {
        const response = await axios.post("/study/" + uuid + "/tokeninfo");
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
    /**
     * Get information about tokens for this project
     * @param {*} uuid
     */
    async getDownloadableData(uuid) {
      try {
        const response = await axios.post("/study/" + uuid + "/data/list");
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
      }
    },
    /**
     * Request a download, returns the downloadID to be used to re-query the back-end for
     * the download status
     * @param {*} uuid
     * @param {*} request
     */
    async requestDownload(uuid, request) {
      try {
        const response = await axios.post(`/study/${uuid}/data`, request);
        console.log(response.data);
        console.log(response);
        return response.data.downloadID;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },

    /**
     * RRequest the status of a download (i.e. whether it is ready and can be started available)
     * @param {*} studyID the ID of the study the dowwnload is associated with
     * @param {*} downloadID the download ID.
     */
    async requestDownloadStatus(studyID, downloadID) {
      try {
        const response = await axios.post(
          `/study/${studyID}/download/${downloadID}/check`
        );
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async downloadResults(studyID, downloadID) {
      /* const response = await axios.get(
        `/study/${studyID}/download/${downloadID}`,
        {
          responseType: "stream",
        }
      );
      const contentDispositionHeader = response.headers["content-disposition"];
      const filename = contentDispositionHeader
        ? contentDispositionHeader.split("filename=")[1]
        : "file.txt";
      console.log(response.headers);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }*/
      // This needs to use the session cookie for the download. Hopefully this works.
      const fileUrl = `${axios.defaults.baseURL}/study/${studyID}/download/${downloadID}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    /**
     * Activate the project with the given id
     * @param {*} uuid
     */
    async activate(uuid) {
      try {
        const response = await axios.post("/study/" + uuid + "/start");
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },

    /**
     * Activate the project with the given id
     * @param {*} uuid
     */
    async deactivate(uuid) {
      try {
        const response = await axios.post("/study/" + uuid + "/stop");
        return true;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },

    processAxiosError(err) {
      const errorStore = useErrorStore();
      errorStore.processAxiosError(err);
    },
    // create a new Study based on the given data.
    async createStudy(studyData) {
      try {
        const response = await axios.post(
          `/project/${studyData.sourceUUID}/${studyData.version}/init`,
          studyData
        );
        return response.data.projectID;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    /**
     * Select the currently edited Study.
     * @param {*} uuid
     */
    async selectCurrentStudy(uuid) {
      try {
        const response = await axios.post(`/study/${uuid}/get`);
        console.log(response.data);
        console.log(response);
        this.currentEditedStudy = response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async getCollaboratorsForStudy(uuid) {
      try {
        const response = await axios.post(`/study/${uuid}/collaborators`);
        console.log(response.data);
        console.log(response);
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
    async getAllStudies() {
      try {
        const response = await axios.post(`/study/list?full=true`);
        return response.data;
      } catch (error) {
        this.processAxiosError(error);
        return false;
      }
    },
  },
});

<template>
  <div
    class="flex flex-column h-screen align-content-center justify-content-center"
    v-if="loading"
  >
    <div class="flex justify-content-center">Loading...</div>
    <div class="flex">
      <ProgressSpinner />
    </div>
  </div>
  <CodeRunner
    v-else-if="isRunningTask"
    class="h-screen"
    :currentTaskSettings="taskInfo"
    :code="code"
    @handleUpload="
      (event) =>
        uploadFile(
          event.file,
          event.fileName,
          event.idCallBack,
          event.errorCallBack
        )
    "
    @submitResults="submitResults"
    @handleError="handleError"
  ></CodeRunner>
  <div v-else-if="running">
    Submitting data
    <ProgressSpinner />
  </div>
</template>

<script>
import axios from "axios";
import CodeRunner from "@/components/coderunner/CodeRunner.vue";

import { mapState } from "pinia";
import { useErrorStore, useProjectStore } from "@/stores";
//import { useProjectStore } from "@/stores/project";

import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

export default {
  name: "ExperimentView",
  components: {
    Button,
    CodeRunner,
    ProgressSpinner,
  },
  data() {
    return {
      code: undefined,
      persistentData: [],
      running: false,
    };
  },
  setup() {
    const projectStore = useProjectStore();
    const errorStore = useErrorStore();
    return { projectStore, errorStore };
  },
  methods: {
    /**
     * Set the task to active
     */
    setTaskActive() {
      console.log("Activating task");
      this.projectStore.setTaskActive();
    },
    /**
     * Retrieve all Data for the current task.
     * This is dependent on the current route and the current Task ID.
     */
    retrieveDataForTask() {
      // get the persistent data stored for the user for the study.
      axios
        .post("/study/" + this.$route.params.id + "/getpersistent")
        .then((persistentresponse) => {
          console.log(persistentresponse);
          this.persistentData = persistentresponse?.data;
          // and then retrieve the code to handle by the CodeRunner
          axios
            .get(
              "/run/" + this.$route.params.id + "/" + this.$route.params.taskID
            )
            .then((response) => {
              this.code = response?.data;
              this.loadNext();
            })
            .catch((error) => {
              this.projectStore.setTaskNotRunning();
              console.log(error);
              this.$router.push("/");
              this.errorStore.processAxiosError(error);
            });
        })
        .catch((error) => {
          this.projectStore.setTaskNotRunning();
          console.log(error);
          this.$router.push("/");
          this.errorStore.processAxiosError(error);
        });
    },
    /**
     * This function assumes, that results is an object with the following fields:
     * {
     *  outputData* : [ {name: "someName", value: 123 }],
     *  resultData* : [ {name: "someName", value: "xyz" or [], or {} or 123, timestamp : 12345}]
     *  fileData* : [{fileformat: "someMimeFormat", filename: "someName", targetid: "AnIDObtainedFromUploadData"}]
     * }
     * All fields are optional.
     * @param {*} results
     */
    async submitResults(results) {
      console.log(results);
      this.running = true;
      var TaskData = {};
      TaskData.taskID = this.projectStore.currentTaskSettings.id;
      TaskData.outputData = results.outputData ? results.outputData : [];
      TaskData.resultData = results.resultData
        ? results.resultData
        : { resultData: [], fileData: [] };
      // TODO: Potentially extract outputs from the jsonData of the results
      axios
        .post("/study/" + this.$route.params.id + "/submit", TaskData)
        .then(async (response) => {
          if (response.status == 200) {
            await this.projectStore.updateTaskSettings(this.$route.params.id);
            // start the next task.
            this.running = false;
            this.$router.push(
              "/exp/" +
                this.$route.params.id +
                "/" +
                this.projectStore.currentTaskSettings.id +
                "/"
            );
          } else {
            console.log(response);
            this.running = false;
            reportError(
              response.status,
              "Unexpected issue while submitting the results"
            );
          }
        })
        .catch((error) => {
          this.running = false;
          console.log(error);
        })
        .finally(() => {
          this.projectStore.setTaskNotRunning();
        });
    },

    loadNext() {
      this.projectStore.setTaskActive();
    },

    /**
     * Upload file data to the back-end
     * @param {*} file The file to upload
     * @param {*} fileName The name of the file
     * @param {*} idCallBack the callback that receives the ID of the call
     * @param {*} errorCallback the callback to call if any error happens.
     */
    uploadData(file, fileName, idCallBack, errorCallback) {
      var formData = new FormData();
      formData.append(fileName, file);
      axios
        .post("/study/" + this.$route.params.id + "/submit", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          idCallBack(response.data.id);
        })
        .catch((error) => {
          console.log(error);
          errorCallback(error);
        });
    },
    handleError(error) {
      this.errorStore.raiseError(
        "error",
        error + "\n Please contact the Study controller"
      );
    },
  },
  async beforeMount() {
    console.log("Receiving data for inital Task");
    this.retrieveDataForTask();
  },
  async beforeRouteUpdate(to, from, next) {
    console.log("Retrieving data for next Task");
    this.retrieveDataForTask();
    next();
  },
  computed: {
    ...mapState(useProjectStore, ["currentTaskSettings", "isRunningTask"]),
    taskInfo() {
      return {
        codeType: this.currentTaskSettings.codeType,
        outputs: this.currentTaskSettings.outputs, // this is only information on whether these outputs are indicated in the task.
        persistentData: { ...this.persistentData }, // this is data that needs to be submitted and changed.
        persistentFields: this.currentTaskSettings.persistent,
      };
    },
    loading() {
      return this.taskInfo.codeType == undefined;
    },
  },
  async mounted() {
    if (this.loading) {
      await this.projectStore.updateTaskSettings(this.$route.params.id);
    }
  },
};
</script>
<style scoped>
/*
This should cover the whole area. 
*/
.experimentview {
  width: 100vw;
  height: 100vh;
}
</style>

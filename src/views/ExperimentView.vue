<template>
  <div v-if="isRunningTask" class="h-screen">
    <CodeRunner
      class="h-full w-full"
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
  </div>
  <div v-else>
    <Button @click="setTaskActive">Start Next Task</Button>
  </div>
</template>

<script>
import axios from "axios";
import CodeRunner from "@/components/coderunner/CodeRunner.vue";
import { mapState } from "pinia";
import { useErrorStore } from "@/stores";
import { useProjectStore } from "@/stores/project";
import Button from "primevue/button";

export default {
  name: "ExperimentView",
  components: {
    Button,
    CodeRunner,
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
    runTask() {
      axios
        .post("/study/" + this.$route.params.id + "/getpersistent")
        .then((persistentresponse) => {
          console.log(persistentresponse);
          this.persistentData = persistentresponse?.data;
          axios
            .get(
              "/run/" + this.$route.params.id + "/" + this.$route.params.taskID
            )
            .then((response) => {
              this.code = response?.data;
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
            reportError(
              response.status,
              "Unexpected issue while submitting the results"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.projectStore.setTaskNotRunning();
        });
    },
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
      this.errorStore.raiseError(undefined, error);
    },
  },
  async beforeMount() {
    console.log("Before Mount");
    this.runTask();
  },
  async beforeRouteUpdate(to, from, next) {
    console.log("before route updated");
    this.runTask();
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
  },
  mounted() {
    console.log("ExpView Mounted");
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

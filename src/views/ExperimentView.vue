<template>
  <div v-if="isRunningTask">
    <SoileExpRunner
      class="experimentview"
      v-if="currentTaskSettings.codeType.language == 'elang'"
      :code="code"
      :outputs="currentTaskSettings.outputs"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="
        (event) =>
          uploadFile(
            event.file,
            event.fileName,
            event.idCallBack,
            event.errorCallBack
          )
      "
    >
    </SoileExpRunner>
    <PsychoJsRunner
      class="experimentview"
      v-if="currentTaskSettings.codeType.language == 'psychopy'"
      :code="code"
      :psychoJSVersion="currentTaskSettings.codeType.version"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="
        (event) =>
          uploadFile(
            event.file,
            event.fileName,
            event.idCallBack,
            event.errorCallBack
          )
      "
    >
    </PsychoJsRunner>
    <SoileQuestionnaire
      class="experimentview"
      v-if="currentTaskSettings.codeType.language == 'qmarkup'"
      :code="code"
      :outputs="currentTaskSettings.outputs"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
    ></SoileQuestionnaire>
    <!--<JsRunner v-if="type == 'javascript'"></JSRunner>-->
  </div>
  <div v-else>
    <Button @click="setTaskActive">Start Next Task</Button>
  </div>
</template>

<script>
import axios from "axios";
import SoileQuestionnaire from "../components/questionnaire/SoileQuestionnaire.vue";
import SoileExpRunner from "../components/experimentlang/SoileExpRunner.vue";
import PsychoJsRunner from "../components/psychopy/PsychoJsRunner.vue";
import { mapState } from "pinia";
import { useErrorStore } from "@/stores";
import { useUserStore } from "@/stores/users";
import Button from "primevue/button";

export default {
  name: "ExperimentView",
  components: { SoileQuestionnaire, SoileExpRunner, PsychoJsRunner, Button },
  data() {
    return {
      code: undefined,
      running: false,
    };
  },
  methods: {
    /**
     * Set the task to active
     */
    setTaskActive() {
      console.log("Activating task");
      const userStore = useUserStore();
      userStore.setTaskActive();
    },
    runTask() {
      const userStore = useUserStore();

      axios
        .get("/run/" + this.$route.params.id + "/" + this.$route.params.taskID)
        .then((response) => {
          this.code = response?.data;
        })
        .catch((error) => {
          userStore.setTaskNotRunning();
          console.log(error);
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
      const userStore = useUserStore();
      TaskData.taskID = userStore.currentTaskSettings.id;
      TaskData.outputData = results.outputData ? results.outputData : [];
      TaskData.resultData = results.resultData
        ? results.resultData
        : { resultData: [], fileData: [] };
      // TODO: Potentially extract outputs from the jsonData of the results
      axios
        .post("/study/" + this.$route.params.id + "/submit", TaskData)
        .then(async (response) => {
          if (response.status == 200) {
            await userStore.updateTaskSettings(this.$route.params.id);
            // start the next task.
            this.running = false;
            this.$router.push(
              "/exp/" +
                this.$route.params.id +
                "/" +
                userStore.currentTaskSettings.id +
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
          userStore.setTaskNotRunning();
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
      const errorStore = useErrorStore();
      errorStore.raiseError(undefined, error);
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
    ...mapState(useUserStore, ["currentTaskSettings", "isRunningTask"]),
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

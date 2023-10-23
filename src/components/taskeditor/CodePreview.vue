<template>
  <div v-if="canRun">
    <div class="h-screen" v-if="isRunningTask">
      <div>
        <Button @click="stopTask">Stop Task</Button>
      </div>
      <CodeRunner
        :currentTaskSettings="taskInfo"
        :code="code"
        @handleUpload="handleFileUpload"
        @submitResults="submitResults"
        @handleError="handleError"
      ></CodeRunner>
    </div>
    <div v-else>
      <Button @click="runTask">Start Task</Button>
    </div>
    <div class="results">
      <div v-if="Object.keys(outputData).length > 0" class="outputs">
        Outputs: <JsonViewer :value="outputData"></JsonViewer>
      </div>
      <div v-if="Object.keys(results).length > 0" class="results">
        Results: <JsonViewer :value="results"></JsonViewer>
      </div>
      <div v-if="Object.keys(persistent).length > 0" class="results">
        Persistent: <JsonViewer :value="persistent"></JsonViewer>
      </div>
      <div v-if="uploadedFiles.length > 0" class="uploadedFiles">
        Uploaded Files: <JsonViewer :value="uploadedFiles"></JsonViewer>
      </div>
    </div>
  </div>
  <div v-else>You must save the task before you can run it.</div>
</template>

<script>
import SoileQuestionnaire from "@/components/questionnaire/SoileQuestionnaire.vue";
import SoileExpRunner from "@/components/experimentlang/SoileExpRunner.vue";
import PsychoJsRunner from "@/components/psychopy/PsychoJsRunner.vue";
import JsRunner from "@/components/jsrunner/JsRunner.vue";
import { useErrorStore } from "@/stores";
import CodeRunner from "@/components/coderunner/CodeRunner.vue";
import { mapState } from "pinia";
import axios from "axios";
import Button from "primevue/button";
import JsonViewer from "vue-json-viewer";

export default {
  name: "CodePreview",
  components: {
    SoileQuestionnaire,
    SoileExpRunner,
    PsychoJsRunner,
    Button,
    JsRunner,
    JsonViewer,
    CodeRunner,
  },
  props: {
    sourceCode: {
      type: String,
      required: true,
    },
    codeType: {
      type: String,
      required: true,
    },
    codeTypeVersion: {
      type: String,
      required: true,
    },
    canRun: {
      type: Boolean,
      required: true,
    },
    outputs: {
      type: Array,
      default: [],
    },
    inputData: {
      type: Array,
      default: [],
    },
    persistentFields: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const errorStore = useErrorStore();
    return { errorStore };
  },
  data() {
    return {
      currentTaskSettings: { outputs: [], persistentData: {} },
      code: undefined,
      running: false,
      isRunningTask: false,
      results: {},
      persistent: {},
      outputData: {},
      uploadedFiles: [],
    };
  },
  computed: {
    taskInfo() {
      const persistentData = {};
      this.inputData.forEach((x) => (persistentData[x.name] = x.value));
      return {
        codeType: {
          language: this.codeType,
          version: this.codeTypeVersion,
        },
        outputs: this.outputs, // this is only information on whether these outputs are indicated in the task.
        persistentData, // this is data that needs to be submitted and changed.
        persistentFields: this.persistentFields,
      };
    },
  },
  methods: {
    /**
     * Set the task to active
     */
    runTask() {
      this.outputData = [];
      this.uploadedFiles = [];
      this.results = {};
      this.compileTask()
        .then(() => {
          this.isRunningTask = true;
        })
        .catch((err) => {
          if (err.response?.data) {
            this.errorStore.raiseError("error", err.response.data);
          } else {
            this.errorStore.raiseError("error", err.message);
          }
        });
    },
    stopTask() {
      this.isRunningTask = false;
    },
    async compileTask() {
      const response = await axios.post("/task/compile/", {
        code: this.sourceCode,
        type: this.codeType,
      });
      this.code = response?.data;
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

      this.persistent = results.persistentData ? results.persistentData : [];
      this.outputData = results.outputData ? results.outputData : [];
      this.results = results.resultData
        ? results.resultData
        : { resultData: [], fileData: [] };
      // Also, turn of the preview.
      this.isRunningTask = false;
    },
    handleFileUpload(event) {
      // we ignore what exactly it is ad just give back a temporary id;
      event.idCallBack("temporary");
      this.uploadedFiles.push(event.filename);
    },
    handleError(error) {
      this.errorStore.raiseError("error", error);
    },
  },
  mounted() {
    console.log("ExpView Mounted");
  },
};
</script>
<style scoped>
.taskPreview {
  width: 100%;
  height: 100%;
}
</style>

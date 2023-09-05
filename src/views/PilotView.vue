<template>
  <Button v-if="!started" :diabled="study" @click="start"
    >Start Study Pilot</Button
  >
  <div v-if="started">
    <Button
      v-if="loading"
      @click="
        start();
        loading = false;
      "
    >
      Start next task
    </Button>
    <CodeRunner
      v-else
      class="h-screen w-full"
      :currentTaskSettings="taskInfo"
      :code="code"
      @handleUpload="handleFileUpload"
      @submitResults="submitResults"
      @handleError="handleError"
    ></CodeRunner>
  </div>
  <JsonViewer v-if="finished" :value="results"></JsonViewer>
</template>

<script>
import CodeRunner from "@/components/coderunner/CodeRunner.vue";
import { useElementStore, useStudyStore } from "@/stores";
import axios from "axios";
import JsonViewer from "vue-json-viewer";
import Button from "primevue/button";
import { storeToRefs } from "pinia";

export default {
  name: "PilotView",
  components: { CodeRunner, JsonViewer, Button },
  data() {
    return {
      study: null,
      persistentData: {},
      outputData: {},
      codeType: null,
      codeTypeVersion: null,
      sourceCode: null,
      code: null,
      currentProject: null,
      currentElement: null,
      elements: {},
      currentElementID: null,
      started: false,
      finished: false,
      loading: false,
      results: [],
    };
  },
  computed: {
    taskInfo() {
      console.log("Calculating raskInfo");
      return {
        codeType: {
          language: this.codeType,
          version: this.codeTypeVersion,
        },
        outputs: this.currentElement.outputs, // this is only information on whether these outputs are indicated in the task.
        persistent: this.currentElement.persistent
          ? this.currentElement.persistent
          : [],
        persistentData: this.persistentData, // this is data that needs to be submitted and changed.
      };
    },
  },
  methods: {
    async compileTask() {
      const response = await axios.post("/task/compile/", {
        code: this.sourceCode,
        type: this.codeType,
      });
      this.code = response?.data;
    },
    async getNext(start) {
      console.log(this.currentElementID);
      const nextElementID = this.elements[this.currentElementID].next;

      if (nextElementID != null && nextElementID != "end") {
        var nextElement = start
          ? this.elements[this.currentElementID]
          : this.elements[nextElementID];
        while (nextElement != null && nextElement.elementType != "task") {
          console.log("Trying to determine the next element");
          console.log(nextElement);
          console.log(nextElement.elementType);
          console.log(nextElement.instanceID);
          if (nextElement.elementType === "filter") {
            nextElement = await this.getFilterNext(nextElement);
          }
          if (nextElement.elementType === "experiment") {
            nextElement = this.getExperimentNext(nextElement);
          }
        }
        // now, we have a task, so lets updae the data for it.
        const taskData = await this.elementStore.getElement(
          nextElement.UUID,
          nextElement.version,
          "task"
        );
        console.log(taskData);
        this.codeType = taskData.codeType.language;
        this.codeTypeVersion = taskData.codeType.version;
        this.sourceCode = taskData.code;
        this.currentElementID = nextElement.instanceID;
        await this.compileTask();
        console.log(nextElement);
        this.currentElement = nextElement;
      } else {
        this.currentElement = null;
      }
    },

    async getFilterNext(filter) {
      for (const option of filter.options) {
        const response = await axios.post("/project/testfilter", {
          filter: option.filter,
          parameters: this.outputData,
        });
        if (response.data.valid) {
          if (response.data.value > 0) {
            return this.elements[option.next];
          }
        }
      }
      return this.elements[filter.defaultOption];
    },

    getExperimentNext(experiment) {
      console.log(experiment);
      console.log(this.elements[experiment.elements[0].data.instanceID]);
      if (experiment.randomize) {
        if (!experiment.done) {
          experiment.done = [];
        }
        const available = experiment.elements.filter(
          (x) => !experiment.done.includes(x.instanceID)
        ).length;
        if (available > 0) {
          const nextPos = Math.floor(Math.random() * available);
          experiment.done.push(experiment.elements[nextPos].data.instanceID);
          return this.elements[experiment.elements[nextPos].data.instanceID];
        } else {
          return this.elements[experiment.next];
        }
      } else {
        if (experiment.started) {
          return this.elements[experiment.next];
        }
        experiment.started = true;
        return this.elements[experiment.elements[0].data.instanceID];
      }
    },
    handleFileUpload(event) {
      // we ignore what exactly it is ad just give back a temporary id;
      event.idCallBack("temporary");
    },
    async submitResults(results) {
      this.loading = true;
      const currentInstanceID = this.currentElement.instanceID;
      const resultData = results.resultData
        ? results.resultData
        : { resultData: [], fileData: [] };
      this.results.push({
        task: currentInstanceID,
        step: this.results.length + 1,
        resultData,
      });
      results.persistentData.forEach(
        (x) => (this.persistent[x.name] = x.value)
      );

      this.persistent = results.persistentData ? results.persistentData : [];
      results.outputData.forEach(
        (x) => (this.outputData[currentInstanceID + "." + x.name] = x.value)
      );
      await this.getNext();
    },
    handleError(error) {
      this.errorStore.raiseError(undefined, error);
    },

    /**
     * Parse a study such that we can run it.
     */
    async parseStudy() {
      this.currentProject = await this.elementStore.getElement(
        this.currentEditedStudy.sourceUUID,
        this.currentEditedStudy.version,
        "project"
      );
      // this needs to be a deep copy, since we are altering the contents
      this.currentProject = JSON.parse(JSON.stringify(this.currentProject));
      for (const task of this.currentProject.tasks) {
        task.elementType = "task";
        this.elements[task.instanceID] = task;
      }
      for (const experiment of this.currentProject.experiments) {
        this.parseExperiment(experiment);
      }
      for (const filter of this.currentProject.filters) {
        filter.elementType = "filter";
        this.elements[filter.instanceID] = filter;
      }
      this.currentElementID = this.currentProject.start;
      await this.getNext(true);
    },
    parseExperiment(experiment) {
      for (const element of experiment.elements) {
        console.log(element);
        if (element.elementType === "experiment") {
          this.parseExperiment(element.data);
        } else {
          this.elements[element.data.instanceID] = element.data;
          this.elements[element.data.instanceID].elementType =
            element.elementType;
        }
      }
      experiment.elementType = "experiment";
      this.elements[experiment.instanceID] = experiment;
    },
    start() {
      this.$router.push(
        "/pilot/" +
          this.currentElement.UUID +
          "/" +
          this.currentElement.version +
          "/"
      );
      this.started = true;
    },
    reset() {
      this.results = [];
      this.elements = {};
      this.started = false;
      this.finished = false;
      this.persistentData = {};
    },
  },
  async mounted() {
    this.reset();
    this.parseStudy();
  },
  setup() {
    const elementStore = useElementStore();
    const studyStore = useStudyStore();
    const { currentEditedStudy } = storeToRefs(studyStore);
    return { elementStore, currentEditedStudy };
  },
};
</script>

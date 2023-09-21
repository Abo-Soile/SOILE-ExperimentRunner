<template>
  <Button v-if="!started" :diabled="study" @click="start"
    >Start Study Pilot</Button
  >
  <div v-if="started && !finished">
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
  <div v-if="finished">
    <h3>Results</h3>
    <JsonViewer :value="results"></JsonViewer>
    <div v-if="outputData.length > 0">
      <h3>OUtputs</h3>
      <JsonViewer :value="outputData"></JsonViewer>
    </div>
    <div v-if="persistentData.length > 0">
      <h3>Persistent Data</h3>
      <JsonViewer :value="persistentData"></JsonViewer>
    </div>

    <div v-if="randomAssignments.length > 0">
      <h3>Random Assigments</h3>
      <JsonViewer :value="randomAssignments"></JsonViewer>
    </div>
  </div>
</template>

<script>
/**
 * This view is a bit more cmoplex, as it essentially resembles the back-ends handling of the
 * walk through process of a participant.
 */
import CodeRunner from "@/components/coderunner/CodeRunner.vue";
import { useElementStore, usePilotStore } from "@/stores";
import axios from "axios";
import JsonViewer from "vue-json-viewer";
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import { nextTick } from "vue";

export default {
  name: "PilotView",
  components: { CodeRunner, JsonViewer, Button },
  data() {
    return {
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
      randomAssignments: [],
      randomization: {},
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
    /**
     * Get the next element in the project.
     * @param {*} start
     */
    async getNext(start) {
      // take next element if there is one.
      const nextElementID = this.elements[this.currentElementID].next;
      // except for the start element, we should always be in a Task when coming here.
      var nextElement = start
        ? this.elements[this.currentElementID]
        : this.elements[nextElementID];
      // if we end, this is done and if we get null, we stop as well.
      if (nextElement != null) {
        // if this is a call from the start, our next element is the current element.

        while (nextElement != null && nextElement.elementType != "task") {
          console.log("Current element is");
          console.log(nextElement);
          // obtain the next element of the filter and check whether thats a task
          if (nextElement.elementType === "filter") {
            nextElement = await this.getFilterNext(nextElement);
          }
          if (nextElement.elementType === "experiment") {
            nextElement = this.getExperimentNext(nextElement);
          }
          if (nextElement.elementType === "randomizer") {
            console.log("Found randomizer");
            nextElement = this.getRandomizerNext(nextElement);
          }
        }
        if (nextElement != null) {
          // now, we have a task, so lets updae the data for it.
          const taskData = await this.elementStore.getElement(
            nextElement.UUID,
            nextElement.version,
            "task"
          );
          // update the settings of the task.
          this.codeType = taskData.codeType.language;
          this.codeTypeVersion = taskData.codeType.version;
          this.sourceCode = taskData.code;
          this.currentElementID = nextElement.instanceID;
          // compile it to obtain the compiled code.
          await this.compileTask();
          console.log(nextElement);
          this.currentElement = nextElement;
        } else {
          this.currentElement = null;
          this.finished = true;
        }
      } else {
        this.currentElement = null;
        this.finished = true;
      }
      if (this.currentElement != null) {
        this.$router.push(
          "/pilot/" +
            this.currentElement.UUID +
            "/" +
            this.currentElement.version +
            "/"
        );
      } else {
        this.$router.push("/pilot/");
      }
    },
    /**
     * Get the next element based on the given filter node.
     * @param {*} filter
     */
    async getFilterNext(filter) {
      for (const option of filter.options) {
        // use the test filter endpoint to check the result of the filter.
        const response = await axios.post("/project/testfilter", {
          filter: option.filter,
          parameters: this.outputData, // the output data that we have obtained till now.
        });
        // if the option is valid, return it.
        if (response.data.valid) {
          if (response.data.value > 0) {
            return this.elements[option.next];
          }
        }
      }
      return this.elements[filter.defaultOption];
    },
    /**
     * Get the next element based on the given randomizer node.
     * @param {*} randomizer
     */
    getRandomizerNext(randomizer) {
      var assignOnce = undefined;
      for (const setting of randomizer.settings) {
        if (setting.name === "assignOnce") {
          assignOnce = setting.value;
        }
      }
      if (
        (this.randomization[randomizer.instanceID] && assignOnce) ||
        randomizer.type === "block"
      ) {
        return this.elements[this.randomization[randomizer.instanceID]];
      } else {
        console.log("Assigning random variable");
        const index = Math.floor(Math.random() * randomizer.options.length);
        this.randomAssignments.push({
          randomizer: randomizer.instanceID,
          assignment: randomizer.options[index].name,
        });
        this.randomization[randomizer.instanceID] =
          randomizer.options[index].next;
        return this.elements[this.randomization[randomizer.instanceID]];
      }
    },
    /**
     * Get the next element from an experiment.
     * @param {*} experiment
     */
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
    /**
     * Handle a file upload. We could also store the actual uploaded file here, but I don't think that's necessary
     * @param {*} event
     */
    handleFileUpload(event) {
      // we ignore what exactly it is ad just give back a temporary id;
      event.idCallBack("temporary");
    },
    /**
     * Submit results. This finishes a task, changes to the loading view and performs updates.
     * Since everything is local, I assume this to be fast enough so that the user pressing the button
     * is late enough for everything to be done. But maybe we will need to disable the button till it hasupdated...
     * @param {*} results
     */
    async submitResults(results) {
      this.loading = true;
      const currentInstanceID = this.currentElement.instanceID;
      // update the rsult data for this task.
      const resultData = results.resultData
        ? results.resultData
        : { resultData: [], fileData: [] };
      this.results.push({
        task: currentInstanceID,
        step: this.results.length + 1,
        resultData,
      });
      // update the persistent data.
      results.persistentData.forEach(
        (x) => (this.persistentData[x.name] = x.value)
      );
      // update the output data.
      results.outputData.forEach(
        (x) => (this.outputData[currentInstanceID + "." + x.name] = x.value)
      );
      await this.getNext();
      // and switch to the next route
    },
    /**
     * Handle errors, mainly a referral to the error store.
     * @param {*} error
     */
    handleError(error) {
      this.errorStore.raiseError(undefined, error);
    },

    /**
     * Parse a study such that we can run it.
     */
    async parseElement() {
      const elementType = this.isExperiment ? "experiment" : "project";
      // get the project run by the study.

      // this needs to be a deep copy, since we are altering the contents
      const copy = JSON.parse(JSON.stringify(this.pilotedElement));
      if (this.isExperiment) {
        this.parseExperiment(copy, true);
      } else {
        // add all tasks
        for (const task of copy.tasks) {
          task.elementType = "task";
          this.elements[task.instanceID] = task;
        }
        // and everything from experiments
        for (const experiment of copy.experiments) {
          this.parseExperiment(experiment);
        }
        // add filters
        for (const filter of copy.filters) {
          filter.elementType = "filter";
          this.elements[filter.instanceID] = filter;
        }

        for (const filter of copy.randomizers) {
          filter.elementType = "randomizer";
          this.elements[filter.instanceID] = filter;
        }
        console.log("Study parsed. Requesting next element.");
        this.currentElementID = copy.start;
      }
      await this.getNext(true);
    },
    /**
     * Parse an experiment object from a Project.
     * @param {*} experiment
     */
    parseExperiment(experiment, isBase) {
      for (const element of experiment.elements) {
        console.log(element);
        if (element.elementType === "experiment") {
          this.parseExperiment(element.data);
        } else {
          this.elements[element.data.instanceID] = element.data;
          this.elements[element.data.instanceID].elementType =
            element.elementType;
        }
        if (experiment.randomize) {
          // we need to call back to the experiment.
          element.next = experiment.instanceID;
        }
      }
      if (!isBase) {
        experiment.elementType = "experiment";
        this.elements[experiment.instanceID] = experiment;
      } else {
        this.currentElementID = experiment.elements[0].data.instanceID;
      }
    },
    /**
     * Start, i.e. run the task by adding uuid and version to the path so that files can be loaded
     */
    async start() {
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
    await this.parseElement();
  },
  setup() {
    const elementStore = useElementStore();
    const pilotStore = usePilotStore();
    const { pilotedElement, isExperiment } = storeToRefs(pilotStore);
    return { elementStore, pilotedElement, isExperiment };
  },
};
</script>

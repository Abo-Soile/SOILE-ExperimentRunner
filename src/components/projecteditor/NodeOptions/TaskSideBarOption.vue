<template>
  <div>
    <div class="grid mb-2">
      <ObjectAndVersionSelectorWithProps
        elementTitle="Task"
        objectType="task"
        v-model:element="currentTask"
        v-model:version="currentVersion"
        elementLabel="name"
        versionLabel="tag"
        dropDownClasses="baklava-dropdown"
      >
      </ObjectAndVersionSelectorWithProps>
    </div>
    <TaskPropertySelection
      :existingValues="currentOutputs"
      :possibleValues="outputOptions"
      :selectionType="outSelectionType"
      elementDescription="Output"
      @removeElement="removeOutput"
      @addElement="createOutput"
    ></TaskPropertySelection>
    <TaskPropertySelection
      :existingValues="currentPersistent"
      :possibleValues="persistentOptions"
      :selectionType="outSelectionType"
      elementDescription="Persistent"
      @removeElement="removePersistent"
      @addElement="createPersistent"
    ></TaskPropertySelection>
    <div>
      <Button
        class="baklava-button mt-2"
        :disabled="isInValid"
        @click="editTask()"
        label="Edit Task"
      >
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "primevue/button";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import TaskNode from "../NodeTypes/TaskNode";
import {
  useGraphStore,
  useEditorStore,
  useElementStore,
  useErrorStore,
} from "@/stores";
import ObjectAndVersionSelectorWithProps from "@/components/utils/ObjectAndVersionSelectorWithProps.vue";
import TaskPropertySelection from "./elements/TaskPropertySelection.vue";

export default defineComponent({
  components: {
    ObjectAndVersionSelectorWithProps,
    Button,
    TaskPropertySelection,
  },
  props: {
    intf: {
      type: Object as () => ComponentInterface<TaskNode>,
      required: true,
    },
  },
  data() {
    return {
      nodeID: "",
      objectType: "task",
      taskVersions: [],
    };
  },
  setup() {
    const elementStore = useElementStore();
    const graphStore = useGraphStore();
    const errorStore = useErrorStore();
    const editorStore = useEditorStore();
    return { elementStore, errorStore, graphStore, editorStore };
  },
  methods: {
    createOutput(newOutput: string) {
      console.log("Adding output");
      if (this.graphStore.canAddTaskOutput(this.currentNode, newOutput)) {
        console.log("Yes ");
        this.currentNode.addElementOutput(newOutput);
      } else {
        this.errorStore.raiseError(
          "warn",
          "The output is already defined for this Node"
        );
      }
    },
    createPersistent(newPersistent: string) {
      this.currentNode.addPersistent(newPersistent);
    },
    removeOutput(output: string) {
      console.log("removing output: " + output);
      this.currentNode.removeElementOutput(output);
    },
    removePersistent(persistent: string) {
      console.log("removing Persistent: " + persistent);
      this.currentNode.removeElementPersistent(persistent);
    },
    editTask() {
      this.editorStore.loadElement(
        this.objectType,
        this.currentTask.name,
        this.currentTask.UUID,
        this.currentVersion.version
      );
    },
  },
  computed: {
    isInValid() {
      return (
        this.currentTask.UUID == null || this.currentVersion.version == null
      );
    },
    outputOptions() {
      return this.currentNode.outputOptions.filter(
        (x: string) => !this.currentOutputs.includes(x)
      );
    },
    persistentOptions() {
      return this.currentNode.persisitentOptions.filter(
        (x: string) => !this.currentPersistent.includes(x)
      );
    },
    outSelectionType() {
      return this.currentNode.outputOptionType;
    },
    currentNode(): TaskNode {
      return this.intf.data;
    },
    currentOutputs() {
      console.log(this.intf);
      return this.intf.data.nodeOutputs;
    },
    currentPersistent() {
      console.log(this.intf);
      return this.intf.data.nodePersistent;
    },
    currentTask: {
      get() {
        return {
          UUID: this.intf.data.objectData.UUID,
          name: this.intf.data.objectData.name,
        };
      },
      async set(newValue) {
        if (newValue.UUID) {
          this.currentNode.setElement(newValue.UUID, newValue.name);
          console.log({
            text: this.intf.data.objectData.name,
            value: this.intf.data.objectData.UUID,
          });
        }
      },
    },
    currentVersion: {
      get() {
        return {
          tag: this.intf.data.objectData.tag,
          version: this.intf.data.objectData.version,
        };
      },
      /**
       *
       * @param {{text: string, value: string}} newValue The value is a tag + version (value is the version, text is the tag.)
       */
      set(newValue: { tag: string; version: string }) {
        if (newValue) {
          this.currentNode.setElementVersion(newValue.version, newValue.tag);
        }
      },
    },
  },
  watch: {},
  async mounted() {
    this.nodeID = this.intf.id;
    this.currentTask = this.intf.data.objectData;
  },
});
</script>
<style scoped>
.baklava-input {
  width: 50%;
}
</style>

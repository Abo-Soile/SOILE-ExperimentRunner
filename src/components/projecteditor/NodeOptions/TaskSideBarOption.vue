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
    <div class="grid border-white border-solid border-1 border-round-sm mb-2">
      <div class="col-12">Add Output</div>
      <div class="col-12">Variable Name:</div>
      <div
        class="col-6"
        v-tooltip="{
          value: `Create an output that can be used as in a Filter. <b>Note</b>: The Task must produce this output`,
          escape: true,
        }"
      >
        <input
          class="baklava-input w-full"
          type="text"
          v-model="newOutput"
          name="addOutput"
        />
      </div>

      <div class="col-6">
        <button class="baklava-button" @click="createOutput()">
          Add output
        </button>
      </div>
      <div class="col-12">
        Existing Outputs:
        <ul>
          <li v-for="output in currentOutputs">
            <div class="flex align-items-center justify-content-between">
              {{ output }}
              <button class="baklava-button" @click="removeOutput(output)">
                Remove output
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="grid border-white border-solid border-1 border-round-sm mt-2">
      <div class="col-12">Add Persistent Data</div>
      <div class="col-12">Variable Name:</div>
      <div class="col-6">
        <input
          class="baklava-input w-full"
          type="text"
          v-model="newPersistent"
          name="addPersistent"
        />
      </div>
      <div class="col-6">
        <button class="baklava-button" @click="createPersistent()">
          Add Persistent
        </button>
      </div>
      <div class="col-12">
        Existing Persistent Values:
        <ul>
          <li v-for="persistent in currentPersistent">
            <div class="flex align-items-center justify-content-between">
              {{ persistent }}
              <button
                class="baklava-button"
                :name="persistent"
                @click="removePersistent(persistent)"
              >
                Remove Persistent
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
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

export default defineComponent({
  components: { ObjectAndVersionSelectorWithProps, Button },
  props: {
    intf: {
      type: Object as () => ComponentInterface<TaskNode>,
      required: true,
    },
  },
  data() {
    return {
      nodeID: "",
      newOutput: "",
      newPersistent: "",
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
    createOutput() {
      if (this.newOutput) {
        2;
        console.log("Adding output");
        if (
          this.graphStore.canAddTaskOutput(this.currentNode, this.newOutput)
        ) {
          console.log("Yes ");
          this.currentNode.addElementOutput(this.newOutput);
        } else {
          console.log("No ");
          this.errorStore.raiseError(
            "warn",
            "The output is already defined for this Node"
          );
        }
      }
      this.newOutput = "";
    },
    createPersistent() {
      if (this.newPersistent) {
        console.log("Adding Persistent");
        console.log("Yes ");
        this.currentNode.addPersistent(this.newPersistent);
      }
      this.newPersistent = "";
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

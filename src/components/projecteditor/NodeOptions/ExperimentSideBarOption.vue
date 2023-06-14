<template>
  <div>
    <ObjectAndVersionSelectorWithProps
      :objectType="objectType"
      v-model:element="currentTask"
      v-model:version="currentVersion"
      elementLabel="name"
      versionLabel="tag"
    >
    </ObjectAndVersionSelectorWithProps>
    <div class="flex align-items-center">
      <label for="random" class="ml-2"> Randomize </label>
      <Checkbox
        class="baklava-checkbox"
        :disabled="!currentNode.canRandom"
        v-model="isRandom"
        :binary="true"
        name="random"
      />
    </div>
    <div>
      <Button
        class="baklava-button"
        :disabled="isInValid"
        @click="editExperiment()"
        label="Edit Experiment"
      >
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import {
  useGraphStore,
  useElementStore,
  useEditorStore,
  useErrorStore,
} from "@/stores";
import ObjectAndVersionSelectorWithProps from "@/components/utils/ObjectAndVersionSelectorWithProps.vue";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import ExperimentNode from "../NodeTypes/ExperimentNode";
export default defineComponent({
  components: { Button, Checkbox, ObjectAndVersionSelectorWithProps },
  props: {
    intf: {
      type: Object as () => ComponentInterface<ExperimentNode>,
      required: true,
    },
  },
  data() {
    return {
      nodeID: "",
      newOutput: "",
      newPersistent: "",
      objectType: "experiment",
    };
  },
  setup() {
    const editorStore = useEditorStore();
    return { editorStore };
  },
  methods: {
    async setTask(selected) {
      console.log("Setting Exeriment");
      this.currentTask = selected;
    },
    async setTaskVersion(selected) {
      this.currentVersion = selected;
    },
    editExperiment() {
      this.editorStore.loadElement(
        this.objectType,
        this.currentTask.name,
        this.currentTask.uuid,
        this.currentVersion.version
      );
    },
  },
  computed: {
    isInValid() {
      return (
        this.currentTask.uuid == null || this.currentVersion.version == null
      );
    },
    currentNode(): ExperimentNode {
      return this.intf.data;
    },
    currentTask: {
      get() {
        return {
          uuid: this.intf.data.objectData.uuid,
          name: this.intf.data.objectData.name,
        };
      },
      async set(newValue) {
        if (newValue.uuid) {
          this.currentNode.setElement(newValue.uuid, newValue.name);
          console.log({
            text: this.intf.data.objectData.name,
            value: this.intf.data.objectData.uuid,
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
    isRandom: {
      get() {
        return this.intf.data.random;
      },
      async set(newValue: boolean) {
        this.intf.data.random = newValue;
      },
    },
    canRandom() {
      return this.intf.data.canRandom;
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

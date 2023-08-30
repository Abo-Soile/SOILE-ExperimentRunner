<template>
  <div>
    <ObjectAndVersionSelectorWithProps
      elementTitle="Experiment"
      :objectType="objectType"
      v-model:element="currentExperiment"
      v-model:version="currentVersion"
      elementLabel="name"
      versionLabel="tag"
    >
    </ObjectAndVersionSelectorWithProps>
    <div
      class="grid border-white border-solid border-1 border-round-sm mt-2 mb-2"
    >
      <div class="col-12 flex align-items-center justify-content-between">
        <div>{{ "Randomize" }}</div>
        <Checkbox
          :disabled="!currentNode.canRandom"
          v-model="isRandom"
          :binary="true"
          name="random"
        />
      </div>
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
    editExperiment() {
      this.editorStore.loadElement(
        this.objectType,
        this.currentExperiment.name,
        this.currentExperiment.UUID,
        this.currentVersion.version
      );
    },
  },
  computed: {
    isInValid() {
      return (
        this.currentExperiment.UUID == null ||
        this.currentVersion.version == null
      );
    },
    currentNode(): ExperimentNode {
      return this.intf.data;
    },
    currentExperiment: {
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
    this.currentExperiment = this.intf.data.objectData;
  },
});
</script>
<style scoped>
.baklava-input {
  width: 50%;
}
</style>

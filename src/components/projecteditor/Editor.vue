<template>
  <div style="height: 100%" class="editor" @oncontextmenu="parseEvent()">
    <hint-overlay></hint-overlay>
    <baklava-editor :view-model="baklava">
      <template #node="nodeProps">
        <SoileNode v-if="isSoileNode(nodeProps.node.type)" v-bind="nodeProps" />
        <BaklavaNode v-else v-bind="nodeProps" />
      </template>
      <template #toolbar="toolbarProps">
        <div class="baklava-toolbar">
          <button class="baklava-button" @click="saveProject()">
            <i class="pi pi-save" />
          </button>
          <button class="baklava-button" @click="editSettings = true">
            <i class="pi pi-cog" />
          </button>
        </div>
      </template>
    </baklava-editor>
  </div>
  <ElementSettings
    v-model:visible="editSettings"
    :newElement="newElement"
    :initialValues="objectOptions"
    @submit="updateOptions"
  />
  <ElementSaveDialog
    v-model:visible="showSave"
    :name="name"
    :currentTags="currentTags"
    @submit="saveElement"
  />
</template>

<script>
import { EditorComponent, Components } from "@baklavajs/renderer-vue";
import { DependencyEngine } from "@baklavajs/engine";
import "@baklavajs/themes/dist/syrup-dark.css";

import TaskNode from "./NodeTypes/TaskNode";
import FilterNode from "./NodeTypes/FilterNode";
import ExperimentNode from "./NodeTypes/ExperimentNode";
import SoileNode from "./ViewComponents/SoileVueNode.vue";
import HintOverlay from "./HintOverlay.vue";
import ElementSettings from "@/components/utils/ElementSettings.vue";
import ElementSaveDialog from "@/components/utils/ElementSaveDialog.vue";

import {
  BaklavaToSoileProjectJSON,
  BaklavaToSoileExperimentJSON,
  loadSoileProjectToBaklava,
  loadSoileExperimentToBaklava,
} from "@/helpers/projecteditor/baklavasoileConverter";
import { checkConnection } from "./events/graphEvents.ts";
import { useGraphStore, useElementStore, useErrorStore } from "@/stores";

import { reactive } from "vue";

const BaklavaNode = Components.Node;

export default {
  components: {
    "baklava-editor": EditorComponent,
    ElementSaveDialog,
    BaklavaNode,
    SoileNode,
    ElementSettings,
    HintOverlay,
  },
  emits: ["updateName", "updateElement", "createElement"],
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    data: {
      type: Object,
    },
    baklava: {
      type: Object,
    },
    newElement: {
      type: Boolean,
    },
  },
  data() {
    return {
      editSettings: false,
      showSave: false,
      currentTags: [],
    };
  },
  setup(props) {
    const graphStore = useGraphStore();
    const elementStore = useElementStore();
    const errorStore = useErrorStore();
    //const baklava = useBaklava();
    const objectOptions = reactive({ name: undefined, private: undefined });
    props.baklava.editor.registerNodeType(TaskNode);
    props.baklava.editor.registerNodeType(FilterNode);
    props.baklava.editor.registerNodeType(ExperimentNode);
    props.baklava.editor.graphHooks.checkConnection.subscribe(
      "soile:connectionCheck",
      (c) => checkConnection(c.from, c.to)
    );
    if (props.data) {
      if (props.type === "project") {
        loadSoileProjectToBaklava(props.baklava, props.data);
      }
      if (props.type === "experiment") {
        loadSoileExperimentToBaklava(props.baklava, props.data);
      }
      objectOptions.name = props.data.name;
      objectOptions.private = props.data.private;
    } else {
      objectOptions.name = props.name;
      objectOptions.private = false;
    }
    return { graphStore, objectOptions, elementStore, errorStore };
  },
  methods: {
    async saveProject() {
      try {
        if (this.type === "project") {
          await BaklavaToSoileProjectJSON(this.baklava.editor.graph);
        }
        if (this.type === "experiment") {
          await BaklavaToSoileExperimentJSON(this.baklava.editor.graph);
        }
      } catch (err) {
        this.errorStore.raiseError("error", err.message);
        return;
      }
      await this.updateTags();
      this.showSave = true;
    },
    isSoileNode(nodeType) {
      return (
        nodeType === "TaskNode" ||
        nodeType === "FilterNode" ||
        nodeType === "ExperimentNode"
      );
    },
    updateOptions(newProps) {
      this.objectOptions = newProps;
      if (this.newElement) {
        this.$emit("updateName", newProps.name);
      }
      this.editSettings = false;
    },
    async updateTags() {
      console.log("Updating Tags");
      if (this.data && this.data.UUID != null && this.data.UUID != "") {
        console.log("Retrieving tags");
        const tags = await this.elementStore.getTagsForElement(
          this.data.UUID,
          this.type
        );
        this.currentTags = tags.map((x) => x.tag);
      } else {
        console.log("No Tags available for unversioned element");
        this.currentTags = [];
      }
    },
    async saveElement(tag) {
      this.showSave = false;
      console.log(this.baklava.editor.save());
      var data;
      if (this.type === "project") {
        data = await BaklavaToSoileProjectJSON(this.baklava.editor.graph);
      }
      if (this.type === "experiment") {
        data = await BaklavaToSoileExperimentJSON(this.baklava.editor.graph);
      }
      data.name = this.objectOptions.name;
      data.private = this.objectOptions.private;
      console.log(data);
      if (this.newElement) {
        data.tag = tag;
        this.$emit("createElement", data);
      } else {
        data.UUID = this.data.UUID;
        data.version = this.data.version;
        data.tag = tag;
        this.$emit("updateElement", data);
      }
    },
  },
  mounted() {
    // TODO: Check, if we need to clean up the graph in order not to screw things up...

    console.log("Editor mounted");
    console.log(this.data);
  },
};
</script>
<style>
.node-editor .minimap {
  left: 0px;
  top: 85%;
}
.editor {
  position: relative;
}
</style>

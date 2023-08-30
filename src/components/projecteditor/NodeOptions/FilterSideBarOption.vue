<template>
  <div>
    <div class="grid border-white border-solid border-1 border-round-sm mb-2">
      <div class="col-12">
        <div class="mb-2">Create New Filter</div>
        <FilterSetup
          :node="intf.data"
          v-model:filterName="newFilterName"
          v-model:filterString="newFilter"
          @saveFilter="createFilter()"
          buttonLabel="Create Filter"
        ></FilterSetup>
      </div>
    </div>

    <div class="grid border-white border-solid border-1 border-round-sm mt-2">
      <div class="col-12">
        Existing Filters
        <div class="grid mt-2" v-for="(output, key) in currentFilters">
          <div
            v-tooltip="output[1].filterstring"
            class="col-6 flex align-items-center"
          >
            {{ output[0] }}
          </div>
          <div class="col-3">
            <button
              class="baklava-button flex align-items-center"
              @click="removeFilter(output[0])"
            >
              Remove
            </button>
          </div>
          <div class="col-3 flex align-items-center justify-content-center">
            <button
              v-if="!isEditing(key)"
              class="baklava-button"
              @click="editFilter(key, false)"
            >
              Edit
            </button>
          </div>
          <div class="col-12" v-if="isEditing(key)">
            <FilterSetup
              :filterName="output[0]"
              :filterString="output[1].filterstring"
              :node="intf.data"
              buttonLabel="Update Node"
              :allowCancel="true"
              @saveFilter="(event) => saveFilter(event, key)"
              @cancel="editFilter(key, true)"
            ></FilterSetup>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FilterNode from "../NodeTypes/FilterNode";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import FilterSetup from "./elements/FilterSetup.vue";

export default defineComponent({
  props: {
    intf: {
      type: Object as () => ComponentInterface<FilterNode>,
      required: true,
    },
  },
  components: { FilterSetup },
  data() {
    return {
      newFilterName: "",
      newFilter: "",
      editing: [],
    };
  },
  setup(props) {
    const currentNode = props.intf.data;
    const nodeID = currentNode?.id;
    const currentFilters = currentNode.Filters;
    return { currentNode, nodeID, currentFilters };
  },
  methods: {
    createFilter() {
      if (this.newFilterName) {
        console.log("Adding output");
        this.currentNode.addFilter(this.newFilterName, this.newFilter);
      }
      // we reset the editing, if we have
      this.editing = [];
      this.newFilterName = "";
      this.newFilter = "";
    },

    removeFilter(output: string) {
      console.log("removing output: " + output);
      this.currentNode.removeFilter(output);
      this.editing = [];
    },
    editFilter(index: number, stop: boolean) {
      if (!stop) {
        this.editing.push(index);
      } else {
        this.editing = this.editing.filter((e: number) => e != index);
      }
    },
    isEditing(index: number): boolean {
      return this.editing.includes(index);
    },
    updateNodeData() {},
    saveFilter(
      event: { oldName: string; name: string; value: string },
      index: number
    ) {
      console.log(event);
      this.currentNode.updateFilter(event.oldName, event.name, event.value);
      this.editing = this.editing.filter((e: number) => e != index);
    },
  },
  watch: {
    currentNode() {
      this.updateNodeData();
    },
  },
  computed: {
    currentNode() {
      return this.intf.data;
    },
    nodeID() {
      this.updateNodeData.id;
    },
  },
  mounted() {
    this.updateNodeData();
  },
});
</script>

<style scoped>
.div.blockdiv {
  display: block;
}

table {
  border: none;
}

.tooltip-source {
  position: relative;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  overflow: visible;
}

.tooltip-source:hover .tooltip-text {
  visibility: visible;
}

.filterTable {
  width: 100%;
}
</style>

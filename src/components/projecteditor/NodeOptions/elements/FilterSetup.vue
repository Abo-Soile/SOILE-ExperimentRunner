<template>
  <div class="grid">
    <div class="col-12">
      <label for="addFilter">Filter Name:</label>
      <input
        type="text"
        class="baklava-input"
        v-model="newFilterName"
        name="addFilter"
      />
    </div>
    <div class="col-12">
      <label for="addOutput">Filter expression:</label>
      <input
        type="text"
        class="baklava-input"
        v-model="newFilter"
        name="addOutput"
        :disabled="true"
      />
    </div>
    <div class="col-12">
      <FormulaEditingDialog
        :formula="newFilter"
        :variables="graphOutputs"
        buttonClass="baklava-button"
        buttonText="Edit Expression"
      >
      </FormulaEditingDialog>
    </div>
    <div class="col-6">
      <button class="baklava-button" @click="updateFilter()">
        {{ buttonLabel }}
      </button>
    </div>
    <div class="col-6 flex justify-content-end">
      <button
        v-if="allowCancel"
        class="baklava-button"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComponentInterface } from "../../NodeInterfaces/ComponentInterface";
import FilterNode from "../../NodeTypes/FilterNode";
import { useGraphStore } from "@/stores/graph";
import { FormulaEditingDialog } from "@/components/dialogs";
//TODO: Have Checks for the Filters.
export default defineComponent({
  props: {
    node: {
      type: Object as () => ComponentInterface<FilterNode>,
      required: true,
    },
    filterName: {
      type: String,
    },
    filterString: {
      type: String,
    },
    buttonLabel: {
      type: String,
      default: "Save Filter",
    },
    allowCancel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:filterName", "update:filterString", "saveFilter", "cancel"],
  setup() {
    const graphStore = useGraphStore();
    return { graphStore };
  },
  components: {
    FormulaEditingDialog,
  },
  data() {
    return {
      editedFilterName: undefined,
      filterValue: undefined,
    };
  },
  methods: {
    updateFilter() {
      this.$emit("saveFilter", {
        oldName: this.filterName,
        name: this.editedFilterName,
        value: this.filterValue,
      });
    },
  },
  computed: {
    newFilterName: {
      get() {
        return this.filterName;
      },
      set(newValue: string) {
        this.editedFilterName = newValue;
        this.$emit("update:filterName", newValue);
      },
    },
    newFilter: {
      get() {
        return this.filterString;
      },
      set(newValue: string) {
        this.filterValue = newValue;
        this.$emit("update:filterString", newValue);
      },
    },
    graphOutputs() {
      return this.graphStore.getOutputsForGraph(this.node);
    },
  },
  watch: {},
  async mounted() {},
});
</script>

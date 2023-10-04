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
        v-tooltip="newFilter"
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
        @updateFormula="updateFormula"
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
  emits: ["saveFilter", "cancel"],
  setup() {
    const graphStore = useGraphStore();
    return { graphStore };
  },
  components: {
    FormulaEditingDialog,
  },
  data() {
    return {
      newFilterName: undefined,
      newFilter: undefined,
    };
  },
  methods: {
    updateFilter() {
      this.$emit("saveFilter", {
        oldName: this.filterName,
        name: this.newFilterName,
        value: this.newFilter,
      });
    },
    updateFormula(formulaString: string) {
      console.log(formulaString);
      this.newFilter = formulaString;
    },
  },
  computed: {
    graphOutputs() {
      return this.graphStore.getOutputsForGraph(this.node);
    },
  },
  watch: {},
  async mounted() {
    this.newFilterName = this.filterName;
    this.newFilter = this.filterString;
  },
});
</script>

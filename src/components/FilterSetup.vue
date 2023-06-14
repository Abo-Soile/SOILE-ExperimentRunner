<template>
  <div class="blockdiv">
    <label for="addFilter">Filter Name:</label>
    <input type="text" v-model="newFilterName" name="addFilter" />
  </div>
  <div class="blockdiv">
    <label for="addOutput">Filter expression:</label>
    <input type="text" v-model="newFilter" name="addOutput" />
  </div>
  <button class="baklava-button" @click="updateFilter()">
    {{ buttonLabel }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComponentInterface } from "./projecteditor/NodeInterfaces/ComponentInterface";
import FilterNode from "./projecteditor/NodeTypes/FilterNode";
import { useGraphStore } from "@/stores/graph";

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
  },
  emits: ["update:filterName", "update:filterString", "saveFilter"],
  setup() {
    const graphStore = useGraphStore();
    return { graphStore };
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
  },
  watch: {},
  async mounted() {},
});
</script>

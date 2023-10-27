<template>
  <div v-if="!source_data.horizontal" class="grid">
    <div
      v-for="option in options"
      :key="option.label"
      class="col-12 align-items-center"
    >
      <Checkbox
        :style="widgetStyle"
        class="questionnaire-label"
        v-model="value"
        :inputId="option.label"
        name="category"
        :value="option.value"
      ></Checkbox>
      <label :style="textStyle">{{ option.label }}</label>
    </div>
  </div>
  <div v-else class="grid justify-content-between">
    <div v-for="option in source_data.options" class="ml-2 mr-2">
      <div class="flex flex-column justify-content-center">
        <label
          :style="textStyle"
          :for="option.id"
          class="w-full mb-1 justify-content-center"
          >{{ option.label }}</label
        >
        <Checkbox
          :style="widgetStyle"
          class="w-full justify-content-center"
          v-model="value"
          :inputId="option.label"
          name="category"
          :value="option.value"
        ></Checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from "primevue/checkbox";
import { getStyle } from "@/helpers/styleHelper.js";

export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  components: {
    Checkbox,
  },
  emits: ["dataUpdate"],
  data() {
    return {
      value: [],
    };
  },
  computed: {
    getComputedStyle() {
      return "width: " + this.data.width + "em";
    },
    options() {
      var options = [];
      for (const option of this.source_data.options) {
        options.push({ label: option.label, value: option.id });
      }
      return options;
    },
    optionValues() {
      var optionValues = {};
      for (const option of this.source_data.options) {
        console.log(option);
        optionValues[option.id] = {
          selectedValue: option.selectedValue,
          unselectedValue: option.unselectedValue,
        };
      }
      return optionValues;
    },
    widgetStyle() {
      return getStyle(this.source_data.widgetStyle);
    },
    textStyle() {
      return getStyle(this.source_data.style);
    },
  },
  methods: {
    init(newData) {
      const values = [];
      for (const option of newData.options) {
        if (option.checked) {
          values.push(option.id);
        }
      }
      this.value = values;
    },
  },
  watch: {
    value(newValue, oldValue) {
      const newlydeSelected = oldValue.filter((x) => !newValue.includes(x));
      const newlySelected = newValue.filter((x) => !oldValue.includes(x));
      for (const selected of newlySelected) {
        this.$emit("dataUpdate", {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].selectedValue,
        });
      }
      for (const selected of newlydeSelected) {
        this.$emit("dataUpdate", {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].unselectedValue,
        });
      }
    },
    source_data(newValue) {
      this.init(newValue);
    },
  },
  mounted() {
    // initially select values.
    this.init(this.source_data);
  },
};
</script>

<style scoped>
.tickbox :deep(.custom-control-input) {
  margin-right: 2px;
}
</style>

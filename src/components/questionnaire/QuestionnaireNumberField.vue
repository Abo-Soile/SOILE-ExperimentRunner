<template>
  <label class="questionnaire-label" :for="source_data.id" :style="textStyle">{{
    source_data.label
  }}</label>
  <InputNumber
    :style="widgetStyle"
    :class="isValid ? 'p-inputtext-sm' : 'p-invalid p-inputtext-sm'"
    :step="source_data.increment"
    mode="decimal"
    showButtons
    :id="source_data.id"
    v-model="value"
  >
  </InputNumber>
</template>

<script>
import InputNumber from "primevue/inputnumber";
import { getStyle } from "@/helpers/styleHelper.js";

export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  components: { InputNumber },
  emits: ["dataUpdate"],
  data() {
    return {
      value: undefined,
    };
  },
  methods: {},
  watch: {
    value() {
      if (this.isValid) {
        console.log("Emitting update");
        this.$emit("dataUpdate", {
          isValid: true,
          target: this.source_data.id,
          value: this.value,
        });
      } else {
        this.$emit("dataUpdate", {
          isValid: false,
          target: this.source_data.id,
        });
      }
    },
    source_data(newValue) {
      if (newValue.value) {
        this.value = newValue.value;
      }
    },
  },
  computed: {
    isValid() {
      return (
        this.value != null &&
        this.value != undefined &&
        this.value >= this.source_data.minimum &&
        this.value <= this.source_data.maximum
      );
    },
    getComputedStyle() {
      return "width: " + (this.source_data.width + 2) + "em";
    },
    widgetStyle() {
      return getStyle(this.source_data.widgetStyle);
    },
    textStyle() {
      return getStyle(this.source_data.style);
    },
  },
  mounted() {},
};
</script>

<style scoped></style>

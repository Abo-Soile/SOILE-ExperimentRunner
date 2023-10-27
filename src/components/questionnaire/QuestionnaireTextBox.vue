<template>
  <span class="align-items-start">
    <label class="questionnaire-label" :for="source_data.id" :style="style">{{
      source_data.label
    }}</label>
    <br v-if="source_data.linebreak" />
    <InputText
      class="mb-2 mr-sm-2 mb-sm-0"
      :step="source_data.increment"
      :style="getComputedStyle"
      :class="isValid ? '' : 'p-invalid'"
      :id="source_data.id"
      v-model="value"
    />
  </span>
</template>

<script>
import InputText from "primevue/inputtext";
export default {
  components: { InputText },
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  emits: ["dataUpdate"],
  data() {
    return {
      value: undefined,
    };
  },
  methods: {
    emitUpdate(valid, id, value) {
      this.$emit("dataUpdate", {
        isValid: valid,
        target: id,
        value: value,
      });
    },
  },
  watch: {
    value() {
      this.emitUpdate(this.isValid, this.source_data.id, this.value);
    },
    source_data(newValue) {
      this.emitUpdate(
        this.isValid,
        this.source_data.id,
        this.value ? this.value : ""
      );
    },
  },
  computed: {
    isValid() {
      if (this.source_data.optional || (this.value && this.value != "")) {
        return true;
      } else {
        return false;
      }
    },
    style() {
      return Object.entries(this.source_data.style)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
    },
    getComputedStyle() {
      return "width: " + (this.source_data.length + 4) + "em";
    },
    tooltip() {
      return (
        "Value must be between" +
        this.source_data.minimum +
        " and " +
        this.source_data.maximum
      );
    },
  },
  mounted() {
    this.emitUpdate(this.isValid, this.source_data.id, this.value);
  },
};
</script>

<style scoped></style>

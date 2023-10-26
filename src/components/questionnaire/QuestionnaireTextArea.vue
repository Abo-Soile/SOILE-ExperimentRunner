<template>
  <div class="flex align-items-start">
    <label
      class="questionnaire-label"
      v-if="hasLabel"
      :for="source_data.id"
      :style="style"
      >{{ source_data.label }}</label
    >
    <TextArea
      autoResize
      :class="isValid ? '' : 'p-invalid'"
      :id="source_data.id"
      v-model="value"
      :rows="source_data.rows"
      :cols="source_data.columns"
    />
  </div>
</template>

<script>
import TextArea from "primevue/textarea";
export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: undefined,
    };
  },
  components: { TextArea },
  emits: ["dataUpdate"],
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
    source_data() {
      // reset if the source data changes!
      this.value = undefined;
      this.$emit("dataUpdate", {
        isValid: this.isValid,
        target: this.source_data.id,
        value: this.value,
      });
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
    hasLabel() {
      if (this.source_data.label && this.source_data.label != "") {
        return true;
      } else {
        return false;
      }
    },
    getComputedStyle() {
      return "width: " + this.source_data.columns + "em";
    },
    style() {
      return Object.entries(this.source_data.style)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
    },
  },
};
</script>

<style scoped></style>

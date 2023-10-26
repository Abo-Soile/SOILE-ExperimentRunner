<template>
  <div v-if="!source_data.horizontal" class="grid" :style="style">
    <div
      v-for="option in source_data.options"
      class="col-12 align-items-center"
    >
      <RadioButton
        class="questionnaire-label"
        v-model="value"
        :inputId="option.id"
        :value="{ value: option.selectedValue, id: option.id }"
      />
      <label :for="option.id" class="ml-2">{{ option.label }}</label>
    </div>
  </div>
  <div v-else class="grid justify-content-between" :style="style">
    <div v-for="option in source_data.options" class="ml-2 mr-2">
      <div class="flex flex-column justify-content-center">
        <label :for="option.id" class="w-full mb-1 justify-content-center">{{
          option.label
        }}</label>
        <RadioButton
          class="w-full justify-content-center"
          v-model="value"
          :inputId="option.id"
          :value="{ value: option.selectedValue, id: option.id }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";
export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  components: { RadioButton },
  emits: ["dataUpdate"],
  data() {
    return {
      value: null,
    };
  },
  methods: {
    init(selectionOptions) {
      for (const option of selectionOptions.options) {
        if (selectionOptions.optional) {
          this.$emit("dataUpdate", {
            isValid: true,
            target: option.id,
            value: null,
          });
        }
        if (option.checked) {
          this.value = { value: option.selectedValue, id: option.id };
        }
      }
    },
  },
  watch: {
    value() {
      console.log("Value updated");
      this.$emit("dataUpdate", {
        isValid: true,
        target: this.value.id,
        value: this.value.value,
      });
    },
    source_data(newValue) {
      this.init(newValue);
    },
  },
  computed: {
    style() {
      return Object.entries(this.source_data.style)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
    },
  },
  mounted() {
    this.init(this.source_data);
  },
};
</script>

<style scoped></style>

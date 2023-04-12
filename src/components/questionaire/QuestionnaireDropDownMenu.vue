<template>
  <label class="mb-2 mr-sm-2 mb-sm-0" :for="source_data.id">{{ source_data.label }}</label>
  <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
    <b-form-select class="mb-2 mr-sm-2 mb-sm-0" :options="source_data.options" v-model="value">
      <template v-if="!source_data.required" #first>
        <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
      </template>
    </b-form-select>
  </b-input-group>
</template>

<script>
export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: null,
    };
  },
  watch: {
    value() {
      this.$emit("dataUpdate", {
        isValid: true,
        target: this.source_data.id,
        value: this.value,
      });

    },
    source_data(newValue) {
      if (newValue.value != undefined && newValue != null) {
          this.value = newValue.value;
        }
      if (newValue.required) {                
          this.$emit("dataUpdate", {
            isValid: this.isValid,
            target: newValue.id,
            value: this.value,
          });        
      }

    }
  },
  computed: {
    isValid() {
      return this.value ? true : false;
    },
    getComputedStyle() {
      return "width: " + this.data.width + "em";
    },
  },
  mounted() {

  },
};
</script>

<style scoped></style>

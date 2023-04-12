<template>
  <b-input-group>
    <b-form-radio-group class="mb-2 mr-sm-2 mb-sm-0" v-model="value" stacked>
      <b-form-radio v-for="option in source_data.options" :key="option.id"
        :value="{ value: option.selectedValue, id: option.id }" class="d-flex justify-content-start">
        {{ option.label }}
      </b-form-radio>
    </b-form-radio-group>
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
  methods: {
    init(selectionOptions)
    {
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
    }
  },
  watch:
  {
    value() {
      console.log("Value updated")
      this.$emit("dataUpdate", {
        isValid: true,
        target: this.value.id,
        value: this.value.value,
      });

    },
    source_data(newValue) {
      this.init(newValue);
    }
  },
  mounted() {
    this.init(this.source_data)
  },
};
</script>

<style scoped></style>

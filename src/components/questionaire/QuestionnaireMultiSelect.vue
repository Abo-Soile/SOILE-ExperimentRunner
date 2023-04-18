<template>
  <div>
  <b-form-checkbox-group class="mb-2 mr-sm-2 mb-sm-0" stacked>
    <b-form-checkbox v-for="option in options" v-model="value" :key="option.label" :value="option.value"
      class="d-flex justify-content-start tickbox">
      {{ option.label }}
    </b-form-checkbox>

  </b-form-checkbox-group>
</div>
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
      value: [],
    }
  },
  computed: {
    getComputedStyle() {
      return "width: " + this.data.width + "em";
    },
    options() {
      var options = [];
      for (const option of this.source_data.options) {
        options.push({ label: option.label, value: option.id })
      }
      return options
    },
    optionValues() {
      var optionValues = {};
      for (const option of this.source_data.options) {
        console.log(option)
        optionValues[option.id] = { selectedValue: option.selectedValue, unselectedValue: option.unselectedValue }
      }
      return optionValues
    }
  },
  methods:
  {
    init(newData)
    {
      const values = [];
      for (const option of newData.options) {
        console.log(option)

        if (option.checked) {
          values.push(option.id);
        }
      }
      this.value = values;
    }
  },
  watch:
  {
    value(newValue, oldValue) {
      const newlydeSelected = oldValue.filter(x => !newValue.includes(x));
      const newlySelected = newValue.filter(x => !oldValue.includes(x));
      for (const selected of newlySelected) {
        this.$emit("dataUpdate", {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].selectedValue
        });
      }
      for (const selected of newlydeSelected) {
        this.$emit("dataUpdate", {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].unselectedValue
        });
      }
    },
    source_data(newValue) {
      this.init(newValue);
    }
  },
  mounted() {
    // initially select values.
    this.init(this.source_data)
  },
};
</script>

<style scoped>
.tickbox :deep(.custom-control-input) {
  margin-right: 2px
}
</style>


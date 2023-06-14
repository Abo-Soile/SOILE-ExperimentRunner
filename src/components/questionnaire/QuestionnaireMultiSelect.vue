<template>
  <div v-for="option in options" :key="option.label" class="flex align-items-center">
    <Checkbox
      class="questionnaire-label"
      v-model="value"
      :inputId="option.label"
      name="category"
      :value="option.value"
      >{{ option.label }}</Checkbox
    >
    <label :for="option.label">{{ option.label }}</label>
  </div>
</template>

<script>
import Checkbox from 'primevue/checkbox'
export default {
  props: {
    source_data: {
      type: Object,
      required: true
    }
  },
  components: {
    Checkbox
  },
  emits: ['dataUpdate'],
  data() {
    return {
      value: []
    }
  },
  computed: {
    getComputedStyle() {
      return 'width: ' + this.data.width + 'em'
    },
    options() {
      var options = []
      for (const option of this.source_data.options) {
        options.push({ label: option.label, value: option.id })
      }
      return options
    },
    optionValues() {
      var optionValues = {}
      for (const option of this.source_data.options) {
        console.log(option)
        optionValues[option.id] = {
          selectedValue: option.selectedValue,
          unselectedValue: option.unselectedValue
        }
      }
      return optionValues
    }
  },
  methods: {
    init(newData) {
      const values = []
      for (const option of newData.options) {
        console.log(option)

        if (option.checked) {
          values.push(option.id)
        }
      }
      this.value = values
    }
  },
  watch: {
    value(newValue, oldValue) {
      const newlydeSelected = oldValue.filter((x) => !newValue.includes(x))
      const newlySelected = newValue.filter((x) => !oldValue.includes(x))
      for (const selected of newlySelected) {
        this.$emit('dataUpdate', {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].selectedValue
        })
      }
      for (const selected of newlydeSelected) {
        this.$emit('dataUpdate', {
          isValid: true,
          target: selected,
          value: this.optionValues[selected].unselectedValue
        })
      }
    },
    source_data(newValue) {
      this.init(newValue)
    }
  },
  mounted() {
    // initially select values.
    this.init(this.source_data)
  }
}
</script>

<style scoped>
.tickbox :deep(.custom-control-input) {
  margin-right: 2px;
}
</style>

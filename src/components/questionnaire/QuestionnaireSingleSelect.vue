<template>
  <div v-for="option in source_data.options" :key="option.id" class="flex align-items-center">
    <RadioButton
      class="questionnaire-label"
      v-model="value"
      :inputId="option.id"
      :value="{ value: option.selectedValue, id: option.id }"
    />
    <label :for="option.id" class="ml-2">{{ option.label }}</label>
  </div>
</template>

<script>
import RadioButton from 'primevue/radiobutton'
export default {
  props: {
    source_data: {
      type: Object,
      required: true
    }
  },
  components: { RadioButton },
  emits: ['dataUpdate'],
  data() {
    return {
      value: null
    }
  },
  methods: {
    init(selectionOptions) {
      for (const option of selectionOptions.options) {
        if (selectionOptions.optional) {
          this.$emit('dataUpdate', {
            isValid: true,
            target: option.id,
            value: null
          })
        }
        if (option.checked) {
          this.value = { value: option.selectedValue, id: option.id }
        }
      }
    }
  },
  watch: {
    value() {
      console.log('Value updated')
      this.$emit('dataUpdate', {
        isValid: true,
        target: this.value.id,
        value: this.value.value
      })
    },
    source_data(newValue) {
      this.init(newValue)
    }
  },
  mounted() {
    this.init(this.source_data)
  }
}
</script>

<style scoped></style>

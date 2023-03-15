<template>
  <b-form-checkbox-group class="mb-2 mr-sm-2 mb-sm-0"
    stacked
  >
  <b-form-checkbox 
        v-for="option in options"
        v-model="value"
        :key="option.label"
        :value="option.value"                        
        class="d-flex justify-content-start"
      >
        {{ option.label }}
    </b-form-checkbox> 

  </b-form-checkbox-group>      
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
    isValid() {
      return this.value > this.data.minimum && this.value < this.data.maximum;
    },
    getComputedStyle() {
      return "width: " + this.data.width + "em";
    },
    options()
    {
      var options = [];
      for(const option of this.source_data.options)
      {
        options.push({label: option.label, value: option.id })
      }
      return options
    }
  },
  watch:
  {
    value(newValue)
    {
      this.$emit("dataUpdate", {
          isValid: true,
          target: this.value,
          value: true
        });
    }
  },
  mounted() {      
  },
};
</script>

<style scoped>

</style>


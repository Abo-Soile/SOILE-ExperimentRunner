<template>  
<b-input-group>
  <b-form-radio-group class="mb-2 mr-sm-2 mb-sm-0"
    v-model="value"
    stacked
  >
  <b-form-radio 
        v-for="option in source_data.options"
        :key="option.label"
        :value="option.value"                        
        class="d-flex justify-content-start"
      >
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
  computed: {
  },
  watch:
  {
    value()
    {
      this.$emit("dataUpdate", {
          isValid: true,
          target: this.source_data.id,
          value: this.value,
      });

    } 
  },
  mounted() {
    if (this.source_data.value) {
      this.value = this.source_data.value;
    }
  },
};
</script>

<style scoped>

</style>

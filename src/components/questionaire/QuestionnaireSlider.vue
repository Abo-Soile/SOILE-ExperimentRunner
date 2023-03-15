<template>
  <div>
  <b-row><b-col>
      <b-form-input 
        type="range"
        :step="source_data.increment"
        :id="source_data.id"
        :min="source_data.minimum"
        :max="source_data.maximum"
        v-model="value"
      />  
  </b-col>
  </b-row>
  <b-row>
      <b-col v-for="(label,key) in source_data.labels" :key="key">
          {{ label }}
      </b-col>
  
  </b-row>

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
    value: undefined,
  };
},
methods: {},
watch: {
  value() {
      this.$emit("dataUpdate", {
        isValid: true,
        target: this.source_data.id,
        value: this.value,
      });
  },
},
computed: {
  getComputedStyle() {
    return "width: " + (this.source_data.width+2) + "em";
  },
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

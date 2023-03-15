<template>
  <b-container>
    <b-row>
        <label v-if="hasLabel" :for="source_data.id">{{ source_data.label }}</label>
        <b-form-textarea 
          :style="getComputedStyle"
          :state="isValid"
          :id="source_data.id"
          v-model="value"
          :max_rows=source_data.rows
          :rows=source_data.rows
          no-resize
        />        
    </b-row>
    
  </b-container>
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
  },
  computed: {
    isValid() {
      if(!this.source_data.required || this.value && this.value != "")
      {
        return true
      }
      else
      {
        return false;
      }      
    },
    hasLabel() {
      if(this.source_data.label && this.source_data.label != "")
      {
        return true
      }
      else
      {
        return false;
      }      
    },
    getComputedStyle() {
      return "width: " + (this.source_data.columns) + "em";
    },
  },
};
</script>

<style scoped>

</style>

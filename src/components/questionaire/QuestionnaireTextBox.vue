<template>
  
    <label class="mb-2 mr-sm-2 mb-sm-0" :for=source_data.id >{{ source_data.label }}</label>
    <b-input-group class="mb-2 mr-sm-2 mb-sm-0" v-if="source_data.linebreak">
      <b-form-input 
          size="sm"
          :no-wheel="true"
          :step="source_data.increment"
          :style="getComputedStyle"
          type="text"
          :state="isValid"
          :id="source_data.id"
          v-model="value"
        />       
    </b-input-group>
    <b-input-group class="mb-2 mr-sm-2 mb-sm-0" v-else >
      <b-form-input
          size="sm" 
          :no-wheel="true"
          :step="source_data.increment"
          :style="getComputedStyle"
          type="text"
          :state="isValid"
          :id="source_data.id"
          v-model="value"
        />
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
    getComputedStyle() {
      return "width: " + (this.source_data.length + 4) + "em";
    },
    tooltip()
    {
      return "Value must be between" + this.source_data.minimum + " and " + this.source_data.maximum 

    }
  },
};
</script>

<style scoped>

</style>

<template>
    <div>
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
  methods: {
    emitUpdate(valid, id, value)
    {
      this.$emit("dataUpdate", {
          isValid: valid,
          target: id,
          value: value
        });
    }
  },
  watch: {
    value() {
      console.log("Emitting update");
      this.emitUpdate(this.isValid, this.source_data.id, this.value )            
    },
    source_data(newValue)
    {
      this.emitUpdate(this.isValid, this.source_data.id, this.value ? this.value : "" );
    }
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
  mounted()
  {

  }
};
</script>

<style scoped>

</style>

<template>
  <div>
  <label class="mb-2 mr-sm-2 mb-sm-0" :for="source_data.id">{{ source_data.label }}</label>
  <b-form-input class="mb-2 mr-sm-2 mb-sm-0"
  :no-wheel="true" 
  :step="source_data.increment" 
  type="number" 
  :state="isValid"
  :style="getComputedStyle" 
  :id="source_data.id"
    v-model="value">
  </b-form-input>
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
    source_data(newValue) 
    {
      if (newValue.value) {
      this.value = newValue.value;
    }
    }
  },
  computed: {
    isValid() {
      return (
        this.value >= this.source_data.minimum &&
        this.value <= this.source_data.maximum
      );
    },
    getComputedStyle() {
      return "width: " + (this.source_data.width + 2) + "em";
    },
  },
  mounted() {

  },
};
</script>

<style scoped>

</style>

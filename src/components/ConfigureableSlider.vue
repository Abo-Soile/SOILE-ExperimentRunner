<template>
    This is a slider
  <b-form-group>
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
        <b-col v-for="(label,key) in source_Data.labels" :key="key">
            {{ label }}
        </b-col>
    
    </b-row>
  </b-form-group>
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
      return (
        this.value >= this.source_data.minimum &&
        this.value <= this.source_data.maximum
      );
    },
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
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

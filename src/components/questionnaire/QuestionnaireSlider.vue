<template>
  <div :style="source_data.style">
    <Slider
      type="range"
      :step="source_data.increment"
      :id="source_data.id"
      :min="source_data.minimum"
      :max="source_data.maximum"
      v-model="value"
    />
    <div class="sliderticks">
      <p v-for="(label, key) in source_data.labels" :key="key">
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script>
import Slider from "primevue/slider";
export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  emits: ["dataUpdate"],
  components: { Slider },
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
    source_data() {
      if (
        this.source_data.select != null &&
        this.source_data.select != undefined
      ) {
        this.value = this.source_data.select;
      }
    },
  },
  mounted() {
    // nitially select the value (updated in watcher)
    this.value = this.source_data.select;
  },
};
</script>

<style scoped>
.sliderticks {
  display: flex;
  justify-content: space-between;
}

.sliderticks p {
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 1px;
  height: 10px;
  line-height: 20px;
  margin: 0 0 20px 0;
}
</style>

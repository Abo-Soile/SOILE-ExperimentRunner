<template>
  <div :style="style">
    <Slider
      class="h-1rem"
      type="range"
      :step="source_data.increment"
      :id="source_data.id"
      :min="source_data.minimum"
      :max="source_data.maximum"
      v-model="value"
      :pt="handleStyle"
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
  computed: {
    handleStyle() {
      const rootStyle = this.isValid ? {} : { class: "invalid" };
      if (
        this.value === undefined ||
        this.value < this.source_data.minimum ||
        this.value > this.source_data.maximum
      ) {
        return {
          root: rootStyle,
          handle: { class: "hidden" },
          range: { class: "hidden" },
        };
      } else {
        return { root: rootStyle, range: { class: "hidden" } };
      }
    },
    isValid() {
      if (
        this.source_data.optional ||
        (this.value >= this.source_data.minimum &&
          this.value <= this.source_data.maximum)
      ) {
        return true;
      } else {
        return false;
      }
    },
    style() {
      return Object.entries(this.source_data.style)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
    },
  },
  methods: {
    roundStep() {
      // this needs to be 0 otherwise we clicked at a plae that doesn't correspond to the
      // increment
      if (
        (this.value - this.source_data.minimum) % this.source_data.increment !=
        0
      ) {
        const newValue =
          Math.round(
            (this.value - this.source_data.minimum) / this.source_data.increment
          ) * this.source_data.increment;
        this.value = newValue;
      }
    },
  },
  watch: {
    value() {
      this.roundStep();
      this.$emit("dataUpdate", {
        isValid: this.isValid,
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
    // initially select the value (updated in watcher)
    if (
      this.source_data.select >= this.source_data.minimum &&
      this.source_data.select <= this.source_data.maximum
    ) {
      this.value = this.source_data.select;
    } else {
      this.$emit("dataUpdate", {
        isValid: this.isValid,
        target: this.source_data.id,
        value: this.source_data.select,
      });
    }
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
.invalid {
  border: 1px solid #e24c4c;
}
</style>

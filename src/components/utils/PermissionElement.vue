<template>
  <div class="grid">
    <div class="col">
      {{ elementName }}
    </div>
    <div class="col">
      <DropDown
        v-model="currentPermission"
        placeHolder="Select Option"
        :options="options"
      ></DropDown>
    </div>
  </div>
</template>

<script>
import DropDown from "primevue/dropdown";
export default {
  props: {
    permissionOptions: {
      type: Array,
      requied: true,
    },
    originalPermission: {
      type: String,
    },
    elementName: {
      type: String,
      required: true,
    },
  },
  emits: ["removePermission", "setPermission"],
  components: { DropDown },
  data() {
    return {
      currentPermission: null,
    };
  },
  computed: {
    options() {
      return ["REMOVE"].concat(this.permissionOptions);
    },
  },
  watch: {
    originalPermission(newValue) {
      console.log("Getting new permission: " + newValue);
      this.currentPermission = newValue;
    },
    currentPermission(newValue) {
      if (newValue === "REMOVE") {
        this.$emit("removePermission");
      } else {
        this.$emit("setPermission", newValue);
      }
    },
  },
  mounted() {
    console.log("Setting currentPermission to " + this.originalPermission);
    this.currentPermission = this.originalPermission;
  },
};
</script>

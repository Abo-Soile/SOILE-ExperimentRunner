<template>
  <Dialog v-model:visible="dialogVisible"> Help </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>

<template>
  <Dialog :visible="dialogVisible" header="User Details" modal>
    <UserSettings @updateSettings="(event) => $emit('createUser', event)" />
  </Dialog>
</template>
<script>
import UserSettings from "./UserSettings.vue";
import Dialog from "primevue/dialog";
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  components: { Dialog, UserSettings },
  emits: ["createUser"],
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.loading = false;
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>

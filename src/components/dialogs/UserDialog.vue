<template>
  <Dialog v-model:visible="dialogVisible" header="User Details" modal>
    <UserSettings
      :usernamefixed="usernamefixed"
      :showPassword="showPassword"
      :initialSettings="initialSettings"
      :submitLabel="submitLabel"
      @updateUser="(event) => $emit('updateUser', event)"
    />
  </Dialog>
</template>
<script>
import UserSettings from "@/components/user/UserSettings.vue";
import Dialog from "primevue/dialog";

import { useErrorStore } from "@/stores";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    usernamefixed: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: true,
    },
    initialSettings: {
      type: Object,
      default: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullname: "",
      },
    },
    submitLabel: {
      type: String,
      default: "Create",
    },
  },
  components: {
    Dialog,
    UserSettings,
  },
  emits: ["updateUser", "update:visible"],
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

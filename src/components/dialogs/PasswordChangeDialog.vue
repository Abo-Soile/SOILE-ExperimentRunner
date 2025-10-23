<template>
  <Dialog v-model:visible="dialogVisible" header="Change Password" modal>
    <ResetPassword
      :showCancel="true"
      @updatePassword="updatePassword"
      @cancel="dialogVisible = false"
    />
  </Dialog>
</template>
<script>
import ResetPassword from "@/components/ResetPassword.vue";
import { useErrorStore } from "@/stores";

import Dialog from "primevue/dialog";
import Password from "primevue/password";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Dialog,
    ResetPassword,
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
    };
  },
  emits: ["updatePassword", "update:visible"],
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
    confirmValid() {
      return this.confirmPassword === this.password;
    },
    passwordValid() {
      return this.password.length >= 10;
    },
  },
  methods: {
    updatePassword() {
      if (
        !(this.confirmPassword === this.password) ||
        this.password.length < 10
      ) {
        this.errorStore.raiseError(
          "error",
          "Passwords must match and must have a length of at least 10 symbols"
        );
      } else {
        this.$emit("updatePassword", this.password);
        this.$emit("update:visible", false);
      }
    },
  },
};
</script>

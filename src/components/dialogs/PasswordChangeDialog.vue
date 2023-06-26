<template>
  <Dialog v-model:visible="dialogVisible" header="Change Password" modal>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="dialogVisible = false"
        text
      />
      <Button
        label="Set New Password"
        icon="pi pi-check"
        @click="updatePassword"
        autofocus
      />
    </template>
    <div>
      <div class="grid">
        <div class="col flex align-items-center">
          <label for="password">Password</label>
        </div>
        <div class="col flex align-items-center">
          <Password
            :class="passwordValid ? '' : 'p-invalid'"
            id="password"
            v-model="password"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col flex align-items-center">
          <label for="confirmPassword">Confirm Password</label>
        </div>
        <div class="col flex align-items-center">
          <Password
            id="confirmPassword"
            :class="confirmValid ? '' : 'p-invalid'"
            v-model="confirmPassword"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import UserSettings from "@/components/user/UserSettings.vue";
import { useErrorStore } from "@/stores";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
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
    UserSettings,
    Password,
    Button,
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
        !(this.settings.confirmPassword === this.settings.password) ||
        this.settings.password.length < 10
      ) {
        this.errorStore.raiseError(
          "error",
          "Passwords must match and must have a length of at least 10 symbols"
        );
      } else {
        this.$emit("updatePassword", this.password);
      }
    },
  },
};
</script>

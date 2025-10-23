<template>
  <div>
    <div class="flex flex-column">
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
      <div class="flex justify-content-end mt-4">
        <Button
          v-if="showCancel"
          label="Cancel"
          icon="pi pi-times"
          @click="$emit('cancel')"
          text
        />
        <Button
          label="Set New Password"
          icon="pi pi-check"
          @click="updatePassword"
          autofocus
        />
      </div>
    </div>
  </div>
</template>
<script>
import { useErrorStore } from "@/stores";
import Password from "primevue/password";
import Button from "primevue/button";

export default {
  props: {
    showCancel: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Password,
    Button,
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
    };
  },
  emits: ["updatePassword", "cancel"],
  computed: {
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
      }
    },
  },
};
</script>

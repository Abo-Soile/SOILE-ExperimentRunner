<template>
  <div class="justify-content-center">
    <h1>Reset Password</h1>
    <div v-if="!submitted" class="p-fluid">
      <div class="p-field">
        <label for="recoveryItem">Enter Username or Email</label>
        <InputText id="recoveryItem" v-model="recoveryItem" />
      </div>
      <div class="p-field">
        <Button
          label="Reset Password"
          @click="submitResetRequest"
          class="p-button-success"
        />
      </div>
    </div>
    <div class="p-fluid" v-else>
      <router-link class="flex" to="/" @click="showLoginDialog = false"
        >Submitted, you will receive an email shortly</router-link
      >
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useAuthStore } from "../stores";

export default {
  name: "PasswordReset",
  components: {
    InputText,
    Button,
  },
  data() {
    return {
      recoveryItem: "",
      submitted: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },

  methods: {
    async submitResetRequest() {
      const success = await this.authStore.resetPassword(this.recoveryItem);
      if (success) {
        this.submitted = true;
      }
    },
  },
  mounted() {
    this.submitted = false;
  },
};
</script>

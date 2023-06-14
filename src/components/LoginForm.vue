<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="p-fluid">
        <div class="p-field">
          <label for="username">Username</label>
          <InputText id="username" v-model="username" />
        </div>
        <div class="p-field">
          <label for="password">Password</label>
          <Password id="password" :feedback="false" v-model="password" />
        </div>
        <div class="p-field-checkbox">
          <label for="rememberMe">Remember Me</label>
          <Checkbox
            v-model="rememberMe"
            :binary="true"
            name="rememberMe"
            label="Remember Me"
          />
        </div>
        <div class="p-field">
          <Button type="submit" label="Log in" class="p-button-success" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import { useAuthStore } from "../stores";

export default {
  name: "LoginForm",
  components: {
    Card,
    InputText,
    Password,
    Checkbox,
    Button,
  },
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    return {
      login: authStore.login,
    };
  },

  methods: {
    async submitForm() {
      await this.login(this.username, this.password, this.rememberMe);
      this.$emit("submitted");
    },
  },
};
</script>

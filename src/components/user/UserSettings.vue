<template>
  <div>
    <h1>User Settings</h1>
    <form @submit.prevent="saveSettings">
      <div class="grid">
        <div class="col">
          <label for="username">Username</label>
        </div>
        <div class="col">
          <InputText
            id="username"
            v-model="settings.username"
            :disabled="usernamefixed"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col">
          <label for="email">Email</label>
        </div>
        <div class="col">
          <InputText id="email" v-model="settings.email" />
        </div>
      </div>
      <div class="grid">
        <div class="col">
          <label for="fullname">Full Name</label>
        </div>
        <div class="col">
          <InputText id="fullname" v-model="settings.fullname" />
        </div>
      </div>
      <div v-if="showPassword">
        <div class="grid">
          <div class="col">
            <label for="password">Password</label>
          </div>
          <div class="col">
            <Password id="password" v-model="settings.password" />
          </div>
        </div>
        <div class="grid">
          <div class="col">
            <label for="confirmPassword">Confirm Password</label>
          </div>
          <div class="col">
            <Password id="confirmPassword" v-model="settings.confirmPassword" />
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="col">
          <Button type="submit" :label="submitLabel" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useErrorStore } from "@/stores";
export default {
  props: {
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

  data() {
    return {
      settings: { ...this.initialSettings },
    };
  },
  emits: ["updateSettings"],
  setup() {
    const errorStore = useErrorStore();
    return { errorStore };
  },
  methods: {
    saveSettings() {
      if (
        (this.showPassword &&
          !(this.settings.confirmPassword === this.settings.password)) ||
        this.settings.password.length < 10
      ) {
        this.errorStore.raiseError(
          "error",
          "Passwords must match and must have a length of at least 10"
        );
      } else {
        this.$emit("updateSettings", this.settings);
      }
    },
  },
  components: {
    InputText,
    Password,
    Button,
  },
  mounted() {
    this.settings = { ...this.initialSettings };
  },
  watch: {
    initialSettings(newValue) {
      this.settings = { ...newValue };
    },
  },
};
</script>

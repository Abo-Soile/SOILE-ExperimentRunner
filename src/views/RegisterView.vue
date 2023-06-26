<template>
  <div class="flex align-items-center flex-column">
    <UserSettings
      title="Register as new User"
      :usernamefixed="false"
      :showPassword="true"
      submitLabel="Register"
      @updateUser="registerUser"
    />
  </div>
</template>
<script>
import UserSettings from "@/components/user/UserSettings.vue";
import Dialog from "primevue/dialog";

import { useUserStore, useErrorStore, useAuthStore } from "@/stores";

export default {
  components: {
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
  setup() {
    const userStore = useUserStore();
    const errorStore = useErrorStore();
    const authStore = useAuthStore();
    return { userStore, errorStore, authStore };
  },
  methods: {
    registerUser(userData) {
      if (
        userData.password != userData.confirmPassword ||
        userData.password.length < 10
      ) {
        if (userData.password.length < 10) {
          this.errorStore.raiseError("Password must have at least 10 symbols");
        } else {
          this.errorStore.raiseError(
            "Password onfirmation does not match password"
          );
        }
      } else {
        console.log("Registering user");
        this.userStore.registerUser(userData).then((res) => {
          if (res) {
            this.authStore
              .login(userData.username, userData.password, false)
              .then(() => {
                if (this.authStore.authed) {
                  this.$router.push("/");
                }
              });
          }
        });
      }
    },
  },
};
</script>

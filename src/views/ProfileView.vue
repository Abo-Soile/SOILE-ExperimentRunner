<template>
  <div class="flex align-items-center flex-column">
    <div class="flex align-items-start flex-column">
      <UserSettings
        title="User Information"
        :usernamefixed="true"
        :showPassword="false"
        :initialSettings="userInfo"
        submitLabel="Update"
        @updateUser="updateUser"
      />

      <Button class="flex" @click="showPasswordDialog = true"
        >Change Password</Button
      >
    </div>
  </div>
  <PasswordChangeDialog
    v-model:visible="showPasswordDialog"
    @updatePassword="updatePassword"
  >
  </PasswordChangeDialog>
</template>
<script>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

import UserSettings from "@/components/user/UserSettings.vue";
import PasswordChangeDialog from "@/components/dialogs/PasswordChangeDialog.vue";
import { useUserStore, useErrorStore, useAuthStore } from "@/stores";

import { ref } from "vue";

export default {
  components: {
    UserSettings,
    Button,
    Dialog,
    InputText,
    PasswordChangeDialog,
  },
  emits: ["updateUser", "update:visible"],
  data() {
    return {
      showPasswordDialog: false,
      userInfo: {},
    };
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
  setup() {
    const userStore = useUserStore();
    const errorStore = useErrorStore();
    const authStore = useAuthStore();

    return { userStore, errorStore, authStore };
  },
  methods: {
    updateUser(userData) {
      console.log("Updating user");
      // remove the role field, can't update this way.
      const submittedData = userData;
      delete submittedData.role;
      this.userStore.setUserInfo(submittedData).then((res) => {
        if (res) {
          this.userStore.fetchUserInfo(this.authStore.user).then((res) => {
            if (res) {
              this.userInfo = res;
            }
          });
        }
      });
    },
    updatePassword(newPass) {
      this.userStore.setUserPassword(newPass, this.authStore.user);
    },
  },
  async mounted() {
    if (this.authStore.authed) {
      this.userStore.fetchUserInfo(this.authStore.user).then((res) => {
        this.userInfo = res;
      });
    }
  },
};
</script>

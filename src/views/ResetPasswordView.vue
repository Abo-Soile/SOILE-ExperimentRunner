<template>
  <div class="flex align-items-center flex-column">
    <div v-if="authed">
      <h1>Enter a new Password for {{ user }}</h1>
      <ResetPassword @updatePassword="updatePassword" />
    </div>
    <div v-else>
      <div v-if="authChecked">Token was invalid</div>
      <div v-else>Checking Token</div>
    </div>
  </div>
</template>
<script>
import ResetPassword from "@/components/ResetPassword.vue";

import { useAuthStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";

export default {
  components: { ResetPassword },
  data() {
    return {
      authChecked: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    const { user, authed } = storeToRefs(authStore);
    const userStore = useUserStore();
    return { authStore, authed, user, userStore };
  },
  methods: {
    async updatePassword(newPassword) {
      // update password
      await this.userStore.setUserPassword(newPassword, this.user);
      // force new login
      await this.authStore.logout();
      // and forward to login mask
      this.$router.push("/login");
    },
  },
  async mounted() {
    const token = this.$route.query.token;
    if (token) {
      await this.authStore.oneTimeAuth(token);
    }
    this.authChecked = true;
  },
};
</script>

<style scoped></style>

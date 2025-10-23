<template>
  <div class="flex align-items-center flex-column">
    <Login class="flex align-items-center" @submitted="$router.push('/')" />
    <router-link class="flex" to="/register" @click="showLoginDialog = false"
      >No Account? Register here</router-link
    >
    <router-link
      class="flex"
      to="/forgot_password"
      @click="showLoginDialog = false"
      >Forgot password? Click here</router-link
    >
  </div>
</template>
<script>
import Login from "@/components/LoginForm.vue";

export default {
  components: { Login },
};
</script>

<style scoped></style>

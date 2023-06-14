<template>
  <form
    :action="
      'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=' +
      { googleClientID }
    "
  >
    <button class="googleButton" id="googleButton">
      <img src="images/btn_google_signin_light_normal_web.png" />
    </button>
  </form>
</template>
<script>
export default {
  name: 'GoogleOAuthButton',
  props: {
    googleClientID: {
      type: String,
      required: true
    },
    googleRedirectAddress: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.googleButton {
  border: none;
  padding: 0px;
}
</style>

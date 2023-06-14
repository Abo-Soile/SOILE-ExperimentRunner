<template>
  <form
    :action="
      'https://sandbox.orcid.org/oauth/authorize?client_id=' +
      { orcidClientID } +
      '&response_type=code&scope=/authenticate&redirect_uri=' +
      { orcidRedirectAddress }
    "
  >
    <button class="orcidbutton">
      Login with Orcid<img src="images/ORCID_LOGO.png" />
    </button>
  </form>
</template>

<script>
export default {
  name: "OrcidOAuthButton",
  props: {
    orcidClientID: {
      type: String,
      required: true,
    },
    orcidRedirectAddress: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
.orcidButton {
  border: none;
  padding: 0px;
}
</style>

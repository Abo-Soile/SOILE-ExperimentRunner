<template>
  <div class="oAuthDiv">
    <a class="oAuthButton" id="orcidAuthButton" :href="oAuthURL">
      <img :src="image" height="30" />{{ Welcome }}</a
    >
  </div>
</template>
<script>
export default {
  name: 'OAuthButton',
  props: {
    oAuthURL: {
      type: String,
      required: true
    },
    Welcome: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.oAuthButton {
  font: bold 14px Arial;
  text-decoration: none;
  background-color: #ffffff;
  color: #242424;
  padding: 10px 5px 10px 5px;
  border-top: 1px solid #cccccc;
  border-right: 1px solid #333333;
  border-bottom: 1px solid #333333;
  border-left: 1px solid #cccccc;
}
.oAuthDiv {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>

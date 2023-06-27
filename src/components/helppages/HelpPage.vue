<template>
  <div class="w-full">
    <img class="w-9" width="80%" :src="screenshot" />
    <div class="w-full" v-html="html"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      html: "",
    };
  },
  computed: {
    screenshot() {
      return "/help/" + this.$router.currentRoute.value.name + ".jpg";
    },
  },
  methods: {
    async fetchHTML() {
      const response = await fetch(
        "/help/" + this.$router.currentRoute.value.name + ".html"
      );
      const text = await response.text();
      console.log(text);
      this.html = text;
    },
  },
  mounted() {
    this.fetchHTML();
  },
};
</script>

<template>
  <Button
    v-if="hasHelp"
    icon="pi pi-question-circle"
    @click="showHelp = true"
  ></Button>
  <Dialog v-if="hasHelp" v-model:visible="showHelp" class="w-9">
    <div class="w-full">
      <img v-if="hasScreenShot" class="w-9" width="80%" :src="screenshot" />
      <div class="w-full" v-html="html"></div>
    </div>
  </Dialog>
</template>

<script>
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
  components: { Button, Dialog },
  data() {
    return {
      html: "",
      hasHelp: false,
      hasScreenShot: false,
      showHelp: false,
    };
  },
  computed: {
    screenshot() {
      return "/help/" + this.$router.currentRoute.value.name + ".jpg";
    },
  },
  methods: {
    fetchHTML(route) {
      fetch("/help/" + route.name + ".html")
        .then(async (response) => {
          this.html = await response.text();
        })
        .catch((err) => {
          this.hasHelp = false;
        });
    },
    checkHTML(route) {
      fetch("/help/" + route.name + ".html", { method: "HEAD" })
        .then(async (response) => {
          if (response.ok) {
            this.hasHelp = true;
          } else {
            this.hasHelp = false;
          }
        })
        .catch((err) => {
          this.hasHelp = false;
        });
    },
    checkScreenShot(route) {
      fetch(this.screenshot, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            this.hasScreenShot = true;
          } else {
            this.hasScreenShot = false;
          }
        })
        .catch((err) => {
          this.hasScreenShot = false;
        });
    },
  },
  watch: {
    $route(to, from) {
      this.checkHTML(to);
      this.checkScreenShot(to);
    },
    showHelp() {
      this.fetchHTML(this.$route);
    },
  },
  mounted() {
    console.log(this.$route);
    if (this.$route.name) {
      this.checkHTML(this.$route);
      this.checkScreenShot(this.$route);
    }
  },
};
</script>

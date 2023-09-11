<template>
  <button
    v-if="hasHelp"
    :class="buttonClass"
    :style="buttonStyle"
    @click="showHelp = true"
  >
    <i class="pi pi-question-circle"></i>
  </button>
  <Dialog v-if="hasHelp" v-model:visible="showHelp" class="w-9">
    <div class="w-full">
      <img v-if="hasScreenShot" class="w-9" width="80%" :src="screenshot" />
      <div class="w-full" v-html="html"></div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

export default {
  components: { Dialog },
  props: {
    helpSubject: {
      type: String,
      required: true,
    },
    buttonClass: {
      type: String,
      default: "",
    },
    buttonStyle: {
      type: String,
      default: "",
    },
  },
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
      return "/help/" + this.helpSubject + ".jpg";
    },
  },
  methods: {
    fetchHTML() {
      fetch("/help/" + this.helpSubject + ".html")
        .then(async (response) => {
          this.html = await response.text();
        })
        .catch((err) => {
          this.hasHelp = false;
        });
    },
    checkHTML() {
      fetch("/help/" + this.helpSubject + ".html", { method: "HEAD" })
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
    checkScreenShot() {
      fetch(this.screenshot, { method: "HEAD" })
        .then((response) => {
          console.log(response);
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
    showHelp() {
      this.fetchHTML();
    },
  },
  mounted() {
    this.checkHTML();
    this.checkScreenShot();
  },
};
</script>

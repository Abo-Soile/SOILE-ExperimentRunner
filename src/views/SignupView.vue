<template>
  <div v-if="selectedStudy">
    <StudyDescription v-if="signedUpStudies.includes(selectedStudy.UUID)"
    :selectedStudy="selectedStudy"
    :justSignedUp="justSignedUp"
    @signUp="signUp"
    >
    </StudyDescription>   
  </div>
  <router-link v-else to="/">{{ $t("backToMain") }}</router-link>
</template>

<script>
import { getMarkDownContent } from "@/helpers/markDownHelper";
import Button from "primevue/button";
import StudyDescription from "@/components/signup/StudyDescription.vue"
import { useProjectStore, useAuthStore, useLanguageStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";

export default {
  data() {
    return {
      selectedStudy: undefined,
      justSignedUp: false,
    };
  },
  computed: {
    isSignedUp() {
      if (this.selectedStudy) {
        if (
          this.signedUpStudies.find((x) => x.UUID === this.selectedStudy.UUID)
        ) {
          return true;
        }
      }
      return false;
    },
    markdownDescription() {
      return getMarkDownContent(this.selectedStudy.description);
    },
  },
  methods: {
    startProject(uuid) {
      this.justSignedUp = false;
    },
    signUp(UUID, token) {
      console.log("Trying to auth with " + UUID + "/" + token);
      this.authStore.signUp(UUID, token).then(async (res) => {
        if (res) {
          console.log("Signup successfull");
          this.justSignedUp = true;
          await this.authStore.refreshSession();
          await this.projectStore.fetchSignedUpStudies();
          await this.projectStore.updateTaskSettings(UUID);

          if (token) {
            await this.projectStore.updateAvailableStudies();
            this.selectedStudy = await this.projectStore.getStudyDetails(
              this.$router.currentRoute.value.params.id
            );
            this.languageStore.setLocale(this.selectedStudy.language);
          }
        } else {
          console.log("Signup unsuccessful");
        }
      });
    },
  },
  components: { Button, StudyDescription },
  async beforeRouteEnter(to) {},
  setup() {
    const authStore = useAuthStore();
    const projectStore = useProjectStore();
    const languageStore = useLanguageStore();
    const { signedUpStudies: signedUpStudies } = storeToRefs(projectStore);
    return { authStore, projectStore, signedUpStudies, languageStore };
  },
  async mounted() {
    this.justSignedUp = !this.isSignedUp;
    const currentRoute = this.$router.currentRoute.value;
    const token = currentRoute.query.token;
    if (token) {
      // we have a signup with a token. Directly sign up to this project with the token, and display retrieved information.
      console.log("Signing up to study");
      await this.signUp(currentRoute.params.id, token);
      // need to do this here, since otherwise it cannot be accessed.
    } else {
      await this.projectStore.updateAvailableStudies();
      await this.projectStore.fetchSignedUpStudies();
      this.selectedStudy = this.projectStore.getStudyDetails(
        currentRoute.params.id
      );

      this.languageStore.setLocale(this.selectedStudy.language);
    }
  },
};
</script>

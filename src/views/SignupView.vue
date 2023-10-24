<template>
  <div v-if="selectedStudy">
    <StudyDescription
      :selectedStudy="selectedStudy"
      :accessToken="accessToken"
      @signUp="signUp"
    >
    </StudyDescription>
  </div>
  <div v-else>
    <TokenSignup
      :studyID="routeID"
      @loginSuccess="
        (accessToken) => updateSelectedStudy(true, routeID, accessToken)
      "
    >
    </TokenSignup>
    <router-link to="/">{{ $t("backToMain") }}</router-link>
  </div>
</template>

<script>
import { getMarkDownContent } from "@/helpers/markDownHelper";
import Button from "primevue/button";
import StudyDescription from "@/components/signup/StudyDescription.vue";
import TokenSignup from "@/components/signup/TokenSignup.vue";
import { useProjectStore, useAuthStore, useLanguageStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";

export default {
  data() {
    return {
      selectedStudy: undefined,
      accessToken: undefined,
      signUpToken: "",
      routeID: "",
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
    signUp(UUID, token) {
      console.log("Trying to auth with " + UUID + "/" + token);
      this.authStore.signUp(UUID, token).then(async (res) => {
        if (res) {
          console.log("Signup successfull");
          this.updateSelectedStudy(token, UUID);
        } else {
          console.log("Signup unsuccessful");
        }
      });
    },
    async updateSelectedStudy(token, UUID, accessToken) {
      this.accessToken = accessToken;
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
    },
  },

  components: { Button, StudyDescription, TokenSignup },
  async beforeRouteEnter(to) {},
  setup() {
    const authStore = useAuthStore();
    const projectStore = useProjectStore();
    const languageStore = useLanguageStore();
    const { signedUpStudies: signedUpStudies } = storeToRefs(projectStore);
    return { authStore, projectStore, signedUpStudies, languageStore };
  },
  async mounted() {
    const currentRoute = this.$router.currentRoute.value;
    this.routeID = currentRoute.params.id;
    const token = currentRoute.query.token;
    this.signUpToken = token;
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
      if (this.selectedStudy) {
        this.languageStore.setLocale(this.selectedStudy.language);
      }
    }
  },
};
</script>

<template>
  <div v-if="!authStore.isUser() && authStore.isAuthed()"></div>
  <div class="mt-3">
    {{ $t("tokenRequired") }}
    <div class="mt-3">
      <InputText class="mr-1" v-model="token"></InputText>
      <Button @click="signUpOrLogin">{{ $t("submit") }}</Button>
    </div>
  </div>
</template>

<script>
import { getMarkDownContent } from "@/helpers/markDownHelper";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useProjectStore, useAuthStore, useErrorStore } from "@/stores";

export default {
  props: {
    studyID: { type: String, required: true },
  },
  data() {
    return {
      token: "",
    };
  },
  emits: ["loginSuccess"],
  methods: {
    async signUpOrLogin() {
      if (this.token === "") {
        this.errorStore.raiseError("error", "Need a token for signup");
        return;
      } else {
        var accessSuccess = false;
        accessSuccess = await this.authStore.signUp(
          this.studyID,
          this.token,
          true
        );
        if (!accessSuccess) {
          if (this.authStore.isUser()) {
            // a user should not have gotten an access token, and those are incompatible
            this.errorStore.raiseError(
              "error",
              "The provided token was not a valid sign up token. Since you are logged in, you cannot use an Access token, as those are for anonymous use."
            );
            return;
          }
          if (this.authStore.isAuthed()) {
            this.errorStore.raiseError(
              "warn",
              "Only one study can be active for anonymous use at each time. Logging out of the old study."
            );
            await this.authStore.logout();
          }
          // a user never gets an access token, so we are ok.
          this.authStore.setProjectToken(this.token);
          console.log("Tying to refresh the login using an access token");
          await this.authStore.updateLoginStatus();
          if (!this.authStore.authed) {
            this.errorStore.raiseError(
              "error",
              "The provided token was neither a valid sign up token nor a valid access token"
            );
            // potentially reroute to main page.
            return;
          } else {
            await this.projectStore.fetchSignedUpStudies();
            await this.projectStore.updateAvailableStudies();
            console.log("Fetching study updates");
            console.log(
              this.projectStore.signedUpStudies.includes(this.studyID)
            );
            console.log(
              this.projectStore.availableStudies
                .map((x) => x.shortCut)
                .includes(this.studyID)
            );
            if (
              this.projectStore.signedUpStudies.includes(this.studyID) || // we are now signed up to this study - acces via study ID
              this.projectStore.availableStudies
                .map((x) => x.shortcut)
                .includes(this.studyID) // the studyID is the shortCut and it is now available.
            ) {
              this.$emit("loginSuccess");
            } else {
              this.errorStore.raiseError(
                "error",
                "The provided token was an access token to a different study."
              );
              // potentially reroute to main page.
              return;
            }
          }
        } else {
          this.$emit("loginSuccess", this.authStore.projectToken);
          return;
        }
      }
    },
  },
  components: { Button, InputText },
  setup() {
    const projectStore = useProjectStore();
    const authStore = useAuthStore();
    const errorStore = useErrorStore();
    return { projectStore, authStore, errorStore };
  },
};
</script>

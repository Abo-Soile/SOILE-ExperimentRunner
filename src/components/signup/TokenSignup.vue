<template>
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
          // a user never gets an access token, so we are ok.
          this.authStore.setProjectToken(this.token);
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
            if (
              this.projectStore.signedUpStudies.includes(studyID) || // we are now signed up to this study - acces via study ID
              this.projectStore.availableStudies
                .map((x) => x.shortCut)
                .includes(studyID) // the studyID is the shortCut and it is now available.
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
    return { authStore, authStore, errorStore };
  },
};
</script>

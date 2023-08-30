<template>
  <div v-if="selectedProject">
    <h2>{{ selectedProject.name }}</h2>
    <p>{{ selectedProject.description }}</p>
    <!-- TODO: check whether already signed up if user is logged in or authed in a different way-->
    <div v-if="signedUpStudies.includes(selectedProject.UUID)">
      <div v-if="authStore.isAnonymous">
        <h2>Your token for this Project is:</h2>
        <p style="color: red">{{ authStore.projectToken }}</p>
        <h4>
          Note this token carfully as it is needed to continue if you quit your
          current execution.
        </h4>
      </div>
      <router-link
        :to="
          '/exp/' +
          selectedProject.UUID +
          '/' +
          projectStore.currentTaskSettings.id +
          '/'
        "
        custom
        v-slot="{ navigate }"
        @click="startProject(selectedProject.UUID)"
      >
        <Button v-if="justSignedUp" @click="navigate" role="link"
          >Start project</Button
        >
        <Button v-else @click="navigate" role="link">Continue project</Button>
      </router-link>
    </div>
    <div v-else>
      <Button v-if="authStore.user" @click="signUp(selectedProject.UUID)"
        >Sign up as user</Button
      >
      <Button v-else @click="signUp(selectedProject.UUID)">Sign up</Button>
    </div>
  </div>
  <router-link v-else to="/">Back to Start</router-link>
</template>

<script>
import Button from "primevue/button";
import { useProjectStore, useAuthStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";

export default {
  data() {
    return {
      selectedProject: undefined,
      justSignedUp: false,
    };
  },
  computed: {
    isSignedUp() {
      if (this.selectedProject) {
        if (
          this.signedUpStudies.find((x) => x.UUID === this.selectedProject.UUID)
        ) {
          return true;
        }
      }
      return false;
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
            this.selectedProject = await this.projectStore.getStudyDetails(
              this.$router.currentRoute.value.params.id
            );
          }
        } else {
          console.log("Signup unsuccessful");
        }
      });
    },
  },
  components: { Button },
  async beforeRouteEnter(to) {},
  setup() {
    const authStore = useAuthStore();
    const projectStore = useProjectStore();
    const { signedUpStudies: signedUpStudies } = storeToRefs(projectStore);
    return { authStore, projectStore, signedUpStudies };
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
      this.selectedProject = this.projectStore.getStudyDetails(
        currentRoute.params.id
      );
    }
  },
};
</script>

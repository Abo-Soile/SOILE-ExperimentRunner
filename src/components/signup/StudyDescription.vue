<template>
    <div>
    <h2>{{ selectedStudy.name }}</h2>
        <div v-html="markdownDescription"> </div>    
        <div v-if="signedUpStudies.includes(selectedStudy.UUID)">
          <div v-if="authStore.isAnonymous">
            <h2>{{ $t("tokenInfo") }}</h2>
            <p style="color: red">{{ authStore.projectToken }}</p>
            <h4>
              {{ $t("tokenReminder") }}
            </h4>
          </div>
          <router-link
            :to="
              '/exp/' +
              selectedStudy.UUID +
              '/' +
              projectStore.currentTaskSettings.id +
              '/'
            "
            custom
            v-slot="{ navigate }"
          >
            <Button v-if="justSignedUp" @click="navigate" role="link">{{
              $t("startStudy")
            }}</Button>
            <Button v-else @click="navigate" role="link"
              >>{{ $t("continueStudy") }}</Button
            >
          </router-link>
        </div>
        <div v-else>
      <Button v-if="authStore.user" @click="$emit('signUp',selectedStudy.UUID)">{{
        $t("signupUser")
      }}</Button>
      <Button v-else @click="$emit('signUp',selectedStudy.UUID)">{{
        $t("signup")
      }}</Button>
    </div>
    </div>
    </template>
    
    
    
    <script>
    import { getMarkDownContent } from "@/helpers/markDownHelper";
    import Button from "primevue/button";
    import { useProjectStore, useAuthStore, useLanguageStore } from "@/stores";
    
    export default {
      props: {    
          selectedStudy: { type: Object,
                            required: true},     
          justSignedUp: {
                type: Boolean,
                required: true,
          }
      },
      emits: [ "signUp"],
      computed: {    
        markdownDescription() {
          return getMarkDownContent(this.selectedStudy.description);
        },
      },
      components: { Button },
      setup() {
        const projectStore = useProjectStore();
        const authStore = useAuthStore();
        return { projectStore, authStore };
      },      

    };

    </script>
    
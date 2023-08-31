<template>
  <div>
    <DataTable :value="items" :editable="true">
      <template #header>
        <div
          class="flex flex-wrap align-items-center justify-content-between gap-2"
        >
          <span class="text-xl text-900 font-bold">Available Studies</span>
          <span v-if="!authStore.user">
            <InputText
              v-model="continueToken"
              placeholder="User Identification Token"
              v-tooltip="
                'If you have already signed up to a project use the token you were provided to continue'
              "
            ></InputText>
            <Button
              label="Set token"
              @click="
                authStore.setProjectToken(continueToken);
                authStore.updateLoginStatus();
                authStore.updateUserData();
              "
            />
          </span>
        </div>
      </template>
      <Column field="name" header="Name">
        <template #body="{ data, index }" let-index="index">
          <span v-tooltip="data.shortDescription">{{ data.name }}</span>
        </template></Column
      >
      <Column header="Sign Up to Study">
        <template #body="{ data, index }" let-index="index">
          <div>
            <router-link v-if="!isSignedUp(data)" :to="'/signup/' + data.UUID"
              >Sign Up</router-link
            >
          </div>
        </template>
      </Column>
      <Column :header="items.some((x) => isSignedUp(x)) ? 'Continue' : ''">
        <template #body="{ data, index }" let-index="index">
          <div>
            <Button
              v-if="isSignedUp(data)"
              label="Continue"
              @click="(event) => runProject(index, event)"
            ></Button>
          </div>
        </template>
      </Column>
      <Column :header="items.some((x) => isSignedUp(x)) ? 'Withdraw' : ''">
        <template #body="{ data, index }" let-index="index">
          <div>
            <Button
              v-if="isSignedUp(data)"
              label="Continue"
              @click="(event) => runProject(index, event)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Column from "primevue/column";

import { router } from "@/helpers";
import { useProjectStore, useAuthStore } from "@/stores";

import { ref } from "vue";

const projectStore = useProjectStore();
const authStore = useAuthStore();
const continueToken = ref(undefined);

const props = defineProps({
  items: {
    type: Array,
  },
});

async function runProject(index, event) {
  if (authStore.authed) {
    console.log("Rerouting to " + props.items[index].UUID);
    await projectStore.updateTaskSettings(props.items[index].UUID);
    router.push(
      "/exp/" +
        props.items[index].UUID +
        "/" +
        projectStore.currentTaskSettings.id +
        "/"
    );
  } else {
    await continueProject(index, event);
  }
}

async function continueProject(index, event) {
  event.preventDefault();
  runProject(index);
}

function isSignedUp(data) {
  console.log(projectStore.signedUpStudies.includes(data.UUID));
  return projectStore.signedUpStudies.includes(data.UUID);
}
</script>

<template>
  <div>
    <DataTable :value="items" :editable="true">
      <Column field="name" header="Name"></Column>
      <Column header="Start">
        <template #body="{ data, index }" let-index="index">
          <div>
            <router-link
              v-if="!isSignedUp(data)"
              :to="'/signup/' + data.uuid"
              @click="projectStore.selectProject(index)"
              >Start</router-link
            >
          </div>
        </template>
      </Column>
      <Column header="Continue">
        <template #body="{ data, index }" let-index="index">
          <div>
            <InputText
              v-if="!authStore.user"
              v-model="continueTokens[index]"
            ></InputText>
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
const projectStore = useProjectStore();
const authStore = useAuthStore();
const continueTokens = {};

const props = defineProps({
  items: {
    type: Array,
  },
});

async function runProject(index, event) {
  if (authStore.authed) {
    console.log("Rerouting to " + props.items[index].uuid);
    await projectStore.updateTaskSettings(props.items[index].uuid);
    console.log(userSprojectStoretore.currentTaskSettings.id);
    router.push(
      "/exp/" +
        props.items[index].uuid +
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
  const continueToken = continueTokens[index];
  console.log("Continuing project: Setting Project token");
  await authStore.setProjectToken(continueToken);
  console.log("Updating login status");
  await authStore.updateLoginStatus();
  console.log("Running project");

  runProject(index);
}

function isSignedUp(data) {
  console.log(projectStore.signedUpStudies.includes(data.uuid));
  return projectStore.signedUpStudies.includes(data.uuid);
}
</script>

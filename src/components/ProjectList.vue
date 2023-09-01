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
              label="Withdraw"
              @click="showWithDrawConfirmation(index)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <ConfirmDialog
    v-if="withDrawConfirm"
    v-model:isVisible="withDrawConfirm"
    :message="
      'Do you really want to withdraw from the following study: ' +
      selectedStudy.name +
      '? All your data and progress will be permanently deleted and your access key will no longer work.'
    "
    title="Withdraw from Study"
    @reject="
      selectedStudy = null;
      withDrawConfirm = false;
    "
    @confirm="confirmWithDraw()"
  ></ConfirmDialog>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Column from "primevue/column";

import { ConfirmDialog } from "@/components/dialogs";
import { router } from "@/helpers";
import { useProjectStore, useAuthStore } from "@/stores";

import { ref } from "vue";

const projectStore = useProjectStore();
const authStore = useAuthStore();
const continueToken = ref(undefined);
const withDrawConfirm = ref(false);
const selectedStudy = ref(null);
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

/**
 * Show the withdraw Confirmation dialog
 * @param {*} index
 * @param {*} event
 */
function showWithDrawConfirmation(index, event) {
  selectedStudy.value = props.items[index];
  withDrawConfirm.value = true;
}

async function confirmWithDraw() {
  await authStore.withdraw(selectedStudy.value.UUID);
  withDrawConfirm.value = false;
}

function isSignedUp(data) {
  console.log(projectStore.signedUpStudies.includes(data.UUID));
  return projectStore.signedUpStudies.includes(data.UUID);
}
</script>

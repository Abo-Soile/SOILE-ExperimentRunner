<template>
  <div>
    <DataTable :value="items" :editable="true">
      <template #header>
        <div
          class="flex flex-wrap align-items-center justify-content-between gap-2"
        >
          <span class="text-xl text-900 font-bold">{{
            $t("availableStudies")
          }}</span>
          <span v-if="!authStore.user">
            <InputText
              v-model="continueToken"
              :placeholder="$t('userIdentificationToken')"
              v-tooltip="$t('tokenTip')"
            ></InputText>
            <Button
              :label="$t('setToken')"
              @click="
                authStore.setProjectToken(continueToken);
                authStore.updateLoginStatus();
                authStore.updateUserData();
              "
            />
          </span>
        </div>
      </template>
      <Column field="name" :header="$t('name')">
        <template #body="{ data, index }" let-index="index">
          <span v-tooltip="data.shortDescription">{{ data.name }}</span>
        </template></Column
      >
      <Column :header="$t('signuptitle')">
        <template #body="{ data, index }" let-index="index">
          <div>
            <router-link
              v-if="!isSignedUp(data)"
              :to="'/signup/' + data.UUID"
              >{{ $t("signup") }}</router-link
            >
          </div>
        </template>
      </Column>
      <Column :header="items.some((x) => isSignedUp(x)) ? $t('proceed') : ''">
        <template #body="{ data, index }" let-index="index">
          <div>
            <Button
              v-if="isSignedUp(data)"
              :label="$t('proceed')"
              @click="(event) => runProject(index, event)"
            ></Button>
          </div>
        </template>
      </Column>
      <Column :header="items.some((x) => isSignedUp(x)) ? $t('withdraw') : ''">
        <template #body="{ data, index }" let-index="index">
          <div>
            <Button
              v-if="isSignedUp(data)"
              :label="$t('withdraw')"
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
    :message="$t('withdrawQuestion', { name: selectedStudy.name })"
    :title="$t('withdrawTitle')"
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
  console.log("Withdrawing");
  await authStore.withdraw(selectedStudy.value.UUID);
  if (!authStore.isUser()) {
    authStore.logout();
  }
  withDrawConfirm.value = false;
  projectStore.fetchSignedUpStudies();
}

function isSignedUp(data) {
  return projectStore.signedUpStudies.includes(data.UUID);
}
</script>

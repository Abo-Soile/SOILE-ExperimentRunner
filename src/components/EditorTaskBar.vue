<template>
  <div class="toolbar">
    <PanelMenu :model="items" class="w-full md:w-15rem" />
    <!-- Left-hand toolbar goes here -->
  </div>
  <PsychoPyImporter
    v-if="showPsychoPyDialog"
    v-model:visible="showPsychoPyDialog"
    @taskCreated="openPsychoPyTask"
  ></PsychoPyImporter>
  <ObjectSelectionDialog
    v-if="showSelector"
    v-model:visible="showSelector"
    :object-type="elementType"
    @selected="elementSelected"
  >
  </ObjectSelectionDialog>
</template>

<script setup>
import PanelMenu from "primevue/panelmenu";

import PsychoPyImporter from "@/components/psychopy/PsychoPyImporter.vue";
import ObjectSelectionDialog from "@/components/utils/ObjectSelectionDialog.vue";

import { ref, computed, reactive } from "vue";

const emit = defineEmits(["createElement", "elementSelected"]);

const showSelector = ref(false);
const showPsychoPyDialog = ref(false);
const elementType = ref("");

function showOpenElementDialog(typeForDialog) {
  elementType.value = typeForDialog;
  showSelector.value = true;
}

function elementSelected(element) {
  if (element) {
    console.log(element);
    element.type = elementType.value;
    emit("elementSelected", element);
    showSelector.value = false;
  } else {
    showSelector.value = false;
  }
}

function openPsychoPyTask(data) {
  elementType.value = "Task";
  console.log(data);
  elementSelected(data);
  showPsychoPyDialog.value = false;
}

const items = computed(() => [
  {
    label: "Project",
    icon: "pi pi-fw pi-tags",
    items: [
      {
        label: "New",
        icon: "pi pi-fw pi-plus",
        command: () => {
          console.log("Trying to create Project");
          emit("createElement", "Project");
        },
      },
      {
        label: "Open",
        icon: "pi pi-fw pi-folder-open",
        command: () => {
          showOpenElementDialog("Project");
        },
      },
    ],
  },
  {
    label: "Tasks",
    icon: "pi pi-fw pi-tag",
    items: [
      {
        label: "New",
        icon: "pi pi-fw pi-plus",
        command: () => {
          console.log("Trying to create Task");
          emit("createElement", "Task");
        },
      },
      {
        label: "Open",
        icon: "pi pi-fw pi-folder-open",
        command: () => {
          showOpenElementDialog("Task");
        },
      },
      {
        label: "Import",
        icon: "pi pi-fw pi-upload",
        items: [
          {
            label: "Import Task",
            command: () => {},
          },
          {
            label: "Import from PsychoJS Folder",
            command: () => {
              console.log("Trying to open PsychoPyDialog");
              showPsychoPyDialog.value = true;
            },
          },
        ],
      },
    ],
  },
  {
    label: "Experiments",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "New",
        icon: "pi pi-fw pi-plus",
        command: () => {
          console.log("Trying to create Experiment");
          emit("createElement", "Experiment");
        },
      },
      {
        label: "Open",
        icon: "pi pi-fw pi-folder-open",
        command: () => {
          showOpenElementDialog("Experiment");
        },
      },
    ],
  },
]);
</script>

<style scoped>
/* Your existing styles for .toolbar go here */
</style>

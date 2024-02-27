<template>
  <div class="toolbar">
    <PanelMenu :model="items" class="w-full md:w-15rem" />
    <!-- Left-hand toolbar goes here -->
  </div>
  <PsychoPyImporter
    v-if="showPsychoPyDialog"
    v-model:visible="showPsychoPyDialog"
    @taskCreated="openTask"
  ></PsychoPyImporter>
  <ObjectSelectionDialog
    v-if="showSelector && elementType !== 'Task'"
    v-model:visible="showSelector"
    :object-type="elementType"
    @selected="openTabForElement"
  >
  </ObjectSelectionDialog>
  <TaskSelectionDialog
    v-if="showSelector && elementType == 'Task'"
    v-model:visible="showSelector"
    :object-type="elementType"
    @selected="openTabForElement"
  >
  </TaskSelectionDialog>
  <TaskUploader
    ref="uploadComponent"
    @elementSelected="openTask"
  ></TaskUploader>
  <TaskCreationDialog
    v-if="showCreationDialog"
    v-model:visible="showCreationDialog"
    @submit="createTask"
    @cancel="showCreationDialog = false"
  ></TaskCreationDialog>
</template>

<script setup>
import PanelMenu from "primevue/panelmenu";

import PsychoPyImporter from "@/components/psychopy/PsychoPyImporter.vue";
import TaskUploader from "@/components/taskeditor/TaskUploader.vue";
import TaskSelectionDialog from "@/components/taskeditor/TaskSelectionDialog.vue";
import TaskCreationDialog from "@/components/taskeditor/TaskPropertyDialog.vue";
import ObjectSelectionDialog from "@/components/dialogs/ObjectSelectionDialog.vue";
import { useEditorStore } from "@/stores";

import { ref, computed, reactive } from "vue";

const showSelector = ref(false);
const showCreationDialog = ref(false);
const showPsychoPyDialog = ref(false);
const elementType = ref("");
const uploadComponent = ref(null);
const editorStore = useEditorStore();

/**
 * Create an element
 * @param {*} type
 */
function createElement(type) {
  console.log("Creating element of type: " + type);
  editorStore.createElement(type);
}

/**
 * Create a Task
 * @param {*} taskData
 */
function createTask(taskData) {
  const data = editorStore.getDefaultDataForType("task");
  console.log(taskData);
  // TODO: Update data with taskData.
  Object.entries(taskData).forEach(([key, value]) => {
    data[key] = value;
  });
  console.log(data);
  editorStore.createElement("task", data);
  showCreationDialog.value = false;
}

/**
 * Show the Dialog to select the Element to Open.
 * @param {*} typeForDialog
 */
function showOpenElementDialog(typeForDialog) {
  elementType.value = typeForDialog;
  showSelector.value = true;
}

/**
 * Open a tab for the indicated element
 * @param {{UUID: string, version: string, name: string}} element the element to load given by its name, version and UUID
 */
function openTabForElement(element) {
  if (element) {
    console.log(element);
    editorStore.loadElement(
      elementType.value,
      element.name,
      element.UUID,
      element.version
    );
    showSelector.value = false;
  } else {
    showSelector.value = false;
  }
}

/**
 * Open a specific Task specified by the Task Data
 * @param {{UUID: string, version: string, name: string}} taskdata The data of the task to load.
 */
function openTask(taskdata) {
  elementType.value = "task";
  openTabForElement(taskdata);
  // close potentially calling Dialogs
  showPsychoPyDialog.value = false;
}

/**
 * We need this wrapper around the function, as putting it directly
 * in the menu-items will fail due to uploadComponent not being defined initially.
 */
function callChildFunction() {
  uploadComponent.value.loadZip();
}

/**
 * The items of the menu
 */
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
          editorStore.createElement("Project");
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
          showCreationDialog.value = true;
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
            command: () => {
              callChildFunction();
            },
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
          editorStore.createElement("Experiment");
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
.p-tabview .p-tabview-panels {
  padding: 0px;
}
</style>

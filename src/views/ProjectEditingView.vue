<template>
  <div class="main-container">
    <ElementEditingMenu
      @createElement="createElement"
      @elementSelected="openSelectionTab"
    />
    <div class="content">
      <TabView class="pb-0" v-model:activeIndex="activeElement">
        <TabPanel
          v-if="editorStore.experiments.elements.length > 0"
          header="Experiments"
        >
          <TabView
            class="pb-0"
            v-model:activeIndex="editorStore.experiments.active"
          >
            <TabPanel
              v-for="(experiment, index) in editorStore.experiments.elements"
            >
              <template #header>
                <span> {{ experiment.name }} </span>
                <Button
                  icon="pi pi-times"
                  @click="closeTab(index, editorStore.experiments)"
                />
              </template>
              <div style="width: 100%; height: 80vh">
                <Editor
                  type="experiment"
                  :newElement="experiment.newElement"
                  :baklava="experiment.editor"
                  :data="experiment.data"
                  :name="experiment.name"
                  @updateElement="
                    (data) => updateElement(data, index, 'experiment')
                  "
                  @createElement="
                    (data) => updateElement(data, index, 'experiment')
                  "
                  @updateName="(name) => updateName(name, index, 'experiment')"
                ></Editor>
              </div>
            </TabPanel>
          </TabView>
        </TabPanel>
        <TabPanel v-if="editorStore.tasks.elements.length > 0" header="Tasks">
          <TabView class="pb-0" v-model:activeIndex="editorStore.tasks.active">
            <TabPanel v-for="(task, index) in editorStore.tasks.elements">
              <template #header>
                <span> {{ task.name }} </span>
                <Button
                  icon="pi pi-times"
                  @click="closeTab(index, editorStore.tasks)"
                />
              </template>
              <div style="width: 100%; height: 80vh">
                <TaskEditor
                  :newElement="task.newElement"
                  :target="task.data"
                  @updateName="(name) => updateName(name, index, 'task')"
                  @updateCurrentVersion="
                    (event) => updateCurrentTaskVersion(event, index, 'task')
                  "
                  @saveTask="(event) => updateElement(event, index, 'task')"
                  @changeTask="(event) => changeElement(event, index, 'task')"
                ></TaskEditor>
              </div>
            </TabPanel>
          </TabView>
          <!-- Content for the Tasks tab goes here -->
        </TabPanel>
        <TabPanel
          v-if="editorStore.projects.elements.length > 0"
          header="Projects"
        >
          <TabView
            class="pb-0"
            v-model:activeIndex="editorStore.projects.active"
          >
            <TabPanel v-for="(project, index) in editorStore.projects.elements">
              <template #header>
                <span> {{ project.name }} </span>
                <Button
                  icon="pi pi-times"
                  @click="closeTab(index, editorStore.projects)"
                />
              </template>
              <div style="width: 100%; height: 80vh">
                <Editor
                  type="project"
                  :newElement="project.newElement"
                  :baklava="project.editor"
                  :data="project.data"
                  :name="project.name"
                  @updateElement="
                    (data) => updateElement(data, index, 'project')
                  "
                  @createElement="
                    (data) => updateElement(data, index, 'project')
                  "
                  @updateName="(name) => updateName(name, index, 'project')"
                ></Editor>
              </div>
              <!-- Content for Sub-Tab 1 goes here -->
            </TabPanel>
          </TabView>
          <!-- Content for the Projects tab goes here -->
        </TabPanel>
      </TabView>
    </div>
    <ConfirmDialog
      :target="currentTarget"
      message="Are you sure you want to close this? All unsaved changes will be lost"
      reject="Cancel"
      :isVisible="showConfirm"
      @confirm="confirmation(true)"
      @reject="confirmation(false)"
    />
  </div>
</template>

<script setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";
import PanelMenu from "primevue/panelmenu";

import { useElementStore, useEditorStore, useGraphStore } from "@/stores";
import { router } from "@/helpers";

import Editor from "@/components/projecteditor/Editor.vue";
import ElementEditingMenu from "@/components/ElementEditingMenu.vue";
import TaskEditor from "@/components/taskeditor/TaskEditor.vue";

import { ref, computed, reactive } from "vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

const elementStore = useElementStore();
const editorStore = useEditorStore();
const graphStore = useGraphStore();
//const experiments = reactive({ active: 0, elements: [] });
//const projects = reactive({ active: 0, elements: [] });
//const editorStore.tasks = reactive({ active: 0, elements: [] });
const currentTarget = ref({});
const showConfirm = ref(false);
const currentSelectedTask = ref(undefined);

const activeElement = computed({
  get() {
    const expOffset = editorStore.experiments.elements.length > 0 ? 1 : 0;
    const taskOffset = editorStore.tasks.elements.length > 0 ? 1 : 0;
    console.log("Updating active Element");
    switch (editorStore.activeElement) {
      case "":
        return 0;
      case "Task":
        handleTaskChange({ index: editorStore.tasks.active });
        return expOffset;
      case "Project":
        handleTypeChange();
        return expOffset + taskOffset;
      case "Experiment":
        handleTypeChange();
        return 0;
    }
  },
  set(newValue) {
    const expOffset = editorStore.experiments.elements.length > 0 ? 1 : 0;
    const taskOffset = editorStore.tasks.elements.length > 0 ? 1 : 0;
    const currentValue = newValue - expOffset - taskOffset;
    if (currentValue == 0) {
      editorStore.activeElement = "Project";
    } else {
      if (currentValue == -1) {
        if (newValue == 1) {
          editorStore.activeElement = "Task";
        } else {
          if (expOffset == 1) {
            editorStore.activeElement = "Experiment";
          } else {
            editorStore.activeElement = "Task";
          }
        }
      } else {
        if (currentValue == -2) {
          editorStore.activeElement = "Experiment";
        }
      }
    }
  },
});

function handleTaskChange(event) {
  // Indices are: Experiment 0, Task: 1, Project 2;
  console.log("Trying to change Tasks");
  console.log(event);
  const currentTask = editorStore.tasks.elements[event.index];
  if (currentTask?.data?.UUID) {
    console.log(currentTask);
    router.push(
      "/editing/" +
        currentTask.data.UUID +
        "/" +
        currentTask.currentVersion +
        "/"
    );
  } else {
    router.push("/editing");
  }
}

function handleTypeChange() {
  // Indices are: Experiment 0, Task: 1, Project 2;
  if (editorStore.activeElement === "Task") {
    if (currentSelectedTask.value) {
      const currentTask = editorStore.tasks.elements[currentSelectedTask];
      console.log(currentTask);
      router.push({
        path:
          "/editing/" +
          currentTask.UUID +
          "/" +
          currentTask.currentVersion +
          "/",
      });
    }
  } else {
    // remove any surplus...
    router.push("/editing");
  }
}

function updateCurrentTaskVersion(version, index) {
  editorStore.updateCurrentTaskVersion(version, index);
  if (editorStore.activeElement === "Task") {
    handleTaskChange({ index: index });
  }
}
async function updateElement(data, index, type) {
  console.log(
    "Changing object at position " + index + " for type " + type + " to:"
  );
  console.log(data);
  const newVersion = await editorStore.saveObject(type, data, index);
}

function createElement(type) {
  console.log("Creating element of type: " + type);
  editorStore.createElement(type);
}

async function changeElement(newObjectInfo, index, type) {
  editorStore.changeElement(
    type,
    newObjectInfo.UUID,
    newObjectInfo.version,
    index
  );
}

function updateName(name, index, type) {
  console.log(
    "Updating name for index " + index + " for type " + type + " to " + name
  );
  const elementStore = editorStore.getStoreForType(type);
  elementStore.elements[index].name = name;
}

function closeTab(index, target) {
  console.log("Trying to close tab");
  console.log(currentTarget);
  console.log("Could set target");
  currentTarget.value = { index: index, target: target };
  showConfirm.value = true;
}
function tabSelected(index, target) {
  console.log("Selected tab " + index);
}
function confirmation(close) {
  console.log("Getting confirmation with value " + close);
  console.log(currentTarget);
  if (close) {
    const currentElement =
      currentTarget.value.target.elements[currentTarget.value.index].data;
    currentTarget.value.target.elements.splice(currentTarget.value.index, 1);
    currentTarget.value.active = currentTarget.value.index - 1;
    const element = {
      UUID: currentElement.UUID,
      version: currentElement.version,
      type: currentTarget.value.target.id,
    };
    if (currentTarget.type == "project") {
      graphStore.removeGraphForElement(element);
    }
  }
  currentTarget.value = {};
  showConfirm.value = false;
}

/**
 * Open a tab for the selected Type of Element in the respective tabs rider.
 * @param {} element
 */
function openSelectionTab(element) {
  console.log(element);
  editorStore.loadElement(
    element.type,
    element.name,
    element.UUID,
    element.version
  );
}
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
}

.content {
  flex: 1;
  padding: 20px;
  padding-bottom: 0px;
}

.p-tabview .p-tabview-panels {
  padding: 0px;
}
</style>

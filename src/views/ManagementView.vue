<template>
  <div class="main-container">
    <div class="toolbar">
      <PanelMenu :model="items" class="w-full md:w-15rem" />
      <!-- Left-hand toolbar goes here -->
    </div>
    <div class="content">
      <TabView class="pb-0" v-model:activeIndex="activeElement">
        <TabPanel  v-if="editorStore.experiments.elements.length > 0" header="Experiments">
          <TabView class="pb-0" v-model:activeIndex="editorStore.experiments.active">
            <TabPanel  v-for="(experiment, index) in editorStore.experiments.elements">
              <template #header>
                <span> {{ experiment.name }} </span>
                <Button icon="pi pi-times" @click="closeTab(index, editorStore.experiments)" />
              </template>
              <div style="width:100%; height:80vh">
                <Editor type="experiment" 
                        :newElement="experiment.newElement" 
                        :baklava=experiment.editor 
                        :data=experiment.data 
                        :name="experiment.name" 
                        :index=index 
                        @updateElement="updateElement" 
                        @createElement="createElement"
                        @updateName="(event) => updateName(event, 'experiment')"></Editor>
              </div>
            </TabPanel>
          </TabView>
        </TabPanel>
        <TabPanel  v-if="editorStore.tasks.elements.length > 0" header="Tasks">
          <TabView class="pb-0" v-model:activeIndex="editorStore.tasks.active">
            <TabPanel  v-for="(task, index) in editorStore.tasks.elements">
              <template #header>
                <span> {{ task.name }} </span>
                <Button icon="pi pi-times" @click="closeTab(index, editorStore.tasks)" />
              </template>
              <div style="width:100%; height:80vh">
                <TaskEditor :newElement=task.newElement 
                :target="task.data" 
                :index="index" 
                @updateName="(event) => updateName(event, 'task')"              
                ></TaskEditor>
              </div>
            </TabPanel>
          </TabView>
          <!-- Content for the Tasks tab goes here -->
        </TabPanel>
        <TabPanel  v-if="editorStore.projects.elements.length > 0" header="Projects">
          <TabView class="pb-0" v-model:activeIndex="editorStore.projects.active">
            <TabPanel  v-for="(project, index) in editorStore.projects.elements">
              <template #header>
                <span> {{ project.name }} </span>
                <Button icon="pi pi-times" @click="closeTab(index, editorStore.projects)" />
              </template>
              <div style="width:100%; height:80vh">
                <Editor type="project" :newElement="project.newElement" :baklava=project.editor :data=project.data :name="project.name" :index="index" @updateElement="updateElement" @createElement="createElement" @updateName="(event) => updateName(event, 'project')"></Editor>
              </div>
              <!-- Content for Sub-Tab 1 goes here -->
            </TabPanel>
          </TabView>
          <!-- Content for the Projects tab goes here -->
        </TabPanel>
      </TabView>
    </div>
    <ConfirmDialog :target=currentTarget message="Are you sure you want to close this? All unsaved changes will be lost"
      reject="Cancel" :isVisible=showConfirm @confirm="confirmation(true)" @reject="confirmation(false)" />
    <ObjectSelectionDialog v-model:visible="showSelector" :object-type="elementType" @selected="openSelectionTab"></ObjectSelectionDialog>
  </div>
</template>
  
<script setup >
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';

import { useElementStore, useEditorStore } from "@/stores";

import Editor from "@/components/projecteditor/Editor.vue"

import TaskEditor from "@/components/taskeditor/TaskEditor.vue"

import { ref, computed, reactive } from "vue";
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import ObjectSelectionDialog from '../components/utils/ObjectSelectionDialog.vue';


const elementStore = useElementStore();
const editorStore = useEditorStore();
//const experiments = reactive({ active: 0, elements: [] });
//const projects = reactive({ active: 0, elements: [] });
//const editorStore.tasks = reactive({ active: 0, elements: [] });
const currentTarget = ref({});
const showConfirm = ref(false);
const elementType = ref('');
const showSelector = ref(false);
const activeElement = computed (() => {
  const expOffset = editorStore.experiments.elements.length > 0 ? 1 : 0;
  const taskOffset = editorStore.tasks.elements.length > 0 ? 1 : 0;
  switch(editorStore.activeElement)
  {
    case "": return 0;
    case "Task": return expOffset
    case "Project": return expOffset + taskOffset
    case "Experiment": return 0
  }
})
function closeTab(index, target) {
  console.log("Trying to close tab")
  console.log(currentTarget)
  console.log("Could set target")
  currentTarget.value = { index: index, target: target };
  showConfirm.value = true;
}
function tabSelected(index, target) {
  console.log("Selected tab " + index)
}
function confirmation(close) {
  console.log("Getting confirmation with value " + close)
  console.log(currentTarget)
  if (close) {
    currentTarget.value.target.elements.splice(currentTarget.value.index, 1);
    currentTarget.value.active = currentTarget.value.index - 1;
  }
  currentTarget.value = {};
  showConfirm.value = false;
}
//const editorStore.projectsPresent = computed(() => editorStore.projects.length > 0
function showOpenElementDialog(typeForDialog)
{
  elementType.value = typeForDialog;
  showSelector.value = true;
}

async function updateElement(updateEvent)
{
  console.log(updateEvent);
  const newVersion = await editorStore.saveObject(updateEvent.type, updateEvent.data, updateEvent.index)  
}

async function createElement(createData)
{
  console.log(createData)
  const newVersion = await editorStore.createObject(createData.type, createData.data, createData.index)  

}

/**
 * Open a tab for the selected Type of Element in the respective tabs rider. 
 * @param {} element 
 */
function openSelectionTab(element)
{
  console.log(element)
  if(element)
  {
    editorStore.loadElement(elementType.value, element.name, element.uuid, element.version)
    showSelector.value = false;
  } 
  else{
    showSelector.value = false;
  } 
}

function updateName(data, type)
{
  console.log("Updating name for index " + data.index + " for type " + type + " to " + data.name)
  const elementStore = editorStore.getStoreForType(type);
  elementStore.elements[data.index].name = data.name;
}

const items = computed(() => [
  {
    label: 'Project',
    icon: 'pi pi-fw pi-tags',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          console.log("Tring to create Project")
          editorStore.createElement("Project")
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open',
        command: () => {
          showOpenElementDialog("Project");
        }
      },
    ]
  },
  {
    label: 'Tasks',
    icon: 'pi pi-fw pi-tag',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          console.log("Tring to create Project")
          editorStore.createElement("Task")
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open',
        command: () => {
          showOpenElementDialog("Task");
        }
      },
    ]
  },
  {
    label: 'Experiments',
    icon: 'pi pi-fw pi-user',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          console.log("Tring to create Project")
          editorStore.createElement("Experiment")
          
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open',
        command: () => {
          showOpenElementDialog("Experiment");
        }
      },
    ]
  }
]);


</script>

<script>

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
  
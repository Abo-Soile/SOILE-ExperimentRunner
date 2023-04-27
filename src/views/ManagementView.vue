<template>
  <div class="main-container">
    <div class="toolbar">
      <PanelMenu :model="items" class="w-full md:w-25rem" />
      <!-- Left-hand toolbar goes here -->
    </div>
    <div class="content">
      <TabView>
        <TabPanel v-if="experiments.length > 0" header="Experiments">
          <TabView v-model:activeIndex="activeExperiment">
            <TabPanel v-for="(experiment, index) in experiments">
              <template #header>
                <span> {{ experiment.name }} </span>
                <Button icon="pi pi-cog" @click="changeExperiment(index)" />
                <Button icon="pi pi-times" @click="closeTab(index, experiments)" />                
              </template>
              <Editor name="experiment.name"></Editor>
            </TabPanel>
          </TabView>
        </TabPanel>
        <TabPanel v-if="tasks.length > 0" header="Tasks">
          <TabView v-model:ctiveIndex="activeTask">
            <TabPanel v-for="(task, index) in tasks">
              <template #header>
                <span> {{ task.name }} </span>
                <Button icon="pi pi-cog" @click="changeTask(index)" />
                <Button icon="pi pi-times" @click="closeTab(index, tasks)" />                
              </template>
            </TabPanel>
          </TabView>
          <!-- Content for the Tasks tab goes here -->
        </TabPanel>
        <TabPanel v-if="projects.elements.length > 0" header="Projects">
          <TabView  v-model:activeIndex="projects.active">
            <TabPanel v-for="(project, index) in projects.elements">
              <template #header>
                <span> {{ project.name }} </span>
                <Button icon="pi pi-cog" @click="changeProject(index)" />
                <Button icon="pi pi-times" @click="closeTab(index, projects)" />                
              </template>
              <Editor name="project.name"></Editor>
              <!-- Content for Sub-Tab 1 goes here -->
            </TabPanel>
          </TabView>
          <!-- Content for the Projects tab goes here -->
        </TabPanel>
      </TabView>
    </div>
    <ConfirmDialog 
    :target=currentTarget 
    message="Are you sure you want to close this? All unsaved changes will be lost" 
    reject="Cancel"
    :isVisible=showConfirm 
    @confirm="confirmation(true)"
    @reject="confirmation(false)"
    />
  </div>
</template>
  
<script setup >
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';
import Editor from "@/components/projecteditor/Editor.vue"
import { useGraphStore } from "@/stores/graph.ts";


import { ref, computed, reactive } from "vue";
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';

const experiments = reactive({ active: 0, elements: []});
const projects = reactive({ active: 0, elements: []});
const tasks = reactive({ active: 0, elements: []});
const graphStore = useGraphStore();
const currentTarget = ref({});
const showConfirm = ref(false);
function createElement(prefix, element) {  
  const existentNames = element.elements.map((x) => x.name)
  const name = uniqueID(prefix, existentNames);
  element.elements.push({name: name});
  element.active = element.elements.length -1;
}

function uniqueID(prefix, existing) {
  var i = 1;
  // ugly but we need unique names.
  while ([...existing.values()].some(v => v === prefix + " " + i)) {
    i = i + 1;
  }
  return prefix + " " + i;
}

function closeTab (index, target) {
  console.log("Trying to close tab")
  console.log(currentTarget)
    console.log("Could set target")
    currentTarget.value = {index: index, target: target};
    showConfirm.value = true;      
}
function tabSelected (index, target) {
  console.log("Selected tab " + index)  
}
function confirmation(close)
{
  console.log("Getting confirmation with value " + close)
  console.log(currentTarget)
  if(close)
  {
    currentTarget.value.target.elements.splice(currentTarget.value.index,1);  
    currentTarget.value.active = currentTarget.value.index -1;
  }
  currentTarget.value = {};
  showConfirm.value = false;
}
//const projectsPresent = computed(() => projects.length > 0)

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
          createElement("Project", projects)
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open'
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
          createElement("Task", tasks)
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open'
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
          createElement("Experiment", experiments)
        }
      },
      {
        label: 'Open',
        icon: 'pi pi-fw pi-folder-open'
        
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

.toolbar {
  width: 250px;
  /* Add any styles you need for the left-hand toolbar */
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
  
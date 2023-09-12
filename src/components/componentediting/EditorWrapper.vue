<template>
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
              @click="closeTab(index, editorStore.experiments, 'experiment')"
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
              @click="closeTab(index, editorStore.tasks, 'task')"
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
    <TabPanel v-if="editorStore.projects.elements.length > 0" header="Projects">
      <TabView class="pb-0" v-model:activeIndex="editorStore.projects.active">
        <TabPanel v-for="(project, index) in editorStore.projects.elements">
          <template #header>
            <span> {{ project.name }} </span>
            <Button
              icon="pi pi-times"
              @click="closeTab(index, editorStore.projects, 'project')"
            />
          </template>
          <div style="width: 100%; height: 80vh">
            <Editor
              type="project"
              :newElement="project.newElement"
              :baklava="project.editor"
              :data="project.data"
              :name="project.name"
              @updateElement="(data) => updateElement(data, index, 'project')"
              @createElement="(data) => updateElement(data, index, 'project')"
              @updateName="(name) => updateName(name, index, 'project')"
            ></Editor>
          </div>
          <!-- Content for Sub-Tab 1 goes here -->
        </TabPanel>
      </TabView>
      <!-- Content for the Projects tab goes here -->
    </TabPanel>
  </TabView>
  <ConfirmDialog
    :target="currentTarget"
    message="Are you sure you want to close this? All unsaved changes will be lost"
    reject="Cancel"
    :isVisible="showConfirm"
    @confirm="closeConfirmation(true)"
    @reject="closeConfirmation(false)"
  />
</template>
<script setup></script>

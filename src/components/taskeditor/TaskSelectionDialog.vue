<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :header="'Select ' + objectType"
    :style="{ width: '80vw' }"
  >
    <div class="grid w-full">
      <TaskTable class="col-6" v-model:selectedTask="selectedTask"></TaskTable>
      <div v-if="selected" class="flex flex-column col-6">
        <div class="grid w-full">
          <div class="col-2 font-bold">Name:</div>
          <div class="col-10">{{ selected.name }}</div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Created:</div>
          <div class="col-10">
            {{ selected ? new Date(selected.created).toString() : "" }}
          </div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Language:</div>
          <div class="col-10">{{ selected.language }}</div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Task Type:</div>
          <div class="col-10">{{ selected.type }}</div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Code Type:</div>
          <div class="col-10">{{ selected.codeType.language }}</div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Keywords:</div>
          <div class="col-10">
            {{ selected ? selected.keywords.join(",") : "" }}
          </div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Description:</div>
          <div class="col-10">{{ selected.description }}</div>
        </div>
        <div class="grid w-full">
          <div class="col-2 font-bold">Version to load:</div>
          <div class="col-10">
            <VersionSelector
              objectType="Task"
              :element="selected"
              v-model:version="currentVersion"
            ></VersionSelector>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="$emit('selected', false)"
        text
      />
      <Button
        label="Select"
        icon="pi pi-check"
        @click="$emit('selected', selectionValid ? selected : false)"
        autofocus
        :disabled="!selectionValid"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import TaskTable from "./TaskTable.vue";
import { useElementStore } from "../../stores";
import { VersionSelector } from "@/components/utils";

export default {
  components: { Button, Dialog, VersionSelector, TaskTable },
  emits: ["selected", "update:visible"],
  props: {
    objectType: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const elementStore = useElementStore();
    return { elementStore };
  },
  data() {
    return {
      selected: undefined,
      selectedTask: undefined,
      currentData: undefined,
      currentVersion: undefined,
    };
  },
  watch: {
    selectedTask(newValue) {
      if (newValue) {
        this.currentVersion = undefined;
        this.elementStore.getTaskOptions(newValue.UUID).then((options) => {
          const newestVersion = options
            .filter((x) => x.tag)
            .reduce((newest, currentVersion) => {
              if (!newest || currentVersion.date > newest.date) {
                return currentVersion;
              }
              return newest;
            }, null);
          this.currentVersion = {
            version: newestVersion.version,
            tag: newestVersion.tag,
          };
        });
      }
    },
    currentVersion(newValue) {
      if (newValue) {
        this.elementStore
          .getElement(this.selectedTask.UUID, newValue.version, "task")
          .then((currentElement) => {
            this.selected = currentElement;
          });
      }
    },
  },
  methods: {
    setSelected(selected) {
      console.log(selected);
      this.selected = selected;
    },
  },
  computed: {
    selectionValid() {
      if (this.selected?.UUID && this.currentVersion?.version) {
        return true;
      } else {
        return false;
      }
    },
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>

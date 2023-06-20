<template>
  <Tree
    v-model:selection-keys="selectedElements"
    :value="currentSelectionView"
    selectionMode="checkbox"
  >
    <template #default="slotProps">
      <div v-if="slotProps.node.type === 'participant'">
        {{ slotProps.node.label }}
        <i v-if="slotProps.node.data" class="pi pi-check"></i>
      </div>
      <div v-else>
        {{ slotProps.node.label }}
      </div>
    </template>
  </Tree>
  <Button
    :disabled="!tasksSelected && !participantsSelected"
    label="Download selected Data"
    @click="downloadSelected"
  ></Button>
  <Button label="Download all Data" @click="downloadAll"></Button>
  <div class="grid" v-for="download in downloads">
    <div class="col">{{ download.id }}</div>
    <div class="col">
      <ProgressSpinner
        v-if="!download.ready"
        style="width: 30px; height: 30px"
      ></ProgressSpinner>
      <Button
        v-else-if="download.errors.length == 0"
        icon="pi pi-download"
        severity="success"
        @click="studyStore.downloadResults(studyID, download.id)"
      ></Button>
      <div v-else>
        <Button
          icon="pi pi-times"
          severity="danger"
          rounded
          @click="removeDowload(download)"
          v-tooltip="download.errors"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "primevue/tree";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

import { useStudyStore } from "@/stores";
import { reactive } from "vue";
export default {
  components: { Tree, Button, ProgressSpinner },
  props: {
    availableData: {
      type: Object,
      required: true,
    },
    studyID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedData: {},
      selectedElements: null,
      selectedTasks: null,
      downloads: [],
      errorInformation: [],
    };
  },
  computed: {
    participantSelectionView() {
      if (!this.availableData.participants) {
        return [];
      }
      const participants = [];
      const participantElement = {
        key: "Participants",
        label: "Participants",
        icon: "pi pi-user",
        type: "group",
        children: participants,
      };
      this.availableData.participants.forEach((participant) => {
        participants.push({
          key: participant.participantID,
          label: participant.participantID,
          type: "participant",
          data: participant.finished,
          icon: "pi pi-user",
        });
      });
      return participantElement;
    },
    taskSelectionView() {
      if (!this.availableData.tasks) {
        return [];
      }
      const tasks = [];
      const taskElement = {
        key: "Tasks",
        label: "Tasks",
        icon: "pi pi-folder",
        children: tasks,
      };
      this.availableData.tasks.forEach((task) => {
        tasks.push({
          key: task.taskID,
          label: task.taskName,
          type: "element",
          data: task.taskID,
          icon: "pi pi-document",
        });
      });
      return taskElement;
    },
    currentSelectionView() {
      if (this.tasksSelected) {
        return [this.taskSelectionView];
      } else {
        if (this.participantsSelected) {
          return [this.participantSelectionView];
        } else {
          return [this.taskSelectionView, this.participantSelectionView];
        }
      }
    },
    tasksSelected() {
      return this.selectedElements != null && "Tasks" in this.selectedElements;
    },
    participantsSelected() {
      return (
        this.selectedElements != null && "Participants" in this.selectedElements
      );
    },
  },
  watch: {
    studyID(newValue) {
      if (newValue != this.studyID) {
        this.downloads = [];
      }
    },
  },
  methods: {
    downloadSelected() {
      // download whatever was selected, either tasks or participants.
      const request = {};
      if ("Tasks" in this.selectedElements) {
        const tasks = [];
        for (const task of Object.keys(this.selectedElements)) {
          if (task != "Tasks") {
            tasks.push(task);
          }
        }
        request.tasks = tasks;
      } else {
        const participants = [];
        for (const participant of Object.keys(this.selectedElements)) {
          if (participant != "Participants") {
            participants.push(participant);
          }
        }
        request.participants = participants;
      }
      this.download(request);
    },
    downloadAll() {
      this.waitingForDL = true;
      this.download("all");
    },
    async download(request) {
      const downloadID = await this.studyStore.requestDownload(
        this.studyID,
        request
      );
      if (downloadID) {
        const currentDownload = reactive({
          id: downloadID,
          request: request,
          ready: false,
          errors: [],
        });
        this.downloads.push(currentDownload);
        this.checkDownloadReady(currentDownload);
      }
    },
    removeDownload(download) {
      download.canceled = true;
      const dlIndex = downloads.indexOf(download);
      if (dlIndex >= 0) {
        downloads.splice(dlIndex, 1);
      }
    },

    checkDownloadReady(download) {
      if (download.canceled) {
        return;
      }
      this.studyStore
        .requestDownloadStatus(this.studyID, download.id)
        .then((response) => {
          if (response) {
            // download is ready. can now download it.
            if (response.status === "downloadReady") {
              download.ready = true;
            } else {
              // the download failed for some reason.
              if (response.status === "failed") {
                download.errors = response.problems;
              } else {
                // still collecting or setting up
                setTimeOut(this.checkDownloadReady, 2000, download);
              }
            }
          }
        });
    },
    showError(errors) {
      this.errorInformation = errors;
    },
  },
  setup() {
    const studyStore = useStudyStore();
    return { studyStore };
  },
  mounted() {},
};
</script>

<style scoped>
.displaypart {
  margin: 2 auto;
  border: 1 solid;
}
.studydisplay {
  min-height: 50vh;
  height: 100%;
}
</style>

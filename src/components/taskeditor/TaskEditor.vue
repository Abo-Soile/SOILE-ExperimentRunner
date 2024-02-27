<template>
  <div class="grid">
    <div class="col-12">
      <TaskBar
        v-model:codeType="currentObject.codeType.language"
        v-model:codeVersion="currentObject.codeType.version"
        v-model:task="currentTask"
        v-model:taskVersion="currentVersion"
        v-model:valid="isValid"
        :codeTypeOptions="codeOptions"
        :newTask="newElement"
        @save="updateTagsAndShowSave"
        @changeTaskVersion="
          (event) =>
            $emit('changeTask', { version: event, UUID: currentObject.UUID })
        "
        @reload="reload"
        @download="download"
        @editProperties="showProperties = true"
      >
      </TaskBar>
    </div>
  </div>
  <div v-if="isValid" class="grid taskdisplay">
    <div class="displaypart col-2 h-full">
      <FileBrowser
        @fileSelected="preview"
        @createFile="createFile"
        @deleteFile="deleteFile"
        @editFile="editFile"
        :fileStructure="files"
      />
      <FilePreview v-if="previewFile" :file="previewFile"></FilePreview>
    </div>
    <div class="col-6 h-full">
      <DataEditor
        v-model:sourceCode="currentObject.code"
        :sourceLanguage="currentObject.codeType.language"
        :tabs="editedFiles"
        @saveFile="saveEditedFile"
        @saveSource="updateTagsAndShowSave"
        @closeFile="closeEditedFile"
        @updateData="updateEditedFile"
        v-model:selectedFile="activeFile"
      ></DataEditor>
    </div>
    <div class="col-4 h-full">
      <CodePreview
        class="h-full preview"
        :sourceCode="currentObject.code"
        :codeType="currentObject.codeType.language"
        :codeTypeVersion="currentObject.codeType.version"
        :taskUUID="currentObject.UUID"
        :taskVersion="currentObject.version"
        :canRun="canRun"
      >
      </CodePreview>
    </div>
  </div>
  <ElementSaveDialog
    v-if="showSave"
    v-model:visible="showSave"
    :name="this.currentObject.name"
    :currentTags="currentTags"
    @submit="saveTask"
  />
  <ConfirmDialog
    v-if="confirmClose"
    v-model:isVisible="confirmClose"
    message="This will discard any changes made since the file was last changed. Do you want to close the file anyways?"
    @reject="
      confirmClose = false;
      currentClose = undefined;
    "
    @confirm="closeFile(currentClose)"
  />
  <TaskPropertyDialog
    v-if="showProperties"
    :initialValues="currentObject"
    v-model:visible="showProperties"
    @submit="updateProperties"
  ></TaskPropertyDialog>
</template>

<script>
import Menu from "primevue/menu";

import FileBrowser from "@/components/utils/filebrowser/FileBrowser.vue";
import FilePreview from "@/components/utils/filebrowser/FilePreview.vue";
import CodeEditor from "./CodeEditor.vue";
import CodePreview from "./CodePreview.vue";
import TaskPropertyDialog from "./TaskPropertyDialog.vue";
import TaskBar from "./TaskBar.vue";
import DataEditor from "./DataEditor.vue";
import { ElementSaveDialog, ConfirmDialog } from "@/components/dialogs";

import { useElementStore, useErrorStore, useEditorStore } from "@/stores";
import { isVideo, isImage, isText } from "@/helpers/mimeHelper.js";

import { reactive } from "vue";
import { storeToRefs } from "pinia";

export default {
  data() {
    return {
      editedFiles: reactive([]),
      files: [],
      previewFile: undefined,
      isValid: false,
      currentTags: [],
      showSave: false,
      confirmClose: false,
      currentClose: undefined,
      activeFile: 0,
      showProperties: false,
    };
  },
  setup(props) {
    const elementStore = useElementStore();
    const errorStore = useErrorStore();
    const editorStore = useEditorStore();
    const currentObject = reactive(JSON.parse(JSON.stringify(props.target)));
    currentObject.codeType = reactive(currentObject.codeType);
    const { codeOptions } = storeToRefs(elementStore);
    return {
      errorStore,
      elementStore,
      currentObject,
      editorStore,
      codeOptions,
    };
  },
  emits: ["updateName", "updateCurrentVersion", "saveTask", "changeTask"],
  components: {
    ElementSaveDialog,
    CodePreview,
    FileBrowser,
    FilePreview,
    CodeEditor,
    TaskBar,
    DataEditor,
    ConfirmDialog,
    TaskPropertyDialog,
  },
  props: {
    target: {
      type: Object,
      required: false,
    },
    newElement: {
      type: Boolean,
      requied: true,
    },
  },
  computed: {
    currentTask: {
      get() {
        return { name: this.currentObject.name, UUID: this.currentObject.UUID };
      },
      set(newValue) {
        console.log("Getting new Task value: ");
        console.log(newValue);
        // UUID Can NEVER be set here. This needs to come through an update in the target prop.
        if (this.currentObject.UUID == null || this.currentObject.UUID === "") {
          console.log("Emitting name update");
          this.currentObject.name = newValue.name;
          this.$emit("updateName", newValue.name);
        }
      },
    },
    currentVersion: {
      get() {
        return {
          version: this.currentObject.version,
          tag: this.currentObject.tag,
        };
      },
      set(newValue) {
        this.currentObject.version = newValue;
        this.$emit("updateCurrentVersion", newValue);
      },
    },
    canRun() {
      return this.currentObject.UUID != null;
    },
  },
  methods: {
    updateProperties(data) {
      console.log(data);
      Object.entries(data).forEach(([key, value]) => {
        this.currentObject[key] = value;
      });
      this.showProperties = false;
    },
    download() {
      this.elementStore.downloadTask(
        this.currentObject.UUID,
        this.currentObject.version
      );
    },
    updateEditedFile(event) {
      this.editedFiles[event.index].data = event.value;
      this.editedFiles[event.index].modified = true;
    },
    saveEditedFile(file) {
      if (file.modified) {
        const fileBlob = new Blob([file.data]);
        const updatedFile = new File([fileBlob], file.filename, {
          type: file.type,
        });
        console.log({ targetName: file.fullpath, file: file });
        this.createFile({
          targetName: file.fullpath,
          files: [{ name: file.fullpath, file: updatedFile }],
        });
        file.modified = false;
      }
    },
    /**
     * Load the file indicated by the filename. The filename has to be absolute wrt the
     * resource folder of the edited task.
     */
    editFile(filePath) {
      const itemIndex = this.editedFiles.findIndex(
        (x) => x.fullpath == filePath
      );
      if (itemIndex < 0) {
        const parts = filePath.split("/");
        const filename = parts[parts.length - 1];
        this.elementStore
          .getResourceFile(this.target.UUID, this.target.version, filePath)
          .then((data) => {
            //console.log(data);
            this.previewFile = data;
            this.editedFiles.push({
              data:
                data.type === "application/json"
                  ? JSON.stringify(data.data, null, 2)
                  : data.data,
              filename: filename,
              modified: false,
              type: data.type,
              fullpath: filePath,
            });
            this.activeFile = this.editedFiles.length;
          });
      } else {
        this.activeFile = itemIndex + 1;
      }
    },
    closeEditedFile(file) {
      if (file.modified && !this.confirmClose) {
        this.currentClose = file;
        this.confirmClose = true;
      } else {
        this.closeFile(file);
      }
    },
    /**
     * Close (i.e. remove it from the list) the indicated file
     * @param {*} file
     */
    closeFile(file) {
      const closedIndex = this.editedFiles.indexOf(file);
      this.editedFiles.splice(closedIndex, 1);
      this.activeFile = closedIndex; // this is the one to the left
      this.confirmClose = false;
    },
    updateFiles(target) {
      console.log("Updating files");
      if (!this.newElement) {
        this.elementStore
          .getFilesForTask(target.UUID, target.version)
          .then((files) => {
            console.log(files);
            this.files = { children: files };
          });
      } else {
        this.files = { children: [] };
        console.log(this.files);
      }
    },
    updateFields(newValue) {
      Object.keys(newValue).forEach((x) => {
        if (x != "codeType") {
          this.currentObject[x] = newValue[x];
        } else {
          Object.keys(newValue[x]).forEach((cx) => {
            this.currentObject[x][cx] = newValue[x][cx];
          });
        }
      });
      console.log("Forcing update");
      console.log(this.currentObject);
      this.$forceUpdate();
    },
    createFile(event) {
      if (this.newElement) {
        this.errorStore.raiseError(
          "warn",
          "You must first create the task before adding files"
        );
        return;
      }
      console.log(event.files.length);
      for (const f of event.files) {
        console.log(f);
      }
      console.log(event);

      this.elementStore
        .addFileToTask(
          this.currentObject.UUID,
          this.currentObject.version,
          event.targetName,
          event.files
        )
        .then((newVersion) => {
          this.currentVersion = newVersion;
          this.updateFiles(this.currentObject);
        });
    },
    deleteFile(event) {
      console.log(event);
      this.elementStore
        .removeFileFromTask(
          this.currentObject.UUID,
          this.currentObject.version,
          event.targetName
        )
        .then((newVersion) => {
          this.currentVersion = newVersion;
          this.updateFiles(this.currentObject);
        });
    },
    /**
     * TODO: Do not load binary objects....
     * @param {*} event
     */
    preview(event) {
      console.log(event);
      if (isText(event.mimeType)) {
        this.elementStore
          .getResourceFile(
            this.target.UUID,
            this.currentObject.version,
            event.file
          )
          .then((data) => {
            console.log(data);
            this.previewFile = data;
          });
      } else {
        const url = this.elementStore.getResourceURL();
        this.previewFile = {
          url: url,
          filename: event.file,
          type: event.mimeType,
        };
      }
    },
    getCodeTypeObject() {
      return {
        language: this.currentObject.codeType.language,
        version: this.currentObject.codeType.version,
      };
    },
    async updateCurrentTags() {
      if (this.currentObject.UUID) {
        this.currentTags = await this.elementStore.getTagsForElement(
          this.currentObject.UUID,
          "task"
        );
      } else {
        this.currentTags = [];
      }
    },
    /**
     * Tell the editing store to reload this task, using the original version of the element
     * To return to the last saved state.
     */
    reload() {
      console.log("Reloading Task");
      this.$emit("changeTask", {
        version: this.target.version, // this is the last saved version. Currentobject might have a version from added files.
        UUID: this.currentObject.UUID,
      });
      this.updateFiles(this.target);
      this.updateFields(this.target);
      console.log("Setting currentobject.code to " + this.target.code);
      this.currentObject.code = this.target.code;
    },
    async updateTagsAndShowSave() {
      await this.updateCurrentTags();
      this.showSave = true;
    },
    async saveTask(newTag) {
      this.showSave = false;
      this.currentObject.tag = newTag;
      this.$emit("saveTask", this.currentObject);
    },
  },
  watch: {
    target: {
      handler(newValue) {
        console.log("Target has been updated");
        this.updateFiles(newValue);
        this.updateFields(newValue);
      },
    },
    isValid(newVal) {
      console.log("isValid changed to " + newVal);
    },
  },
  mounted() {
    this.updateFiles(this.target);
    this.updateFields(this.target);
    this.elementStore.updateCodeOptions();
    console.log("Displaying task");
  },
};
</script>

<style>
.container {
  margin: 0 auto;
}

.displaypart {
  margin: 2 auto;
  border: 1 solid;
}

.taskdisplay {
  min-height: 50vh;
  height: 100%;
}
.preview {
  max-width: 33vw;
  margin: 2 auto;
  border: 1 solid;
}
</style>

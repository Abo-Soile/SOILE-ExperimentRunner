<template>
  <ScrollPanel
    class="filebrowser"
    style="width: 100%; height: 100%"
    @dragenter.prevent
    @dragover.prevent
    @drop.prevent
  >
    File Browser
    <ul class="borderless">
      <FileItem
        v-for="file in files.children"
        :key="file.id"
        :file="file"
        @file-click="handleFileClick"
        @file-double-click="handleDoubleClick"
        @createFile="createFile"
        @deleteFile="deleteFile"
        @editFile="editFile"
        @createDirectory="createDirectory"
      />
      <FileAndDirectoryCreationItems
        @createDirectory="
          (event) =>
            createDirectory({
              folder: '',
              file: fileStructure,
              folderName: event,
            })
        "
        @createFile="
          (event) =>
            createFile({ folder: '', file: fileStructure, addedFiles: event })
        "
      />
    </ul>
  </ScrollPanel>
</template>

<script>
import FileItem from "./FileItem.vue";
import Inputtext from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";
import FileAndDirectoryCreationItems from "./FileAndDirectoryCreationItems.vue";

export default {
  props: {
    fileStructure: {
      type: Object,
      required: true,
    },
  },
  components: {
    FileItem,
    FileAndDirectoryCreationItems,
    ScrollPanel,
  },
  data() {
    return {
      isCreatingDirectory: false,
      files: [],
      currentTree: [],
    };
  },
  mounted() {
    // Populate initial file structure
    this.updateTree(this.fileStructure);
  },
  methods: {
    handleFileClick(element) {
      const file = element.file;
      const folder = element.folder;
      console.log(element);
      if (file.children) {
        file.open = !file.open; // Toggle directory open state
      } else {
        this.$emit("fileSelected", {
          file: element.folder + element.file.label,
          mimeType: element.mimeType,
        });
      }
    },
    handleDoubleClick(file) {
      if (file.isDirectory) {
        file.open = true; // Open the directory
      } else {
        // Handle file double-click
        console.log("File double-clicked:", file);
      }
    },
    updateTree(newTree) {
      this.files = newTree;
      this.currentTree = newTree;
    },
    createFile(source) {
      this.$emit("createFile", {
        targetName: source.folder,
        files: source.addedFiles,
      });
      console.log(source);
    },
    editFile(source) {
      this.$emit("editFile", source.folder + source.file.label);
      console.log(source);
    },
    deleteFile(source) {
      console.log(source);
      this.$emit("deleteFile", {
        targetName: source.folder + source.file.label,
      });
      console.log(source);
    },
    createDirectory(source) {
      source.file.children.push({ label: source.folderName, children: [] });
      console.log(source);
    },
  },
  watch: {
    // update the structure if it changes.
    fileStructure(newValue) {
      this.updateTree(newValue);
    },
  },
};
</script>

<style scoped>
.filebrowser {
  border: 1px solid;
}
.borderless {
  list-style-type: none;
  padding: 0;
}
</style>

<style>
.clickable {
  cursor: pointer;
}
</style>

<template>
  <li>
    <span
      class="clickable"
      @click="handleClick"
      @dblclick="handleDoubleClick"
      @contextmenu="handleRightClick"
    >
      <i :class="getFileIconClass"></i>
      {{ file.label }}
      <ContextMenu
        v-if="!isDirectory"
        global
        ref="menu"
        :model="menuOptions"
      ></ContextMenu>
    </span>
    <ul v-if="isDirectory && file.open">
      <FileItem
        v-for="subfile in file.children"
        :key="subfile.key"
        :file="subfile"
        @file-click="(event) => reEmitWithUpdatedPath('file-click', event)"
        @file-double-click="
          (event) => reEmitWithUpdatedPath('file-double-click', event)
        "
        @deleteFile="(event) => reEmitWithUpdatedPath('deleteFile', event)"
        @createDirectory="
          (event) => reEmitWithUpdatedPath('createDirectory', event)
        "
        @createFile="(event) => reEmitWithUpdatedPath('createFile', event)"
        @editFile="(event) => reEmitWithUpdatedPath('editFile', event)"
      />
      <FileAndDirectoryCreationItems
        @createDirectory="createDirectory"
        @createFile="createFile"
      />
    </ul>
  </li>
</template>

<script>
import ContextMenu from "primevue/contextmenu";
import FileAndDirectoryCreationItems from "./FileAndDirectoryCreationItems.vue";
import mime from "mime";
import { isText } from "@/helpers/mimeHelper.js";
import { ref } from "vue";
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      menuOptions: [
        { label: "Rename(Not Implemented yet)", icon: "pi pi-fw pi-search" },
        {
          label: "Delete",
          icon: "pi pi-fw pi-trash",
          command: () => this.deleteFile(),
        },
      ],
    };
  },
  components: { FileAndDirectoryCreationItems, ContextMenu },
  computed: {
    mimeType() {
      return mime.getType(this.file.label);
    },
    isText() {
      return isText(this.mimeType);
    },
    getFileIconClass() {
      if (this.isDirectory) {
        if (this.file.open) {
          return "pi pi-folder-open";
        } else {
          return "pi pi-folder"; // Replace with appropriate icon class for directories
        }
      } else {
        // Determine file type and return corresponding icon class (maybe we get some lib for this (later on))

        if (this.mimeType) {
          if (this.mimeType.startsWith("video")) {
            return "pi pi-video";
          }
          if (this.mimeType.startsWith("image")) {
            return "pi pi-image";
          }
        }
        return "pi pi-file";
      }
    },
    isDirectory() {
      if (this.file.children) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleClick() {
      this.$emit("file-click", {
        file: this.file,
        mimeType: this.mimeType,
        folder: this.isDirectory ? this.file.label + "/" : "",
      });
    },
    handleDoubleClick() {
      this.$emit("file-double-click", {
        file: this.file.file,
        folder: this.isDirectory ? this.file.label + "/" : "",
      });
    },
    createFile(event) {
      this.$emit("createFile", {
        file: this.file,
        folder: this.isDirectory ? this.file.label + "/" : "",
        addedFiles: event,
      });
    },
    createDirectory(event) {
      this.$emit("createDirectory", {
        file: this.file,
        folder: this.isDirectory ? this.file.label + "/" : "",
        folderName: event,
      });
    },
    deleteFile() {
      console.log("delete Called");
      if (this.isDirectory) {
        // do nothing... for now, this will anyways be removed if empty
      } else {
        this.$emit("deleteFile", {
          file: this.file,
          folder: this.isDirectory ? this.file.label + "/" : "",
        });
      }
    },
    editFile() {
      console.log("edit ");
      if (this.isDirectory) {
        // do nothing... for now, this will anyways be removed if empty
      } else {
        this.$emit("editFile", {
          file: this.file,
          folder: this.isDirectory ? this.file.label + "/" : "",
        });
      }
    },
    handleRightClick(event) {
      if (!this.isDirectory) {
        this.menu.show(event);
      }
    },
    reEmitWithUpdatedPath(eventID, data) {
      data.folder = this.file.label + "/" + data.folder;
      this.$emit(eventID, data);
    },
  },
  mounted() {
    if (this.isText) {
      this.menuOptions.push({
        label: "Edit",
        icon: "pi pi-fw pi-file-edit",
        command: () => this.editFile(),
      });
    }
  },
  setup() {
    const menu = ref();
    return { menu };
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
.clickable {
  cursor: pointer;
}
</style>

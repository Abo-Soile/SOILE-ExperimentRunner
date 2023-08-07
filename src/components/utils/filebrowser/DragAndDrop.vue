<template>
  <div
    class="drag-and-drop"
    @dragenter="handleDragEnter"
    @dragover.prevent
    @drop="handleDrop"
  >
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: "DragAndDrop",
  emits: ["uploadFiles"],
  methods: {
    handleDragEnter(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    async handleDrop(event) {
      event.preventDefault();
      console.log(event.dataTransfer.items);
      const files = event.dataTransfer.items;
      const droppedFiles = [];
      await this.processItems(files, droppedFiles, "");
      console.log(droppedFiles);
      this.$emit("uploadFiles", droppedFiles);
    },
    async processItems(items, filesData, currentFolderPath) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item.isFile) {
          const file = await this.getFileFromEntry(item);
          filesData.push({ file, name: currentFolderPath + item.name });
        } else if (item.isDirectory) {
          await this.processDirectory(
            item,
            filesData,
            currentFolderPath + item.name + "/"
          );
        }
      }
    },
    async getFileFromEntry(fileEntry) {
      return new Promise((resolve) => {
        fileEntry.file((file) => {
          resolve(file);
        });
      });
    },
    async processDirectory(directoryEntry, filesData, currentFolderPath) {
      return new Promise((resolve) => {
        const directoryReader = directoryEntry.createReader();
        directoryReader.readEntries(async (entries) => {
          for (const entry of entries) {
            if (entry.isFile) {
              const file = await this.getFileFromEntry(entry);
              filesData.push({ file, name: currentFolderPath + entry.name });
            } else if (entry.isDirectory) {
              await this.processDirectory(
                entry,
                filesData,
                currentFolderPath + entry.name + "/"
              );
            }
          }
          resolve();
        });
      });
    },
  },
};
</script>

<style></style>

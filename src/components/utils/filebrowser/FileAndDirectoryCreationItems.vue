<template>
  <li>
    <input
      type="file"
      multiple
      @change="createFile"
      ref="fileInput"
      style="display: none"
    />
    <DragAndDrop @uploadFiles="createFiles">
      <template v-slot:content>
        <span class="clickable" @click="selectFile">
          <i class="pi pi-plus"></i>
          Add File or Drop Files/Folders here
        </span>
      </template>
    </DragAndDrop>
  </li>
  <li v-if="isCreatingDirectory">
    <InputText
      @keyup.enter="createDirectory"
      @keyup.escape="isCreatingDirectory = false"
      v-model="directoryName"
    ></InputText>
  </li>
  <li>
    <span class="clickable" @click="isCreatingDirectory = true">
      <i class="pi pi-plus"></i>
      Add Directory
    </span>
  </li>
</template>

<script setup>
import InputText from "primevue/inputtext";
import DragAndDrop from "./DragAndDrop.vue";
import { ref } from "vue";

const emit = defineEmits(["createDirectory", "createFile"]);

const isCreatingDirectory = ref(false);
const directoryName = ref("");
const fileInput = ref(null);

function createDirectory() {
  if (directoryName.value != "") {
    emit("createDirectory", directoryName.value);
  }
  directoryName.value = "";
  isCreatingDirectory.value = false;
}
function createFile(event) {
  event.preventDefault();
  console.log(event);
  if (event.target.files.length == 1) {
    emit("createFile", [
      {
        file: event.target.files[0],
        name: event.target.files[0].name,
      },
    ]);
  } else {
    console.log(
      emit(
        "createFile",
        Array.from(event.target.files).map((x) => {
          return { file: x, name: x.name };
        })
      )
    );
  }
}

function createFiles(event) {
  emit("createFile", event);
}

function selectFile() {
  fileInput.value.click();
}
</script>

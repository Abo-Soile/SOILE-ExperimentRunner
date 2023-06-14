<template>
  <li v-if="isCreatingDirectory">
    <InputText @keyup.enter="createDirectory" v-model="directoryName"></InputText>
  </li>
  <li>
    <span class="clickable" @click="isCreatingDirectory = true">
      <i class="pi pi-plus"></i>
      Add Directory
    </span>
  </li>
  <li>
    <input type="file" @change="createFile" ref="fileInput" style="display: none" />
    <span class="clickable" @click="selectFile">
      <i class="pi pi-plus"></i>
      Add File
    </span>
  </li>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const emit = defineEmits(['createDirectory', 'createFile'])

const isCreatingDirectory = ref(false)
const directoryName = ref('')
const fileInput = ref(null)

function createDirectory() {
  emit('createDirectory', directoryName.value)
  directoryName.value = ''
  isCreatingDirectory.value = false
}
function createFile(event) {
  event.preventDefault()
  console.log(event)
  if (event.target.files.length == 1) {
    emit('createFile', event.target.files[0])
  }
}

function selectFile() {
  fileInput.value.click()
}
</script>

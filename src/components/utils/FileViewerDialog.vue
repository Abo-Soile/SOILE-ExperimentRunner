<template>
  <Dialog v-model:visible="diagvisible">
    <template v-if="isImage">
      <img class="previewitem" :src="sourceFile" alt="Image" />
    </template>
    <template v-else-if="isText">
      <pre class="previewitem">{{ sourceFile.content }}</pre>
    </template>
    <template v-else-if="isVideo">
      <video class="previewitem" controls>
        <source :src="sourceFile" :type="file.type" />
      </video>
    </template>
  </Dialog>
  <Button :label="fileName" @click="viewFile"></Button>
</template>

<script>
import { isVideo, isImage, isText } from "@/helpers/mimeHelper.js";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  components: { Dialog, Button },
  data() {
    return {
      diagvisible: false,
      fileObject: {},
    };
  },
  methods: {
    viewFile() {
      this.diagvisible = true;
    },
  },
  computed: {
    // TODO: We could provide an editor for text files.
    isText() {
      return isText(this.file.type);
    },
    isVideo() {
      return isVideo(this.file.type);
    },
    isImage() {
      return isImage(this.file.type);
    },
    sourceFile() {
      var URL = window.URL || window.webkitURL;
      return URL.createObjectURL(this.file);
    },
  },
  mounted() {},
};
</script>

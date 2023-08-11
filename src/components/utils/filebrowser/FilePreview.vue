<template>
  <div>
    <div v-if="fileContent">
      <h3>File Preview:</h3>
      <template v-if="isImage">
        <img class="previewitem" :src="fileContent" alt="File Preview" />
      </template>
      <template v-else-if="isText">
        <pre class="previewitem">{{ fileContent }}</pre>
      </template>
      <template v-else-if="isVideo">
        <video class="previewitem" controls>
          <source :src="fileContent" :type="file.type" />
        </video>
      </template>
      <template v-else-if="noPreview"> No preview available </template>
    </div>
  </div>
</template>

<script>
import { isVideo, isImage, isText } from "@/helpers/mimeHelper.js";
export default {
  props: {
    file: {
      type: Object,
    },
  },
  data() {
    return {};
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
    fileContent() {
      if (this.noPreview) {
        return false;
      } else {
        if (this.isText) {
          return this.file.data;
        } else {
          return this.file.filename;
        }
      }
    },
    noPreview() {
      return !(this.isText || this.isVideo || this.isImage);
    },
  },
};
</script>

<style scoped>
.previewitem {
  width: 100%;
  overflow: hidden;
  max-height: 100vh;
}
</style>

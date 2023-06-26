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
import xlsx from "node-xlsx";

export default {
  props: {
    file: {
      type: Object,
    },
  },
  data() {
    return {
      excelData: [],
    };
  },
  methods: {
    // Maybe we can do some excel preview in the future and this is somewhat of a start for it...
    processExcelFile(fileData) {
      const workbook = xlsx.parse(fileData);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(excelData);
      this.excelData = excelData;
    },
    convertToBase64(data, format) {
      var base64 = btoa(unescape(encodeURIComponent(data)));
      console.log(base64);
      return `data:${format};base64,${base64}`;
    },
  },
  computed: {
    // TODO: We could provide an editor for text files.
    isText() {
      return (
        this.file.type.startsWith("text/") ||
        this.file.type === "application/javascript" ||
        this.file.type === "application/x-javascript" ||
        this.file.type === "application/json"
      );
    },
    isVideo() {
      return this.file.type.startsWith("video/");
    },
    isImage() {
      return this.file.type.startsWith("image/");
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

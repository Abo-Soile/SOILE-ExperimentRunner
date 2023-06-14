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
      <template v-else-if="noneAvailable"> No preview available </template>
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
      fileContent: undefined,
      isImage: false,
      isText: false,
      noneAvailable: false,
      excelData: [],
    };
  },
  watch: {
    file(newValue) {
      this.updateFile(newValue);
    },
  },
  methods: {
    processExcelFile(fileData) {
      const workbook = xlsx.parse(fileData);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(excelData);
      this.excelData = excelData;
    },
    updateFile(newValue) {
      console.log("updating File");
      this.isImage = false;
      this.isText = false;
      this.noneAvailable = false;

      if (this.file.type.startsWith("image/")) {
        this.isImage = true;
        this.fileContent = "/api/" + this.file.url;
      } else if (this.file.type.startsWith("text/")) {
        this.isText = true;
        this.fileContent = this.file.data;
      } else {
        console.log("No preview available");
        this.noneAvailable = true;
      }
    },
    convertToBase64(data, format) {
      var base64 = btoa(unescape(encodeURIComponent(data)));
      console.log(base64);
      return `data:${format};base64,${base64}`;
    },
  },
  mounted() {
    this.updateFile(this.file);
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

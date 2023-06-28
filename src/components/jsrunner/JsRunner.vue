<template>
  <iframe
    style="width: 100%; height: 100%"
    ref="JSWindow"
    allowfullscreen
    :srcdoc="code"
  >
    <div id="root"></div>
  </iframe>
</template>

<script>
import { useProjectStore } from "@/stores";

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    studyID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      results: {},
      files: [],
    };
  },
  methods: {
    /**
     *
     * @param {*} data the data of the experiment.
     */
    handleData(data) {
      console.log(data);
      // merge the two.
      this.results = { ...this.resuls, ...data };
    },
    /**
     * Submit data
     */
    async submit() {
      try {
        const submitJson = this.buildResults();
        // clean up the page.
        this.$emit("handleSubmit", submitJson);
      } catch (error) {
        console.log(error);
        this.$emit("handleError", error);
      }
    },
    async submitFile(fileName, fileFormat, file) {
      if (this.preview) {
        this.files.push({
          filename: fileName,
          targetid: "temp",
          fileformat: fileFormat,
          file: file,
        });
      } else {
        const fileID = await this.projectStore.uploadData(this.studyID, file);
        this.files.push({
          filename: fileName,
          targetid: fileID,
          fileformat: fileFormat,
        });
      }
    },
    /**
     * @return a json object that can be submitted to the SOILE backend
     */
    buildResults() {
      //TODO: Check whether there is a sensible way to allow outputs to be defined here.
      let jsonResults = [];
      for (let field in this.results) {
        jsonResults.push({ name: field, value: this.results[field] });
      }
      return {
        outputData: [],
        resultData: { fileData: this.files, jsonData: jsonResults },
      };
    },
    handleError(error) {
      this.$emit("handleError", error);
    },
  },
  mounted() {
    const iframeWindow = this.$refs.JSWindow.contentWindow;
    iframeWindow.submitFile = this.submitFile;
    iframeWindow.reportResult = this.handleData;
    iframeWindow.submitResult = this.submit;
    iframeWindow.handleError = this.handleError;
  },
  setup() {
    const projectStore = useProjectStore();
    return { projectStore };
  },
};
</script>

<style scoped></style>

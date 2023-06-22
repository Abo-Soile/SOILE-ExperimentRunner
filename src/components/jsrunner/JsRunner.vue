<template>
  <iframe style="width: 100%" ref="JSWindow" :srcdoc="code">
    <div id="root"></div>
  </iframe>
</template>

<script>
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
  },
  data() {
    return {
      results: null,
      files: [],
    };
  },
  methods: {
    /**
     *
     * @param {*} filename (unused)
     * @param {*} data the data of the experiment.
     * @param {*} mimetype (unused)
     */
    handleData(filename, data, mimetype) {
      console.log(filename);
      console.log(data);
      console.log(mimetype);
      this.results = data;
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
        this.$emit("handleError", error.message);
      }
    },
    async submitFile(fileName, format, fileBlob) {
      if (this.preview) {
        this.files.push({ file });
      } else {
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
        resultData: { fileData: [], jsonData: jsonResults },
      };
    },
  },
  mounted() {
    const iframeWindow = this.$refs.JSWindow.contentWindow;
    iframeWindow.submitFile = this.submitFile;
    iframeWindow.reportResult = this.handleData;
    iframeWindow.submitResults = this.submit;
  },
};
</script>

<style scoped></style>

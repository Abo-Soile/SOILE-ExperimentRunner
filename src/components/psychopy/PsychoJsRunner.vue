<template>
  <iframe
    style="width: 100%; height: 100%"
    ref="psychoJSWindow"
    allowfullscreen
    :srcdoc="code"
  >
    <div id="root"></div>
  </iframe>
</template>

<script>
export default {
  props: {
    psychoJSVersion: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
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
      this.results = JSON.parse(data);
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
    /**
     * Handle an error that happened here.
     * @param {Error} error
     */
    handleError(error) {
      this.$emit("handleError", error);
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
    const iframeWindow = this.$refs.psychoJSWindow.contentWindow;
    iframeWindow.reportResult = this.handleData;
    iframeWindow.submitResult = this.submit;
    iframeWindow.handleError = this.handleError;
  },
};
</script>

<style scoped></style>

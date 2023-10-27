<template>
  <div class="w-full h-full" v-if="!errored">
    <SoileExpRunner
      class="h-full w-full"
      v-if="
        currentTaskSettings.codeType.language == 'elang' &&
        typeof code === 'string'
      "
      :code="code"
      :outputs="currentTaskSettings.outputs"
      :persistentData="currentTaskSettings.persistentData"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="
        (event) =>
          uploadFile(
            event.file,
            event.fileName,
            event.idCallBack,
            event.errorCallBack
          )
      "
    >
    </SoileExpRunner>
    <PsychoJsRunner
      class="h-full w-full"
      v-if="currentTaskSettings.codeType.language == 'psychopy'"
      :code="code"
      :psychoJSVersion="currentTaskSettings.codeType.version"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="(event) => handleUpload(event)"
    >
    </PsychoJsRunner>
    <SoileQuestionnaire
      v-if="currentTaskSettings.codeType.language == 'qmarkup'"
      :code="code"
      :outputs="currentTaskSettings.outputs"
      :persistent="currentTaskSettings.persistentFields"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
    ></SoileQuestionnaire>
    <JsRunner
      class="h-full w-full"
      v-if="currentTaskSettings.codeType.language == 'javascript'"
      :code="code"
      :persistentData="currentTaskSettings.persistentData"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="(event) => handleUpload(event)"
    ></JsRunner>
  </div>
</template>

<script>
import SoileQuestionnaire from "@/components/questionnaire/SoileQuestionnaire.vue";
import SoileExpRunner from "@/components/experimentlang/SoileExpRunner.vue";
import PsychoJsRunner from "@/components/psychopy/PsychoJsRunner.vue";
import JsRunner from "@/components/jsrunner/JsRunner.vue";

/**
 * This component Should encapsulate all possibilities that tasks can have
 * i.e.
 */
export default {
  name: "CodeRunner",
  components: {
    SoileQuestionnaire,
    SoileExpRunner,
    PsychoJsRunner,
    JsRunner,
  },
  props: {
    currentTaskSettings: {
      type: Object,
      required: true,
    },
    code: {
      required: true,
    },
  },
  data() {
    return {
      files: [],
      errored: false,
    };
  },
  emits: ["submitResults", "handleUpload", "handleError"],
  methods: {
    /**
     * This function assumes, that results is an object with the following fields:
     * {
     *  outputData* : [ {name: "someName", value: 123 }],
     *  resultData* : [ {name: "someName", value: "xyz" or [], or {} or 123, timestamp : 12345}]
     *  fileData* : [{fileformat: "someMimeFormat", filename: "someName", targetid: "AnIDObtainedFromUploadData"}]
     * }
     * All fields are optional.
     * @param {*} results
     */
    async submitResults(results) {
      results.resultData.fileData = this.files;
      this.$emit("submitResults", results);
    },
    addFile(filename, fileformat, targetid) {
      this.files.push({ filename, fileformat, targetid });
    },
    // The event contains, the file,the fileformat and  the filename
    handleUpload(event) {
      this.$emit("handleUpload", {
        file: event.file,
        fileName: event.filename,
        idCallBack: (id) => addFile(event.filename, event.fileformat, id),
        errorCallBack: (error) => {
          this.errored = true;
          this.$emit("handleError", error);
        },
      });
    },
    handleError(error) {
      this.$emit("handleError", error);
    },
  },
  mounted() {
    console.log("codeRunner Mounted");
    console.log(this.$route);
  },
  unmounted() {
    console.log("codeRunner unMounted");
  },
};
</script>
<style scoped>
/*
  This should cover the whole area. 
  */
</style>

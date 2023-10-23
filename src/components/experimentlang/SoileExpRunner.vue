<template>
  <iframe
    ref="soilehtml"
    allowfullscreen
    class="experimentview"
    :srcdoc="soilehtml"
  >
  </iframe>
</template>

<script>
import SOILE2Script from "@/helpers/experimentlang/soile2.js?raw";
import soilehtmlpage from "./soile.html?raw";
import testPhase from "./testPhase.js?raw";
import testCode from "./testCode.js?raw";
import levenshtein from "fast-levenshtein";
/**
 * This class is mainly a wrapper around the SOILE elang runtime.
 */
export default {
  name: "SoileExpRunner",
  props: {
    code: {
      type: String,
      required: true,
    },
    outputs: {
      required: true,
      type: Array,
    },
    /**
     * This is an Object with variable names.
     */
    persistentData: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      active: false,
      needToSetHandeler: false,
      soileContentWindow: undefined,
      soileContentDocument: undefined,
      soilehtml: soilehtmlpage,
      soileStyle: null,
      testPhaseScript: null,
      soileScript: null,      
    };
  },
  unmount() {
    this.active = false;
  },

  methods: {
    handleSubmit(data) {
      this.$emit("handleSubmit", data);
    },
    handleError(data) {
      this.$emit("handleError", data);
    },
    setupTask() {
      var iFrame = this.$refs.soilehtml;
      var iFrameWindow = this.soileContentWindow;
      var ve = this;
      var currentCode = this.code;
      var iFrame = this.$refs.soilehtml;

      if (this.soileStyle != null) {
        iFrameDocument.head.removeChild(this.soileStyle);
      }
      if (this.soileScript != null) {
        iFrameDocument.body.removeChild(this.soileScript);
      }
      if (this.testPhaseScript != null) {
        iFrameDocument.body.appendChild(this.testPhaseScript);
      }
      iFrame.onload = function () {
        var iFrameDocument =
          iFrame.contentDocument || iFrame.contentWindow.document;
        // add Soile Styles
        this.soileStyle = iFrameDocument.createElement("link");
        this.soileStyle.setAttribute("rel", "stylesheet");
        this.soileStyle.setAttribute("href", "/soile.css");
        iFrameDocument.head.appendChild(this.soileStyle);
        // Add Soile Source code
        console.log("Iframe Loaded");
        this.soileScript = iFrameDocument.createElement("script");
        this.soileScript.type = "text/javascript";
        this.soileScript.id = "SOILE";
        this.soileScript.innerHTML = SOILE2Script;
        iFrameDocument.body.appendChild(this.soileScript);
        // Run the Soile script.
        this.testPhaseScript = iFrameDocument.createElement("script");
        this.testPhaseScript.type = "text/javascript";
        this.testPhaseScript.id = "testPhase";
        this.testPhaseScript.innerHTML = testPhase;
        iFrameDocument.body.appendChild(this.testPhaseScript);
        console.log("Starting Experiment Language task");
        iFrameWindow.start(currentCode);
      };
    },
  },
  watch: {
    persistentData(newValue) {
      this.soileContentWindow.persistentData = { ...newValue };
    },
    outputs(newValue) {
      this.soileContentWindow.outputs = newValue;
    },
    code() {
      setupTask();
    },
  },
  mounted() {
    this.soileContentWindow = this.$refs.soilehtml.contentWindow;
    this.soileContentDocument = this.soileContentWindow.document;
    this.soileContentWindow.handleSubmit = this.handleSubmit;
    this.soileContentWindow.handleError = this.handleError;
    this.soileContentWindow.levenshtein = this.levenshtein;
    this.soileContentWindow.outputs = this.outputs;    
    this.soileContentWindow.persistentData = { ...this.persistentData };
    this.soileContentWindow.soileconfig = {
      startText : this.$i18n.t("startNext")
    }
    this.setupTask();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scope>
.h3 {
  margin: 40px 0 0;
}

.ul {
  list-style-type: none;
  padding: 0;
}

.li {
  display: inline-block;
  margin: 0 10px;
}

.a {
  color: #42b983;
}

*.hiddenelem {
  visibility: hidden;
}
*.invisibleElement {
  visibility: hidden;
}

.experimentview {
  width: 100%;
  height: 100%;
}
</style>

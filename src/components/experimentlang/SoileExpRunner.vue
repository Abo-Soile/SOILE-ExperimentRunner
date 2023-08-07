<template>
  <iframe ref="soilehtml" class="experimentview" :srcdoc="soilehtml"> </iframe>
</template>

<script>
import SOILE2Script from "@/helpers/experimentlang/soile2.js?raw";
import soilehtmlpage from "./soile.html?raw";
import testPhase from "./testPhase.js?raw";
import testCode from "./testCode.js?raw";
import levenshtein from "fast-levenshtein";
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
  },
  mounted() {
    this.soileContentWindow = this.$refs.soilehtml.contentWindow;
    var iFrame = this.$refs.soilehtml;
    var iFrameWindow = this.soileContentWindow;
    var ve = this;
    var currentCode = this.code;
    this.soileContentDocument = this.soileContentWindow.document;
    this.soileContentWindow.handleSubmit = this.handleSubmit;
    this.soileContentWindow.handleError = this.handleError;
    this.soileContentWindow.levenshtein = this.levenshtein;
    this.soileContentWindow.outputs = this.outputs;
    this.soileContentWindow.persistentData = { ...this.persistentData };
    iFrame.onload = function () {
      var iFrameDocument =
        iFrame.contentDocument || iFrame.contentWindow.document;
      // add Soile Styles
      var soileStyle = iFrameDocument.createElement("link");
      soileStyle.setAttribute("rel", "stylesheet");
      soileStyle.setAttribute("href", "/soile.css");
      iFrameDocument.head.appendChild(soileStyle);
      // Add Soile Source code
      console.log("Iframe Loaded");
      const soileScript = iFrameDocument.createElement("script");
      soileScript.type = "text/javascript";
      soileScript.id = "SOILE";
      soileScript.innerHTML = SOILE2Script;
      iFrameDocument.body.appendChild(soileScript);
      // Run the Soile script.
      const currentScript = iFrameDocument.createElement("script");
      currentScript.type = "text/javascript";
      currentScript.id = "testPhase";
      currentScript.innerHTML = testPhase;
      iFrameDocument.body.appendChild(currentScript);
      iFrameWindow.start(currentCode);
    };
    console.log(this.soileContentWindow);
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

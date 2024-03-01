<template>
  <div class="editor">
    <div class="editor-content">
      <div ref="editorContainer" class="textarea-container"></div>
    </div>
  </div>
</template>

<script>
import Textarea from "primevue/textarea";
import { EditorState, Compartment } from "@codemirror/state";
import { htmlLanguage, html } from "@codemirror/lang-html";
import { language } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { EditorView, basicSetup } from "codemirror";

export default {
  components: {
    Textarea,
  },
  data() {
    return {
      editor: null,
      autoLanguage: null,
      languageConf: new Compartment(),
      localtext: "",
    };
  },
  props: {
    inputText: {
      type: String,
      required: true,
    },
    inputLanguage: {
      type: String,
      default: null,
    },
  },
  methods: {
    detectLanguage() {
      const startText = this.text.substring(0, 100);
      let docIsHTML = /^\s*<.*?>/.test(startText); // assume that there is a, reasonably short tag at the start.
      let docIsJSON = /^\s*\{\[/.test(startText); // starts with a parenthesis
      let docIsCSS = /^\s*[\.#].*? \{/.test(startText); // starts with a spec.
      var currentLang = javascript();
      if (docIsHTML) {
        currentLang = html();
      }
      if (docIsJSON) {
        currentLang = json();
      }
      if (docIsCSS) {
        currentLang = css();
      }
      return currentLang;
    },
    dataChanged(cm, changeObj) {
      console.log(cm);
      console.log(changeObj);
    },
  },
  computed: {
    language() {
      if (this.inputLanguage) {
        switch (this.inputLanguage) {
          case "javascript":
            return html();
          case "psychopy":
            return html();
          default:
            return null;
        }
      } else {
        return this.detectLanguage(this.text);
      }
    },
    text: {
      set(newValue) {
        this.$emit("update:inputText", newValue);
      },
      get(newValue) {
        return this.inputText;
      },
    },
  },
  watch: {
    localtext(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$emit("update:inputText", newValue);
      }
    },
  },
  mounted() {
    this.autoLanguage = EditorState.transactionExtender.of((tr) => {
      if (!tr.docChanged) return null;
      return {
        effects: this.languageConf.reconfigure(this.language),
      };
    });
    const listener = EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        // Document changed
        this.text = this.editor.state.doc.toString();
      }
    });
    this.localtext = this.inputText;
    // we only set a language if we can properly detect it.
    // TODO: try to implement language support for elang and qlang
    if (this.language != null) {
      this.editor = new EditorView({
        doc: this.localtext,
        extensions: [
          EditorView.lineWrapping,
          basicSetup,
          this.languageConf.of(this.language),
          this.autoLanguage,
          listener,
        ],
        parent: this.$refs.editorContainer,
      });
    } else {
      this.editor = new EditorView({
        doc: this.localtext,
        extensions: [basicSetup, listener, EditorView.lineWrapping],
        parent: this.$refs.editorContainer,
      });
    }
    /*this.editor.updateListener((value) => {
      console.log(value);
    });*/
    console.log(this.editor);
    //this.editor.addEventListener("input", this.dataChanged);
  },
};
</script>

<style scoped>
.editor {
  font-family: Arial, sans-serif;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.editor-content {
  flex-grow: 1;
  overflow: hidden;
}

.textarea-container {
  height: 100%;
  overflow: auto;
  border: black 1px solid;
}

.textarea-container .p-inputtextarea {
  height: 100%;
  width: 100%;
  resize: none;
}
</style>

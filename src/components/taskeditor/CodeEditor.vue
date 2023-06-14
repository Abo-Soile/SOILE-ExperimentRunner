<template>
  <div class="editor">
    <div class="editor-content">
      <div class="textarea-container">
        <Textarea v-model="text" />
      </div>
    </div>
  </div>
</template>

<script>
import Textarea from "primevue/textarea";

export default {
  components: {
    Textarea,
  },
  props: {
    inputText: {
      type: String,
      required: true,
    },
  },
  methods: {},
  computed: {
    text: {
      set(newValue) {
        this.$emit("update:inputText", newValue);
      },
      get(newValue) {
        return this.inputText;
      },
    },
  },
};
</script>

<style scoped>
.editor {
  font-family: Arial, sans-serif;
  height: 100%;
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
}

.textarea-container .p-inputtextarea {
  height: 100%;
  width: 100%;
  resize: none;
}
</style>

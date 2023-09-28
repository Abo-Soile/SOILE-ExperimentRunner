<template>
  <div>
    <TabView v-model:activeIndex="activeIndex">
      <TabPanel>
        <template #header>
          <span> Source Code </span>
          <Button
            size="small"
            :disabled="!sourceChanged"
            icon="pi pi-save"
            @click="
              $emit('saveSource');
              sourceChanged = false;
            "
          />
        </template>
        <CodeEditor
          :inputText="sourceCode"
          :inputLanguage="sourceLanguage"
          @update:inputText="
            $emit('update:sourceCode', $event);
            sourceChanged = true;
          "
        />
      </TabPanel>
      <TabPanel v-for="(tab, index) in tabs" :key="index">
        <template #header>
          <span v-tooltip="tab.fullpath">
            {{ tab.filename }}
          </span>
          <Button
            size="small"
            icon="pi pi-times"
            @click="$emit('closeFile', tab)"
          />
          <Button
            size="small"
            :disabled="!tab.modified"
            icon="pi pi-save"
            @click="$emit('saveFile', tab)"
          />
        </template>
        <CodeEditor
          :inputText="tab.data"
          @update:inputText="$emit('updateData', { index, value: $event })"
        />
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";

import CodeEditor from "./CodeEditor.vue";

export default {
  components: {
    TabView,
    TabPanel,
    CodeEditor,
    Button,
  },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    selectedFile: {
      type: Number,
      required: true,
    },
    sourceLanguage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sourceChanged: false,
    };
  },
  emits: [
    "update:sourceCode",
    "updateData",
    "closeFile",
    "saveFile",
    "saveSource",
    "update:selectedFile",
  ],
  computed: {
    activeIndex: {
      set(newValue) {
        this.$emit("update:selectedFile", newValue);
      },
      get() {
        return this.selectedFile;
      },
    },
  },
  methods: {},
};
</script>

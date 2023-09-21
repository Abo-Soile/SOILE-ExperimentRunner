<template>
  <div class="grid w-full">
    <QuestionnaireParagraph
      class="col-12 questionnaire"
      v-for="(paragraph, index) in usedCode.elements"
      :key="'paragraph_' + index"
      @dataUpdate="(event) => updateAndCheckData(event)"
      :paragraph_data="paragraph"
    >
    </QuestionnaireParagraph>

    <Button :disabled="!canSubmit" @click="submitForm">{{
      $t("submit")
    }}</Button>
  </div>
</template>

<script>
import QuestionnaireParagraph from "./QuestionnaireParagraph.vue";
import Button from "primevue/button";
export default {
  data() {
    return {
      valuesToStore: {},
      validOptions: {},
      canSubmit: false,
    };
  },
  props: {
    code: {
      required: true,
    },
    outputs: {
      required: true,
      type: Array,
    },
    persistent: {
      type: Array,
      default: [],
    },
  },
  name: "SoileQuestionnaire",
  emits: ["handleSubmit", "handleError"],
  components: { QuestionnaireParagraph, Button },
  methods: {
    updateAndCheckData(event) {
      this.updatetarget(
        this.dbMap[event.target].dbcolumn,
        event.isValid,
        event.value
      );
    },
    updatetarget(relColumn, isValid, value) {
      this.validOptions[relColumn] = isValid;
      if (value != null && value != undefined) {
        this.valuesToStore[relColumn] = value;
      }
      this.updateSubmittable();
    },
    updateSubmittable() {
      for (const toCheck in this.validOptions) {
        if (!this.validOptions[toCheck]) {
          this.canSubmit = false;
          return;
        }
      }

      this.canSubmit = true;
    },

    getSubmitJson() {
      const outputData = [];
      for (const output of this.outputs) {
        if (output in this.valuesToStore) {
          const outValue = this.valuesToStore[output];
          if (isNaN(outValue)) {
            throw new Error(
              "Output values have to be numbers! Received " +
                outValue +
                " for output " +
                output
            );
          }
          outputData.push({ name: output, value: parseFloat(outValue) });
        } else {
          throw new Error(
            "Missing required output " +
              output +
              " cannot submit this questionnaire"
          );
        }
      }
      const persistentData = [];
      for (const output of this.persistent) {
        if (output in this.valuesToStore) {
          const outValue = this.valuesToStore[output];
          persistentData.push({ name: output, value: outValue });
        } else {
          throw new Error(
            "Missing required output " +
              output +
              " cannot submit this questionnaire"
          );
        }
      }
      const jsonData = [];
      for (const result in this.valuesToStore) {
        jsonData.push({ name: result, value: this.valuesToStore[result] });
      }
      return {
        outputData,
        resultData: { fileData: [], jsonData: jsonData },
        persistentData,
      };
    },
    submitForm() {
      try {
        const submitJson = this.getSubmitJson();
        this.$emit("handleSubmit", submitJson);
      } catch (error) {
        this.$emit("handleError", error.message);
      }
    },
  },
  computed: {
    usedCode() {
      if (typeof this.code === "object" && this.code) {
        return this.code;
      } else {
        return { elements: [] };
      }
    },
    dbMap() {
      const entryOptions = {};
      if (this.code) {
        for (const option of this.code.mapping) {
          entryOptions[option.id] = { dbcolumn: option.dbcolumn };
        }
      }
      return entryOptions;
    },
  },
  beforeMount() {
    // reset first
    if (this.code) {
      for (const option of this.code.mapping) {
        this.validOptions[option.dbcolumn] = false;
        // it might already be set, if, we ignore this.
        if (
          (option.defaultValue || option.defaultValue === "") &&
          !(option.dbcolumn in this.valuesToStore)
        ) {
          this.validOptions[option.dbcolumn] = true;
          this.valuesToStore[option.dbcolumn] = option.defaultValue;
        }
      }
    }
    this.updateSubmittable();
  },
  watch: {
    code(newValue) {
      if (newValue) {
        for (const option of newValue.mapping) {
          this.validOptions[option.dbcolumn] =
            this.validOptions[option.dbcolumn] || false;
          if (
            (option.defaultValue || option.defaultValue === "") &&
            !(option.dbcolumn in this.valuesToStore)
          ) {
            this.validOptions[option.dbcolumn] = true;
            this.valuesToStore[option.dbcolumn] = option.defaultValue;
          }
        }
      }
      this.updateSubmittable();
    },
  },
  unmounted() {
    this.validOptions = {};
    this.valuesToStore = {};
  },
};
</script>

<style scoped>
.questionnaire {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
<style>
.questionnaire-label {
  margin-right: 4px;
}
</style>

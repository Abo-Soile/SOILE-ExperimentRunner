<template>
  <Dialog
    v-if="isVisible"
    v-model:visible="isVisible"
    header="Edit Expression for Filter"
    modal
  >
    <FormulaEditor
      @formulaValid="(event) => (formValid = event)"
      v-model:formula="internalFormula"
      :variables="variables"
    ></FormulaEditor>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="handleNoClick" text />
      <Button
        label="Set Expression"
        icon="pi pi-check"
        @click="handleYesClick"
        :disabled="!formValid"
      />
    </template>
  </Dialog>
  <button :class="buttonClass" @click="isVisible = true">
    {{ buttonText }}
  </button>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { FormulaEditor } from "@/components/formulaeditor";

export default {
  name: "FilterEditingDialog",
  components: {
    Dialog,
    Button,
    FormulaEditor,
  },
  emits: ["updateFormula", "reject", "update:isVisible"],
  props: {
    formula: {
      type: String,
      default: "",
    },
    variables: {
      type: Array,
      required: true,
    },
    buttonText: {
      type: String,
      default: "Edit Formula",
    },
    buttonClass: {
      type: String,
      default: "p-button p-component",
    },
  },
  data() {
    return {
      internalFormula: "",
      formValid: false,
      isVisible: false,
    };
  },
  methods: {
    handleYesClick() {
      console.log("Confirm clicked");
      this.$emit("updateFormula", this.internalFormula);
      this.isVisible = false;
    },

    handleNoClick() {
      this.$emit("reject");
      this.isVisible = false;
    },
  },
  mounted() {
    this.internalFormula = this.formula;
  },
};
</script>

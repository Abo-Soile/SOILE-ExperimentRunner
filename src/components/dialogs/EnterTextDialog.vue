<template>
  <Dialog :visible="isVisible" :header="title" modal @hide="input = ''">
    {{ message }}
    <InputText
      v-model="input"
      :class="validationFunction(input) ? '' : 'p-invalid'"
    ></InputText>
    <template #footer>
      <Button :label="reject" icon="pi pi-times" @click="handleNoClick" text />
      <Button
        :label="confirm"
        icon="pi pi-check"
        @click="handleYesClick"
        autofocus
        :disabled="!validationFunction(input)"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

export default {
  name: "ConfirmDialog",
  components: {
    Dialog,
    Button,
    InputText,
  },
  data() {
    return {
      input: "",
    };
  },
  emits: ["confirm", "reject"],
  props: {
    title: {
      type: String,
      default: "Enter Value",
    },
    message: {
      type: String,
      default: "Please enter a value to use",
    },
    confirm: {
      type: String,
      default: "Confirm Selection",
    },
    reject: {
      type: String,
      default: "Cancel",
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
    validationFunction: {
      type: Function,
      default: (value) => true,
    },
  },
  methods: {
    handleYesClick() {
      console.log("Confirm clicked");
      this.$emit("confirm", this.input);
    },

    handleNoClick() {
      this.$emit("reject");
      this.input = "";
    },
  },
};
</script>

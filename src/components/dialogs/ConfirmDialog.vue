<template>
  <Dialog :visible="isVisible" header="Confirm ?" modal>
    {{ message }}
    <template #footer>
      <Button
        :label="confirm"
        icon="pi pi-times"
        @click="handleYesClick"
        text
      />
      <Button
        :label="reject"
        icon="pi pi-check"
        @click="handleNoClick"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

export default {
  name: "ConfirmDialog",
  components: {
    Dialog,
    Button,
  },
  emits: ["confirm", "reject"],
  props: {
    message: {
      type: String,
      default: "Are you sure you want to do this?",
    },
    confirm: {
      type: String,
      default: "Yes",
    },
    reject: {
      type: String,
      default: "No",
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleYesClick() {
      console.log("Confirm clicked");
      this.$emit("confirm");
    },

    handleNoClick() {
      this.$emit("reject");
    },
  },
};
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :header="'Select ' + objectType"
    :style="{ width: '50vw' }"
  >
    Selecting a new Version will discard all existing changes!
    <VersionSelector
      :object-type="objectType"
      :element="element"
      @update-selection="setSelected"
    />
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="$emit('update:visible', false)"
        text
      />
      <Button
        label="Select"
        icon="pi pi-check"
        @click="$emit('selected', selectionValid ? selectedVersion : false)"
        autofocus
        :disabled="!selectionValid"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import VersionSelector from "@/components/utils/VersionSelector.vue";

export default {
  components: { Button, Dialog, VersionSelector },
  emits: ["selected", "update:visible"],
  props: {
    objectType: {
      type: String,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedVersion: undefined,
    };
  },
  methods: {
    setSelected(selected) {
      console.log(selected);
      this.selected = selected;
    },
  },
  computed: {
    selectionValid() {
      if (this.selectedVersion) {
        return true;
      } else {
        return false;
      }
    },
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>

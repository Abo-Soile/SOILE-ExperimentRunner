<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :header="'Select ' + objectType"
    :style="{ width: '50vw' }"
  >
    <div>
      Select which versions to no longer provide. NOTE: The versions are not
      deleted and any experiments or projects still using them will still be
      valid. However, there will be no way to access them except through those
      projects/experiments.
    </div>

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
        @click="
          $emit('selected', selectionValid ? selectedVersion : false);
          dialogVisible = false;
        "
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
      selectedTags: [],
      availableTags: [],
    };
  },
  setup() {
    const elementStore = useElementStore();
    return { elementStore: elementStore };
  },
  methods: {
    setSelected(selected) {
      console.log(selected);
      this.selectedVersion = selected.version;
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

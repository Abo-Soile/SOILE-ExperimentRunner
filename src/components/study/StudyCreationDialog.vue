<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    header="Set Study Properties"
    :style="{ width: '50vw' }"
  >
    <div class="grid">
      <div class="col">
        <label for="project">Project to execute</label>
      </div>
      <div class="col">
        <ObjectAndVersionSelector
          object-type="project"
          @update-selection="setSelected"
        />
      </div>
    </div>
    <StudyProperties
      v-model:name="name"
      v-model:descriptionShort="descriptionShort"
      v-model:descriptionLong="descriptionLong"
      v-model:shortCut="shortCut"
      v-model:private="private"
      @update:valid="(event) => (dataValid = event)"
    ></StudyProperties>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="$emit('selected', false)"
        text
      />
      <Button
        label="Create"
        icon="pi pi-check"
        @click="$emit('selected', selectionValid ? getProjectData() : false)"
        autofocus
        :disabled="!selectionValid"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ObjectAndVersionSelector from "@/components/utils/ObjectAndVersionSelector.vue";
import StudyProperties from "./StudyProperties.vue";

export default {
  components: { StudyProperties, Dialog, Button, ObjectAndVersionSelector },
  emits: ["selected", "update:visible"],
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selected: undefined,
      name: "",
      descriptionShort: "",
      descriptionLong: "",
      shortCut: "",
      private: false,
      dataValid: false,
    };
  },
  methods: {
    setSelected(selected) {
      console.log(selected);
      this.selected = selected;
    },
    getProjectData() {
      return {
        name: this.name,
        description: this.descriptionLong,
        shortDescription: this.descriptionShort,
        sourceUUID: this.selected.UUID,
        version: this.selected.version,
        shortcut: this.shortCut,
        private: this.private,
      };
    },
  },
  computed: {
    selectionValid() {
      if (this.selected?.UUID && this.selected?.version && this.dataValid) {
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
  watch: {
    visible(newValue) {
      // reset
      this.selected = undefined;
      this.name = "";
      this.descriptionShort = "";
      this.descriptionLong = "";
      this.shortCut = "";
      this.private = false;
      this.dataValid = false;
    },
  },
};
</script>

<template>
  <div class="grid mb-4">
    <div
      class="col-6 flex justify-content-start"
      v-tooltip="
        'You can only change the project if it is not active and there are no Participants yet'
      "
    >
      <Button @click="$emit('updateStudy')" :disabled="!isStudyEditable"
        >Save Changes</Button
      >
    </div>
    <div
      class="col-6 flex justify-content-end"
      v-tooltip="
        'Pilot the study, without actually generating any data (only temporary data will be created)'
      "
    >
      <Button @click="$emit('pilotStudy')" :disabled="!isStudyEditable"
        >Pilot</Button
      >
    </div>
  </div>
  <div class="grid bg-red-100">
    <div class="col-12">Danger Zone</div>
    <div class="col-6 flex justify-content-start">
      <Button @click="showResetDialog = true" :disabled="isActive"
        >Reset Study</Button
      >
    </div>
    <div class="col-6 flex justify-content-end">
      <Button @click="showDeleteDialog = true" severity="danger"
        >Delete Study</Button
      >
    </div>
  </div>
  <ConfirmDialog
    v-if="showResetDialog"
    v-model:isVisible="showResetDialog"
    @confirm="
      $emit('resetStudy');
      showResetDialog = false;
    "
    @reject="showResetDialog = false"
    title="Reset Study"
    message="This will irreversibly delete all participant data from this study! Are you sure you want to do this?"
  ></ConfirmDialog>
  <ConfirmDialog
    v-if="showDeleteDialog"
    v-model:isVisible="showDeleteDialog"
    @confirm="
      $emit('deleteStudy');
      showDeleteDialog = false;
    "
    @reject="showDeleteDialog = false"
    title="Reset Study"
    message="This will irreversibly delete this study and all particpant data? The underlying Projects will NOT be deleted."
  ></ConfirmDialog>
</template>

<script>
import Button from "primevue/button";
import { ConfirmDialog } from "@/components/dialogs";

export default {
  components: {
    Button,
    ConfirmDialog,
  },
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    isStudyEditable: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showResetDialog: false,
      showDeleteDialog: false,
    };
  },
  emits: ["deleteStudy", "resetStudy", "updateStudy", "pilotStudy"],
};
</script>

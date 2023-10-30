<template>
  <StudyEditor
    v-if="currentEditedStudy"
    :editableStudies="editableStudies"
  ></StudyEditor>
</template>

<script>
import { mapState } from "pinia";
import { useStudyStore } from "@/stores";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import StudyEditor from "@/components/study/StudyEditor.vue";

export default {
  name: "StudyManagementView",
  computed: {
    ...mapState(useStudyStore, [
      "researchStudies",
      "editableStudies",
      "currentEditedStudy",
    ]),
  },
  components: { Button, Dialog, StudyEditor },
  mounted() {
    console.log("Mounting Management View");
    this.studyStore.updateEditableStudies();
    this.studyStore.updateResearchStudies();
  },
  setup() {
    const studyStore = useStudyStore();
    return { studyStore };
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped></style>

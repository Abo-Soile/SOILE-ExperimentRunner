<template>
  <div v-if="currentEditedStudy">
    <StudyEditor
      :selectedStudy="currentEditedStudy"
      :editableStudies="editableStudies"
    ></StudyEditor>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useStudyStore } from '@/stores'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import StudyEditor from '@/components/study/StudyEditor.vue'

export default {
  name: 'StudyManagementView',
  computed: {
    ...mapState(useStudyStore, ['researchStudies', 'editableStudies', 'currentEditedStudy'])
  },
  components: { Button, Dialog, StudyEditor },
  mounted() {
    console.log('Mounting Management View')
    this.projectStore.updateEditableStudies()
    this.projectStore.updateResearchStudies()
  },
  setup() {
    const projectStore = useStudyStore()
    return { projectStore }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped></style>

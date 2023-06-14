<template>
  <div v-if="isRunning && codeReady">
    <SoileExpRunner
      v-if="codeType == 'elang'"
      :code="compiledCode"
      :outputs="outputs"
      @handleSubmit="(event) => displayResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="
        (event) => uploadFile(event.file, event.fileName, event.idCallBack, event.errorCallBack)
      "
    >
    </SoileExpRunner>
    <PsychoJsRunner
      v-if="codeType == 'psychopy'"
      :code="compiledCode"
      :psychoJSVersion="codeTypeVersion"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
      @handleUpload="
        (event) => uploadFile(event.file, event.fileName, event.idCallBack, event.errorCallBack)
      "
    >
    </PsychoJsRunner>
    <SoileQuestionnaire
      v-if="codeType == 'qmarkup'"
      :code="compiledCode"
      :outputs="outputs"
      @handleSubmit="(event) => submitResults(event)"
      @handleError="(error) => handleError(error)"
    ></SoileQuestionnaire>
    <!--<JsRunner v-if="type == 'javascript'"></JSRunner>-->
  </div>
</template>

<script>
import axios from 'axios'
import SoileQuestionnaire from '@/components/questionnaire/SoileQuestionnaire.vue'
import SoileExpRunner from '@/components/experimentlang/SoileExpRunner.vue'
import PsychoJsRunner from '@/components/psychopy/PsychoJsRunner.vue'
import { mapState } from 'pinia'
import { useErrorStore } from '@/stores'
import { useUserStore } from '@/stores/users'
import Button from 'primevue/button'

export default {
  name: 'CodePreview',
  components: { SoileQuestionnaire, SoileExpRunner, PsychoJsRunner, Button },
  setup() {
    const errorStore = useErrorStore()
    const userStore = useUserStore()
    userStore.setTaskActive()
    return { errorStore }
  },
  data() {
    return {
      isRunning: false,
      compiledCode: '',
      codeReady: false,
      codeType: undefined,
      codeVersion: undefined,
      taskUUID: undefined,
      outputs: []
    }
  },
  computed: {
    canRun() {
      return true
    }
  },
  methods: {
    start() {
      const currentData = window.getCodeData()
      this.codeType = currentData.type
      this.codeVersion = currentData.version
      this.compiledCode = currentData.compiledCode
      this.isRunning = true
      this.codeReady = true
    },
    stop() {
      this.isRunning = false
      this.codeReady = false
      this.codeType = ''
      this.codeVersion = ''
      this.compiledCode = ''
    },
    displayResults(event) {
      window.displayResults(event)
    },
    handleError(err) {
      window.handleError(err)
    },
    uploadFile(file, fileName, idCallback, errorCallback) {
      window.uploadFile(file, fileName, idCallback, errorCallback)
    },
    submitResults(event) {
      window.submitResults(event)
    }
  },
  mounted() {
    console.log(window)
    window.start = this.start
    window.stop = this.stop
  }
}
</script>

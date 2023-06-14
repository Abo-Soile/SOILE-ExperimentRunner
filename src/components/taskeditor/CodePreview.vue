<template>
  <div v-if="canRun">
    <div v-if="isRunningTask">
      <div>
        <SoileExpRunner
          v-if="codeType == 'elang'"
          :code="code"
          :outputs="currentTaskSettings.outputs"
          @handleSubmit="(event) => submitResults(event)"
          @handleError="(error) => handleError(error)"
          @handleUpload="
            (event) => uploadFile(event.file, event.fileName, event.idCallBack, event.errorCallBack)
          "
        >
        </SoileExpRunner>
        <PsychoJsRunner
          v-if="codeType == 'psychopy'"
          :code="code"
          :psychoJSVersion="codeTypeVersion"
          @handleSubmit="(event) => submitResults(event)"
          @handleError="(error) => handleError(error)"
          @handleUpload="
            (event) =>
              handleUploadData(event.file, event.fileName, event.idCallBack, event.errorCallBack)
          "
        >
        </PsychoJsRunner>
        <SoileQuestionnaire
          v-if="codeType == 'qmarkup'"
          :code="code"
          :outputs="currentTaskSettings.outputs"
          @handleSubmit="(event) => submitResults(event)"
          @handleError="(error) => handleError(error)"
        ></SoileQuestionnaire>
      </div>
      <div>
        <!--<JsRunner v-if="type == 'javascript'"></JSRunner>-->
        <Button @click="stopTask">Stop Task</Button>
      </div>
    </div>
    <div v-else>
      <Button @click="runTask">Start Task</Button>
    </div>
    <div class="results">
      <div v-if="Object.keys(outputs).length > 0" class="outputs">Outputs: {{ outputs }}</div>
      <div v-if="Object.keys(results).length > 0" class="results">Results: {{ results }}</div>
      <div v-if="uploadedFiles.length > 0" class="uploadedFiles">
        Uploaded Files: {{ uploadedFiles }}
      </div>
    </div>
  </div>
  <div v-else>You must save the task before you can run it.</div>
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
  props: {
    sourceCode: {
      type: String,
      required: true
    },
    codeType: {
      type: String,
      required: true
    },
    codeTypeVersion: {
      type: String,
      required: true
    },
    canRun: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const errorStore = useErrorStore()
    return { errorStore }
  },
  data() {
    return {
      currentTaskSettings: { outputs: [], persistentData: {} },
      code: undefined,
      running: false,
      isRunningTask: false,
      outputs: {},
      uploadedFiles: [],
      results: {}
    }
  },
  methods: {
    /**
     * Set the task to active
     */
    runTask() {
      ;(this.outputs = {}), (this.uploadedFiles = []), (this.results = {})
      this.compileTask()
        .then(() => {
          this.isRunningTask = true
        })
        .catch((err) => {
          if (err.response?.data) {
            this.errorStore.raiseError('error', err.response.data)
          } else {
            this.errorStore.raiseError('error', err.message)
          }
        })
    },
    stopTask() {
      this.isRunningTask = false
    },
    async compileTask() {
      const response = await axios.post('/task/compile/', {
        code: this.sourceCode,
        type: this.codeType
      })
      this.code = response?.data
    },
    /**
     * This function assumes, that results is an object with the following fields:
     * {
     *  outputData* : [ {name: "someName", value: 123 }],
     *  resultData* : [ {name: "someName", value: "xyz" or [], or {} or 123, timestamp : 12345}]
     *  fileData* : [{fileformat: "someMimeFormat", filename: "someName", targetid: "AnIDObtainedFromUploadData"}]
     * }
     * All fields are optional.
     * @param {*} results
     */
    async submitResults(results) {
      console.log(results)
      var TaskData = {}
      const userStore = useUserStore()
      this.outputs = results.outputData ? results.outputData : []
      this.results = results.resultData ? results.resultData : { resultData: [], fileData: [] }
    },
    handleUploadData(file, fileName, idCallBack, errorCallback) {
      this.uploadedFiles.push(fileName)
    },
    handleError(error) {
      const errorStore = useErrorStore()
      errorStore.raiseError(undefined, error)
    }
  },
  mounted() {
    console.log('ExpView Mounted')
  }
}
</script>

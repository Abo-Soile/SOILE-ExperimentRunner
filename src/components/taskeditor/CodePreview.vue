<template>

    <iframe class="previewFrame" :src="'/preview/' + taskUUID + '/' + taskVersion + '/'" style="width: 100%; height:100%" ref="previewFrame"></iframe>
    
    <div v-if="logs.length > 0">
        <h3> Log: </h3>
        <div v-for="logentry in logs">
            {{ logentry }}
        </div>
    </div>
    <div v-if="results">
        {{ results }}
    </div>
    <Button v-if="!isRunning" :disabled=!canRun label="Run" @click="start"></Button>
    <Button v-if="isRunning" label="Stop" @click="stop"></Button>
</template>
  
<script>
import axios from 'axios';
import SoileQuestionnaire from '@/components/questionnaire/SoileQuestionnaire.vue';
import SoileExpRunner from '@/components/experimentlang/SoileExpRunner.vue';
import PsychoJsRunner from '@/components/psychopy/PsychoJsRunner.vue';
import { mapState } from 'pinia'
import { useErrorStore } from '@/stores';
import { useUserStore } from '@/stores/users';
import Button from 'primevue/button';


export default {

    name: 'CodePreview',
    components: { SoileQuestionnaire, SoileExpRunner, PsychoJsRunner, Button },
    props: {
        codeType: {
            type: String,
            required: true
        },
        codeTypeVersion: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        taskUUID: {
            type: String,
        },
        taskVersion:
        {
            type: String,
        }
    },
    setup() {
        const errorStore = useErrorStore();
        return { errorStore }
    },
    data() {
        return {
            results: undefined,
            isRunning: false,            
            compiledCode: '',
            logs: [],
            outputs: [], // We should probably allow for this to be set by the researcher for testing.
            previewWindow: undefined,
        }
    },
    computed: {
        canRun()
        {
            return true            
        }
    },
    methods:
    {
        start() {
            this.logs = [];
            axios.post("/task/compile",{code : this.code, version: this.codeVersion, type: this.codeType})
            .then(response => {
                this.compiledCode = response.data;                
                this.previewWindow.start()
                this.isRunning = true;
            })
            .catch((err) => {
                this.handleError(err)
            })
            
        },
        stop() {
            this.isRunning = false;
            this.previewWindow.stop();
        },
        displayResults(event) {
            this.results = event;
            this.isRunning = false;                       
        },
        handleError(err) {
            this.errorStore.raiseError("error", err)
        },
        uploadFile(file, fileName, idCallback, errorCallback) {
            this.logs.push("Uploading file with name " + fileName);
        },
        submitResults(event)
        {
            this.logs.push("Submitting results");
            this.results = event;
        },
        getCodeData()
        {
            return { type: this.codeType,  
                version: this.codeVersion, 
                compiledCode : this.compiledCode, 
                taskUUID : this.taskUUID, 
                taskVersion : this.taskVersion}
        }

    },
    mounted()
    {
        this.previewWindow = this.$refs.previewFrame.contentWindow
        this.previewWindow.displayResults = this.displayResults;
        this.previewWindow.uploadFile = this.uploadFile;
        this.previewWindow.submitResults = this.submitResults;
        this.previewWindow.getCodeData = this.getCodeData;
    }


}
</script>
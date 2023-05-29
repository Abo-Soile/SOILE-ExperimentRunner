<template>
    <div v-if="isRunningTask">
        <SoileExpRunner v-if="codeType == 'elang'" :code="code"
            :outputs="currentTaskSettings.outputs" @handleSubmit="event => submitResults(event)"
            @handleError="error => handleError(error)"
            @handleUpload="event => uploadFile(event.file, event.fileName, event.idCallBack, event.errorCallBack)">
        </SoileExpRunner>
        <PsychoJsRunner v-if="codeType == 'psychopy'" 
            :code="code"
            :psychoJSVersion="codeTypeVersion"
            @handleSubmit="event => submitResults(event)" @handleError="error => handleError(error)"
            @handleUpload="event => uploadFile(event.file, event.fileName, event.idCallBack, event.errorCallBack)">
        </PsychoJsRunner>
        <SoileQuestionnaire v-if="codeType == 'qmarkup'" :code="code"
            :outputs="currentTaskSettings.outputs" @handleSubmit="event => submitResults(event)"
            @handleError="error => handleError(error)"></SoileQuestionnaire>
        <!--<JsRunner v-if="type == 'javascript'"></JSRunner>-->
    </div>
    <div v-else>
        <Button @click="setTaskActive">Start Task</Button>
    </div>
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
    props:
    {
        sourceCode: {
            type: String,
            required: true
        },
        codeType: {
            String,
            required: true
        },
        codeTypeVersion: {
            String,
            required: true
        }
    },
    data() {
        return {
            currentTaskSettings: { outputs: [], persistentData : {} },
            code: undefined,            
            running: false,
            isRunningTask: false
        }
    },
    methods: {
        /**
         * Set the task to active
         */
        setTaskActive()
        {
            this.compileTask()
            .then(() => {
                this.isRunningTask = true;
            });
        },
        async compileTask() {           
            try{
                const response = await axios.post("/task/compile/",{code: this.sourceCode, type: this.codeType});
                this.code = response?.data;
            }
            catch(error)
            {
                console.log(error)
            }
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
         /*   var TaskData = {};
            const userStore = useUserStore()
            TaskData.taskID = userStore.currentTaskSettings.id;
            TaskData.outputData = results.outputData ? results.outputData : [];
            TaskData.resultData = results.resultData ? results.resultData : { resultData: [], fileData: [] };
            // TODO: Potentially extract outputs from the jsonData of the results        
            axios.post("/projectexec/" + this.$route.params.id + "/submit", TaskData)
                .then(async response => {
                    if (response.status == 200) {
                        await userStore.updateTaskSettings(this.$route.params.id);
                        // start the next task.
                        this.running=false;
                        this.$router.push("/exp/" + this.$route.params.id + "/" + userStore.currentTaskSettings.id + "/")
                    }
                    else {
                        console.log(response);
                        reportError(response.status, "Unexpected issue while submitting the results")
                    }
                })
                .catch(error => {
                    
                    console.log(error)
                })
                .finally(() => {
                    userStore.setTaskNotRunning();
                })*/
        },
        uploadData(file, fileName, idCallBack, errorCallback) {
            /*var formData = new FormData();
            formData.append(fileName, file);
            axios.post("/projectexec/" + this.$route.params.id + "/submit", formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
                .then(response => {
                    idCallBack(response.data.id)
                })
                .catch(error => {
                    console.log(error)
                    errorCallback(error)
                })*/
        },
        handleError(error) {
            const errorStore = useErrorStore();
            errorStore.raiseError(undefined, error);
        }

    },
    mounted() {
        console.log("ExpView Mounted")
    },



}
</script>
  
<template>
    <SoileExpRunner v-if="type == 'elang'"></SoileExpRunner>
    <PsychoJsRunner v-if="type == 'psychojs'"></PsychoJsRunner>
    <SoileQuestionnaire v-if="type == 'qlang'"></SoileQuestionnaire>
    <!--<JsRunner v-if="type == 'javascript'"></JSRunner>-->
</template>
  
<script>

export default {
    name: 'ExperimentView',
    data() {
        return {
            id: undefined,
            codeType: undefined,
            codeVersion: undefined,
            currentTaskID: undefined
        }
    },
    methods: {
        updateTask() {
            this.$http.get("/api/projectexec/" + this.id + "/getcurrenttaskinfo")
                .then(response => {
                    this.finished = response.data.finished ? response.data.finished : false;
                    this.codeVersion = response.data.codeType.version;
                    this.currentTaskID = response.data.id;
                    this.codeType = response.data.codeType.language;
                })
                .catch(error => {
                    console.log(error)
                })
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
            var TaskData = {};
            TaskData.taskID = this.currentTaskID;
            TaskData.outputData = results.outputData ? results.outputData : [],
                TaskData.resultData = {};
            TaskData.resultData.jsonData = results.resultData ? results.resultData : [],
                TaskData.resultData.fileData = results.fileData ? results.fileData : [],
                // TODO: Potentially extract outputs from the jsonData of the results        
                this.$http.post("/api/projectexec/" + this.id + "/submit", TaskData)
                    .then(response => {
                        if (response.status == 200) {
                            this.updateTask();
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
        },
        uploadData(file, fileName, idCallBack, errorCallback) {
            var formData = new FormData();
            formData.append(fileName, file);
            this.$http.post("/api/projectexec/" + this.id + "/submit", formData, {
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
                })
        },
        reset() {
            this.id = undefined
            this.codeType = undefined
            this.codeVersion = undefined
            this.currentTaskID = undefined
        }

    },
    beforeMount() {
        console.log("Current route: ");
        console.log(this.$route)
    },
    async beforeRouteUpdate(to, from) {
        console.log(from)
        this.id = to.params.id;
        updateTask();
    },

    mounted() {

    },



}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
  
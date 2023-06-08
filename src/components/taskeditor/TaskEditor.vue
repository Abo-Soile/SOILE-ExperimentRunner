<template>
    <div class="grid">
        <div class="col-12">
            <TaskBar 
                v-model:codeType="currentObject.codeType.language"
                v-model:codeVersion="currentObject.codeType.version"
                v-model:task="currentTask"
                v-model:taskVersion="currentVersion"
                v-model:valid="isValid"
                :codeTypeOptions="codeOptions"
                :newTask=newElement
                @save="updateTagsAndShowSave"
                >
            </TaskBar>
        </div>
    </div>
    <div v-if=isValid class="grid taskdisplay">
            <div class="displaypart col-2 h-full">
            <FileBrowser @fileSelected="preview" @createFile="createFile" :fileStructure="files" />
            <FilePreview v-if="previewFile" :file="previewFile"></FilePreview>
        </div>
        <div class="col-6">
            <CodeEditor v-model:inputText="currentObject.code"></CodeEditor>
        </div>
        <div class="col-4 h-full">
            <CodePreview class="h-full preview" :sourceCode="currentObject.code" 
                         :codeType="currentObject.codeType.language" 
                         :codeTypeVersion="currentObject.codeType.version"
                         :taskUUID="currentObject.UUID"
                         :taskVersion="currentObject.version"
                         :canRun="canRun">
                        </CodePreview>
        </div>
    </div>    
    <ElementSaveDialog v-model:visible="showSave" 
                       :name="this.currentObject.name" 
                       :currentTags="currentTags" 
                       @submit="saveTask" />

</template>
  
<script>

import Menu from 'primevue/menu';
import FileBrowser from '@/components/FileBrowser.vue'
import FilePreview from '@/components/utils/FilePreview.vue'
import CodeEditor from './CodeEditor.vue'
import CodePreview from './CodePreview.vue'
import TaskBar from './TaskBar.vue'
import ElementSaveDialog from '@/components/utils/ElementSaveDialog.vue'

import { useElementStore, useErrorStore, useEditorStore } from '@/stores'
import { reactive } from 'vue'
export default {
    data() {
        return {
            files: [],
            previewFile: undefined,
            codeOptions: {
                qmarkup: { versions: ["1.0"], mimeType: "application/json" },
                elang: { versions: ["1.0"], mimeType: "application/javascript" },
                psychopy: { versions: ["2022.2.5"], mimeType: "application/javascript" },
                javascript: { versions: ["ES6", "ECMAScript 2020"], mimeType: "application/javascript" }
            },
            isValid: false,
            currentTags : [],
            showSave : false,
        }
    },
    setup(props) {
         
        const elementStore = useElementStore();
        const errorStore = useErrorStore();
        const editorStore = useEditorStore();
        const currentObject = reactive(JSON.parse(JSON.stringify(props.target)))
        currentObject.codeType = reactive(currentObject.codeType);
        return { errorStore, elementStore, currentObject, editorStore }
    },
    emits: ['updateName', 'updateCurrentVersion', 'saveTask' ],
    components: { ElementSaveDialog, CodePreview, FileBrowser, FilePreview, CodeEditor, TaskBar },
    props: {
        target: {
            type: Object,
            required: false
        },
        newElement: {
            type: Boolean,
            requied: true
        }
    },
    computed: {        
        currentTask: {
             get()
             {
                return  { name: this.currentObject.name, UUID: this.currentObject.UUID }
             },
             set(newValue)
             {   
                console.log("Getting new Task value: " )
                console.log(newValue)
                // UUID Can NEVER be set here. This needs to come through an update in the target prop.             
                if(this.currentObject.UUID == null || this.currentObject.UUID === '')
                {
                    console.log("Emitting name update");
                    this.currentObject.name = newValue.name;
                    this.$emit('updateName', newValue.name)
                }
             }
        },
        currentVersion: {
             get()
             {
                return  { version: this.currentObject.version, tag: this.currentObject.tag }
             },
             set(newValue)
             {   
                this.currentObject.version = newValue; 
                this.$emit("updateCurrentVersion", { version: newValue});
             }
        },
        canRun() {
            return this.currentObject.UUID != null;
        }

    },
    methods: {
        updateFiles(target) {
            console.log("Updating files")
            if (!this.newElement) {
                this.elementStore.getFilesForTask(target.UUID, target.version)
                    .then(files => {
                        console.log(files)
                        this.files = { children: files };
                    })
            }
            else {
                this.files = { children: [] };
                console.log(this.files);
            }
        },
        updateFields(newValue) {
            this.currentObject = reactive(JSON.parse(JSON.stringify(newValue)));                        
            this.currentObject.codeType = reactive(this.currentObject.codeType);
            this.$forceUpdate();
        },
        createFile(event) {
            if(this.newElement)
            {
                this.errorStore.raiseError("warn", "You must first create the task before adding files")
                return
            }
            console.log(event)
            this.elementStore.addFileToTask(this.target.UUID, this.target.version, event.targetName, event.file)
                .then(newVersion => {
                    this.currentVersion = newVersion;
                })
        },
        preview(event) {
            this.elementStore.getResourceFile(this.target.UUID, this.target.version, event)
                .then(data => {
                    console.log(data)
                    this.previewFile = data;
                })
        },
        getCodeTypeObject()
        {
            return {language : this.currentObject.codeType.language, version : this.currentObject.codeType.version}
        },
        async updateCurrentTags()
        {
            if(this.currentObject.UUID)
            {
                this.currentTags = await this.elementStore.getTagsForElement(this.currentObject.UUID, 'task')                
            }
            else
            {
                this.currentTags = [];
            }
        },
        async updateTagsAndShowSave()
        {
            await this.updateCurrentTags();
            this.showSave = true;
        },
        async saveTask(newTag)
        {   
            this.showSave = false;
            this.currentObject.tag = newTag;
            this.$emit("saveTask", this.currentObject)                            
        }
    },
    watch: {
        target: {
            handler(newValue) {
                console.log("Target has been updated")
                this.updateFiles(newValue);
                this.updateFields(newValue);
            }
        },
        isValid(newVal)
        {
            console.log("isValid changed to " + newVal);
        }
    },
    mounted() {
        this.updateFiles(this.target);
        this.updateFields(this.target);
        console.log("Displaying task");        
    },
};
</script>

<style>
.container {
    margin: 0 auto;
}

.displaypart {
    margin: 2 auto;
    border: 1 solid;
}

.taskdisplay {
    min-height: 50vh;
    height: 100%;
}
.preview {
    max-width: 33vw;
    margin: 2 auto;
    border: 1 solid;
}
</style>
  
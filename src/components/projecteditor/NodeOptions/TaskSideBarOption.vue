<template>
    <div>
        <ObjectAndVersionSelectorWithProps
            objectType="task"
            v-model:element=currentTask
            v-model:version="currentVersion"
            elementLabel="name"
            versionLabel="tag"
        >
        </ObjectAndVersionSelectorWithProps>
        <div>
            <label for="addOutput">Add Outputs</label>
            <input class="baklava-input" type="text" v-model=newOutput
                name="addOutput">
            <button class="baklava-button " @click="createOutput()"> Create output </button>
            <div v-for="output in currentOutputs">
                <label :for=output> {{ output }}</label>
                <button class="baklava-button " :name=output @click="removeOutput(output)"> Remove output </button>
            </div>
        </div>
        <div>
            <label for="addPersistent">Add Persistent Data</label>
            <input class="baklava-input" type="text" v-model=newPersistent
                 name="addPersistent">
            <button class="baklava-button " @click="createPersistent()"> Add Persistent </button>
            <div v-for="persistent in currentPersistent">
                <label :for=persistent> {{ persistent }}</label>
                <button class="baklava-button " :name=persistent @click="removePersistent(persistent)"> Remove Persistent
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropDown from "../components/DropDown.vue";
import { SelectionItem } from "../components/DropDown.vue";
import TaskNode from "../NodeTypes/TaskNode";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { useGraphStore, useElementStore, useErrorStore } from "@/stores";
import ObjectAndVersionSelectorWithProps from '@/components/utils/ObjectAndVersionSelectorWithProps.vue'
export default defineComponent({

    components: { DropDown, ObjectAndVersionSelectorWithProps},
    props: {
        intf: {
            type: Object as () => ComponentInterface<TaskNode>,
            required: true,
        },
    },
    data() {
        return {
            nodeID: "",
            newOutput: "",
            newPersistent: "",
            taskVersions: [],
        }
    },
    setup() {
        const elementStore = useElementStore();
        const graphStore = useGraphStore();
        const errorStore = useErrorStore();
        return { elementStore, errorStore, graphStore }
    },
    methods: {
        createOutput() {
            if (this.newOutput) {
                console.log("Adding output");
                if (this.graphStore.canAddElementOutput(this.currentNode, this.newOutput)) {
                    console.log("Yes ")
                    this.currentNode.addElementOutput(this.newOutput)
                }
                else {
                    console.log("No ")
                    this.errorStore.raiseError("warn", "The output is already defined for this Node")
                }
            }
            this.newOutput = "";
        },
        createPersistent() {
            if (this.newPersistent) {
                console.log("Adding Persistent");
                console.log("Yes ")
                this.currentNode.addPersistent(this.newPersistent)
            }
            this.newPersistent = "";
        },
        async setTask(selected: { text: String, value: String }) {
            console.log("Setting task");
            this.currentTask = selected;

        },
        async setTaskVersion(selected: { text: String, value: String }) {                        
            this.currentVersion = selected;
        },
        removeOutput(output: string) {
            console.log("removing output: " + output)
            this.currentNode.removeElementOutput(output)
        },
        removePersistent(persistent: string) {
            console.log("removing Persistent: " + persistent)
            this.currentNode.removeElementPersistent(persistent)
        }
    },
    computed: {
        currentNode(): TaskNode {
            return this.intf.data;
        },
        currentOutputs() {
            console.log(this.intf)
            return this.intf.data.nodeOutputs;
        },
        currentPersistent() {
            console.log(this.intf)
            return this.intf.data.nodePersistent;
        },
        currentTask: {
            get() {                
                return { uuid: this.intf.data.objectData.uuid, name: this.intf.data.objectData.name }
            },
            async set(newValue) {                
                if(newValue.uuid)
                {                    
                    this.currentNode.setElement(newValue.uuid, newValue.name);
                    console.log({ text: this.intf.data.objectData.name, value: this.intf.data.objectData.uuid })
                }
            }
        },
        currentVersion: {
            get() {
                return { tag: this.intf.data.objectData.tag, version: this.intf.data.objectData.version }
            },
            /**
             * 
             * @param {{text: string, value: string}} newValue The value is a tag + version (value is the version, text is the tag.)
             */
            set(newValue : {tag: string, version: string}) {
                if(newValue)
                {
                    this.currentNode.setElementVersion(newValue.version, newValue.tag);
                }            
            }
            
        }
    },
    watch:
    {
    },
    async mounted() {
        this.nodeID = this.intf.id;
        this.currentTask = this.intf.data.objectData
    }
})
</script>
<style scoped>
.baklava-input {
    width: 50%;
}
</style>
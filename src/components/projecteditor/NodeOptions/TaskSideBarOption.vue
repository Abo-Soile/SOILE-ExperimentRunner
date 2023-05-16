<template>
    <div>
        <label for="task"> Select Task </label>
        <DropDown :selected=currentTask @itemSelected="setTask" id="task" :options="availableTasks"></DropDown>
        <div v-if="availableVersions.items.length != 0">
            <label  for="taskVersion"> Select Task Version </label>
            <DropDown @itemSelected="setTaskVersion" :selected=currentVersion  id="taskVersion" :options="availableVersions"></DropDown>
        </div>
        <label for="addOutput">Add Outputs</label>
        <input class="baklava-input" type="text" :value=newOutput @input="event => newOutput = event.target.value" name="addOutput">
        <button class="baklava-button " @click="createOutput()"> Create output </button>
        <div v-for="output in currentOutputs">
            <label :for=output> {{ output }}</label>
            <button class="baklava-button " :name=output @click="removeOutput(output)"> Remove output </button>
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
import { getOutputsFromTask } from '@/components/experimentlang/checkElang";

import axios from "axios";
export default defineComponent({

    components: { DropDown },
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
            currentTask: { text: "",
                            value: ""},
            currentVersion: { text: "",
                            value: ""},
            taskVersions: [],
        }
    },
    setup()
    {
        const elementStore = useElementStore();
        const graphStore = useGraphStore();
        const errorStore = useErrorStore();
        return { elementStore, errorStore, graphStore }
    },
    methods: {
        createOutput() {
            if (this.newOutput) {
                console.log("Adding output");
                if(this.graphStore.canAddTaskOutput(this.currentNode, this.newOutput))
                {
                    console.log("Yes ")
                    this.currentNode.addTaskOutput(this.newOutput)
                }
                else{
                    console.log("No ")
                    this.errorStore.raiseError("warn", "The output is already defined for this Node")
                }
            }
            this.newOutput = "";
        },
        async setTask(selected : { text: String, value: String})
        {
            this.currentTask = selected;
           
        },
        async setTaskVersion(selected : { text: String, value: String})
        {       
            // TODO: Check that this version is possible (i.e. no interfering outputs!)
            const taskData = await this.elementStore.getElement(this.currentTask.value, selected.value, "task")
            if(taskData.codeType.language === "elang")
            {

            }
            this.currentVersion = selected;

        },
        removeOutput(output: string) {
            console.log("removing output: " + output)
            this.currentNode.removeTaskOutput(output)
        }

    },
    computed: {
        currentNode() : TaskNode
        {        
           return this.intf.data;
        },
        currentOutputs(){
            console.log(this.intf)
            return this.intf.data.taskOuputs;
        },
        availableTasks()
        {
            return {
                name: "Task Selection",
                items: this.elementStore.availableTasks.map((x : {name : string,  uuid: string}) => { return {value: x.uuid, text: x.name}} )
            }
        },
        availableVersions() : { items: SelectionItem[], name : string }
        {
            return {
                name: "Task Versions",
                items: this.taskVersions.filter((x : { tag? : string}) => x.tag).map( (x : { tag: string, version: string }) => { return {value : x.version, text: x.tag }})
            }
        }
    },    
    watch:
    {
        async currentTask(newValue) 
        {
            this.currentNode.setTaskInformation({uuid: newValue.value, name: newValue.text});                                    
            this.taskVersions = await this.elementStore.getTaskOptions(newValue.value);            
            this.currentVersion = Object as () => SelectionItem
        },
        currentVersion(newValue)
        {

            this.currentNode.setTaskVersion(newValue.value,newValue.text);            
        }
    },
    mounted() {
        console.log(this)
        this.elementStore.updateAvailableTasks();
        this.nodeID = this.intf.id;            
    }
})
</script>
<style scoped>
.baklava-input {
    width: 50%;
}

</style>
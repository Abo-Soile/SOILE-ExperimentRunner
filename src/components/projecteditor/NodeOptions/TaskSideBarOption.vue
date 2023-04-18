<template>
    <div>
        <label for="addOutput"></label>
        <input type="text" :value=newOutput @input="event => newOutput = event.target.value" name="addOutput">
        <button @click="createOutput()"> create output </button>
        <div v-for="(output, index) in currentOutputs">
            <label :for=output> {{ output }}</label>        
            <button :name=output @click="removeOutput(output)"> Remove output </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TaskNode from "../NodeTypes/TaskNode";
@Component
export default class TaskSideBarOption extends Vue {

    nodeID = ""
    currentNode : TaskNode
    newOutput = ""
    currentOutputs = []

    @Prop({ type: Object })
    item!: object;


    createOutput()
    {
        if(this.newOutput)
        {
            console.log("Adding output");
            this.currentNode.addOutput(this.newOutput)
        }
        this.newOutput = "";
    }

    removeOutput(output : string) 
    {
        console.log("removing output: " + output)
        this.currentNode.removeOutput(output)        
    }

    mounted(){        
        console.log(this)
        console.log(this.$attrs.value())
        this.$attrs.value().printStatus()
        console.log(this.$attrs.value)
        this.nodeID = this.$attrs.node.id;
        this.currentNode = this.$attrs.value();
        this.currentOutputs = this.currentNode.getOutputs();        
    }
}
</script>
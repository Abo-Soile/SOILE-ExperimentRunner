<template>
    <div style="height:100%" @oncontextmenu="parseEvent()">
        <baklava-editor :view-model="baklava">
            <template #node="nodeProps">
                <SoileNode v-if="isSoileNode(nodeProps.node.type)" v-bind="nodeProps" />
                <BaklavaNode v-else v-bind="nodeProps" />
            </template>
            <template #toolbar="toolbarProps">
                <div class="baklava-toolbar">
                    <button class="baklava-button" @click="saveProject()">
                        <saveIcon />
                    </button>
                </div>
            </template>
        </baklava-editor>
    </div>
</template>

<script>

import { EditorComponent, useBaklava, Components, Icons } from "@baklavajs/renderer-vue";
import { DependencyEngine } from "@baklavajs/engine";
import "@baklavajs/themes/dist/syrup-dark.css";


import TaskNode from "./NodeTypes/TaskNode";
import FilterNode from "./NodeTypes/FilterNode";
import ExperimentNode from "./NodeTypes/ExperimentNode";
import SoileNode from "./ViewComponents/SoileVueNode.vue";

import { BaklavaToSoileProjectJSON,BaklavaToSoileExperimentJSON, loadSoileProjectToBaklava, loadSoileExperimentToBaklava } from "@/helpers/projecteditor/baklavasoileConverter";
import { checkConnection } from './events/graphEvents.ts'
import { useGraphStore } from "../../stores";

const BaklavaNode = Components.Node;
const saveIcon = Icons.DeviceFloppy;

export default {
    components: { "baklava-editor": EditorComponent, BaklavaNode, SoileNode, saveIcon },
    props: {
        name: {
            type: String,
            required: true
        },
        isProjectEditor: {
            type: Boolean
        },
        data: {
            type: Object            
        }
    },
    data() {
        return {
        };
    },

    created() {
    },
    setup(props) {
        const graphStore = useGraphStore();
        const baklava = useBaklava();
        
        baklava.editor.registerNodeType(TaskNode)
        baklava.editor.registerNodeType(FilterNode)
        baklava.editor.registerNodeType(ExperimentNode);                
        baklava.editor.graphHooks.checkConnection.subscribe("soile:connectionCheck", (c) => checkConnection(c.from, c.to))                
        return { baklava, graphStore }
    },
    methods: {       
        saveProject() {
            console.log(this.baklava.editor.save());
            if(this.isProjectEditor)
            {
            console.log(BaklavaToSoileProjectJSON(this.baklava.editor.graph));
            }
            else
            {
                console.log(BaklavaToSoileExperimentJSON(this.baklava.editor.graph))
            }
        },
        loadProject() {
            //TODO (popup)
        },
        isSoileNode(nodeType) {
            return nodeType === "TaskNode" || nodeType === "FilterNode" || nodeType === "ExperimentNode"
        },
    },
    mounted()
    {
        // TODO: Check, if we need to clean up the graph in order not to screw things up...
        if(this.data)
        {
            if(this.isProjectEditor)
            {
                loadSoileProjectToBaklava(this.baklava, this.data)
            }
            else
            {
                loadSoileExperimentToBaklava(this.baklava, this.data)
            }
        }
        console.log("Editor mounted");
        console.log(this.data);
    }
};
</script>
<style>
.node-editor .minimap {
    left: 0px;
    top: 85%;
}
</style>


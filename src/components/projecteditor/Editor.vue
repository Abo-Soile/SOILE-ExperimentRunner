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
import SoileNode from "./ViewComponents/SoileNode.vue";

import { BaklavaToSoileProjectJSON, loadSoileProjectToBaklava } from "../../helpers/baklavasoileConverter";
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
        if(props.isProjectEditor)
        {
            baklava.editor.registerNodeType(ExperimentNode);
        }        
        baklava.editor.graphHooks.checkConnection.subscribe("soile:connectionCheck", (c) => checkConnection(c.from, c.to))                
        /*const engine = new DependencyEngine(baklava.editor);
        console.log(baklava.editor)
        console.log(engine)
        engine.start();*/
        return { baklava, graphStore }
    },
    methods: {
        isSoileNode(nodeType) {
            return nodeType === "TaskNode" || nodeType === "FilterNode" || nodeType === "ExperimentNode"
        },
        addNodeWithCoordinates(nodeType, x, y) {
            const n = new nodeType();
            this.editor.addNode(n);
            n.position.x = x;
            n.position.y = y;
            this.editor.addConnection
            return n;
        },
        parseEvent(event) {
            console.log(event);
        },
        saveProject() {
            console.log(this.baklava.editor.save());
            console.log(BaklavaToSoileProjectJSON(this.baklava.editor.save()));
        },
        loadProject() {
            //TODO (popup)
        },
    },
    mounted()
    {
        // TODO: Check, if we need to clean up the graph in order not to screw things up...
        if(this.data)
        {
            loadSoileProjectToBaklava(this.baklava, this.data)
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


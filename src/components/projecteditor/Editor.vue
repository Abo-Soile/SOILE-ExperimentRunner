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

import { EditorComponent, useBaklava } from "@baklavajs/renderer-vue";
import TaskNode from "./NodeTypes/TaskNode";
import FilterNode from "./NodeTypes/FilterNode";
import { Components, Icons } from "@baklavajs/renderer-vue";
import "@baklavajs/themes/dist/syrup-dark.css";
const BaklavaNode = Components.Node;
import { DependencyEngine } from "@baklavajs/engine";
import SoileNode from "./ViewComponents/SoileNode.vue";
import { BaklavaToSoileProjectJSON } from "../../helpers/baklavasoileConverter";
const saveIcon = Icons.DeviceFloppy;
import { checkConnection } from './events/graphEvents.ts'
import { useGraphStore } from "../../stores";

export default {
    components: { "baklava-editor": EditorComponent, BaklavaNode, SoileNode, saveIcon },
    props: {
        name: {
            type: String,
            required: true
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
        baklava.editor.graphHooks.checkConnection.subscribe("soile:connectionCheck", (c) => checkConnection(c.from, c.to))        
        const engine = new DependencyEngine(baklava.editor);
        console.log(baklava.editor)
        console.log(engine)
        engine.start();
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

    }
};
</script>
<style>
.node-editor .minimap {
    left: 0px;
    top: 85%;
}
</style>


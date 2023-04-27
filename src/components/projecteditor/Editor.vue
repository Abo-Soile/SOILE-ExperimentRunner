<template>
    <div style="height: 100vh; width: 100vw" @oncontextmenu="parseEvent()">
        <baklava-editor :view-model="baklava" >
            <template #node="nodeProps">
            <SoileNode v-if="isSoileNode(nodeProps.node.type)" v-bind="nodeProps" />
            <BaklavaNode v-else v-bind="nodeProps" />
        </template>
        </baklava-editor>
    </div>
</template>

<script>

import { defineComponent } from "vue";
import { EditorComponent, useBaklava } from "@baklavajs/renderer-vue";
import TaskNode from "./NodeTypes/TaskNode";
import FilterNode from "./NodeTypes/FilterNode";
import { Components } from "@baklavajs/renderer-vue";
import "@baklavajs/themes/dist/syrup-dark.css";
const BaklavaNode = Components.Node;
import { DependencyEngine } from "@baklavajs/engine";
import SoileNode from "./ViewComponents/SoileNode.vue";

export default {
    components: {"baklava-editor": EditorComponent, BaklavaNode, SoileNode},
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
    setup(props)
    {
        const baklava = useBaklava();
        baklava.editor.registerNodeType(TaskNode)
        baklava.editor.registerNodeType(FilterNode)
        const engine = new DependencyEngine(baklava.editor);        
        console.log(baklava.editor)
        console.log(engine)
        engine.start();
        return { baklava }
    },  
    methods: {
        isSoileNode(nodeType)
        {
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
        parseEvent(event)
        {
            console.log(event);
        },
        saveProject()
        {
            console.log(this.editor.save());
        },
        loadProject()
        {
            //TODO (popup)
        },
        checkConnection(from, to)
        {
            console.log(from);
            console.log(to)
            

        }
    }
};
</script>
<style>
.node-editor .minimap {
    left: 0px;
    top: 85%;
}
</style>
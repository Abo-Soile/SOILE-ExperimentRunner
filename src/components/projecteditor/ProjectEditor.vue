<template>
    <div style="height: 100vh; width: 100vw" @oncontextmenu="parseEvent()">
        <button @click="saveProject">save</button>
        <button @click="loadProject">load</button>
        <baklava-editor :plugin="viewPlugin" @oncontextmenu="parseEvent()">
        <hint-overlay />        
        </baklava-editor>
    </div>
</template>

<script>
import HintOverlay from "./HintOverlay.vue";
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from "@baklavajs/plugin-engine";
import TaskNode from "./NodeTypes/TaskNode.ts";
import ExperimentNode from "./NodeTypes/ExperimentNode.ts";
import FilterNode  from "./NodeTypes/FilterNode.ts";
import TaskSideBarOption from "./NodeOptions/TaskSideBarOption.vue";
import FilterSideBarOption from "./NodeOptions/FilterSideBarOption.vue";
import OutputListOption from "./NodeOptions/OutputListOption.vue";

export default {
    components: { HintOverlay },
    data() {
        return {
            editor: new Editor(),
            viewPlugin: new ViewPlugin(),
            engine: new Engine(true),
            projectID: undefined,
        };
    },
    created() {
        this.viewPlugin.registerOption("TaskSideBarOption", TaskSideBarOption);
        this.viewPlugin.registerOption("FilterSideBarOption", FilterSideBarOption);
        this.viewPlugin.registerOption("OutputListOption", OutputListOption);
        // Register the plugins
        // The view plugin is used for rendering the nodes
        this.viewPlugin.sidebar.width = 500;
        this.editor.use(this.viewPlugin);
        // The option plugin provides some default option UI elements
        this.editor.use(new OptionPlugin());
        // The engine plugin calculates the nodes in the graph in the
        // correct order using the "calculate" methods of the nodes
        this.editor.use(this.engine);                
        // Show a minimap in the top right corner
        this.viewPlugin.enableMinimap = true;
        
        console.log(this.viewPlugin.components.sidebar)
        console.log(this.editor)
        this.editor.events.checkConnection.addListener(this, (c) => {
            if (!this.checkConnection(c.from, c.to)) {
                return false;
            }
        });
        // register the nodes we have defined, so they can be
        // added by the user as well as saved & loaded.
        this.editor.registerNodeType("TaskNode", TaskNode);
        //this.editor.registerNodeType("ExperimentNode", ExperimentNode);
        this.editor.registerNodeType("FilterNode", FilterNode);
        // add some nodes so the screen is not empty on startup
        const node1 = this.addNodeWithCoordinates(TaskNode, 100, 140);
        //const node2 = this.addNodeWithCoordinates(FilterNode, 400, 140);        
    },
    methods: {
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
            if(from.value.type === "Output")
            {
                if(to.value.type === "Filter")
                {
                    return true;
                }
                else {
                    return false;
                }
            }
            if(from.value.type === "OutputConnection")
            {

                if(to.value.type === "InputConnection")
                {
                    return true
                }    
                console.log("Was output but not input matching")
                return false
            }
            if(from.value.type === "InputConnection")
            {
                if(to.value.type === "OutputConnection")
                {
                    return true
                }    
                console.log("Was input but not output matching")
                return false
            }
            return false;

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
<template>
    <div
        :id="node.id"
        ref="el"
        class="baklava-node resizableNode"
        :class="classes"
        :style="styles"
        :data-node-type="node.type"        
        @pointerdown="select"        
    >
        <div class="__title" @pointerdown.self.stop="startDrag">
            <template v-if="!renaming">
                <div class="__title-label">
                    {{ node.title }}
                </div>
                <div class="__menu">
                    <vertical-dots class="--clickable" @click="openContextMenu" />
                    <context-menu
                        v-model="showContextMenu"
                        :x="0"
                        :y="0"
                        :items="contextMenuItems"
                        @click="onContextMenuClick"
                    />
                </div>
            </template>
            <input
                v-else
                ref="renameInputEl"
                v-model="tempName"
                type="text"
                class="baklava-input"
                placeholder="Node Name"
                @blur="doneRenaming"
                @keydown.enter="doneRenaming"
                
            />
        </div>

        <div class="__content">
            <!-- Outputs -->
            <div class="__outputs">
                <NodeInterface v-for="output in displayedOutputs" :key="output.id" :node="node" :intf="output" />
            </div>

            <!-- Inputs -->
            <div class="__inputs">
                <NodeInterface v-for="input in displayedInputs" :key="input.id" :node="node" :intf="input" />
            </div>
            <div class="__options">
                <NodeInterface v-for="option in displayedOptions" :key="option.id" :node="node" :intf="option" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, nextTick, onUpdated, onMounted, onBeforeUnmount } from "vue";
import { AbstractNode, GRAPH_NODE_TYPE_PREFIX, IGraphNode } from "@baklavajs/core";
import { useDragMove, useGraph, useViewModel } from "@baklavajs/renderer-vue";
import { Components, Icons } from "@baklavajs/renderer-vue";
import { Node } from "@baklavajs/renderer-vue";

import { useGraphStore } from "@/stores";
import { ResizeObserverEntry } from "@vueuse/core";
import SoileNode from "../NodeTypes/SoileNode";

const graphStore = useGraphStore();
const contextMenu = Components.ContextMenu;
const VerticalDots = Icons.VerticalDots;
const NodeInterface = Node.NodeInterface;

const props = withDefaults(
    defineProps<{
        node: SoileNode;
        selected?: boolean;
    }>(),
    { selected: false },
);
const emit = defineEmits<{
    (e: "select"): void;
}>();
const { viewModel } = useViewModel();
const { graph, switchGraph } = useGraph();
const dragMove = useDragMove(toRef(props.node, "position"));
const el = ref<HTMLElement | null>(null);
const renaming = ref(false);
const tempName = ref("");
const renameInputEl = ref<HTMLInputElement | null>(null);
const showContextMenu = ref(false);
const contextMenuItems = computed(() => {
    const items = [
        { value: "rename", label: "Rename" },
        { value: "delete", label: "Delete" },
    ];
    if (props.node.type.startsWith(GRAPH_NODE_TYPE_PREFIX)) {
        items.push({ value: "editSubgraph", label: "Edit Subgraph" });
    }
    return items;
});
const classes = computed(() => ({
    "--selected": props.selected,
    "--dragging": dragMove.dragging.value,
    "--two-column": !!props.node.twoColumn,
}));
const styles = computed(() => ({    
    top: `${props.node.position?.y ?? 0}px`,
    left: `${props.node.position?.x ?? 0}px`,
    width: `${props.node.position.width ?? 200}px`,
    "box-shadow" : props.node.isStartNode() ? "0 0 0 3px green" : undefined,        
}));
const displayedInputs = computed(() => Object.values(props.node.inputs).filter((ni) => !ni.hidden && ni.port));
const displayedOutputs = computed(() => Object.values(props.node.outputs).filter((ni) => !ni.hidden && ni.port));
const displayedOptions = computed(() => 
{
    let inputOptions = Object.values(props.node.outputs).filter((ni) => !ni.hidden && !ni.port);
    let outputOptions = Object.values(props.node.inputs).filter((ni) => !ni.hidden && !ni.port);    
    return inputOptions.concat(outputOptions)
})
const select = () => {
    emit("select");
};
const startDrag = (ev: PointerEvent) => {
    dragMove.onPointerDown(ev);
    document.addEventListener("pointermove", dragMove.onPointerMove);
    document.addEventListener("pointerup", stopDrag);
    select();
};
const stopDrag = () => {
    dragMove.onPointerUp();
    document.removeEventListener("pointermove", dragMove.onPointerMove);
    document.removeEventListener("pointerup", stopDrag);
};
const openContextMenu = () => {
    showContextMenu.value = true;
};
const onContextMenuClick = async (action: string) => {
    switch (action) {
        case "delete":
            graph.value.removeNode(props.node);
            break;
        case "rename":
            tempName.value = props.node.title;
            renaming.value = true;
            await nextTick();
            renameInputEl.value?.focus();
            break;
        case "editSubgraph":
            switchGraph((props.node as AbstractNode & IGraphNode).template);
            break;
    }
};
const doneRenaming = () => {
    if(graphStore.isNameOk(props.node,tempName.value))
    {        
        props.node.title = tempName.value
    }
    renaming.value = false;
};
const onRender = () => {
    if (el.value) {
        viewModel.value.hooks.renderNode.execute({ node: props.node, el: el.value });
    }
};

const handleResize = (event : Array<ResizeObserverEntry>) => {
    // otherwise this will be overwriting tab-out events, where they are made invisible.
    if(event[0].contentRect.width > 0 && event[0].contentRect.height > 0)
    {
    props.node.position.width = event[0].contentRect.width;
    props.node.position.height = event[0].contentRect.height;
    }
}

onMounted(() => {
    new ResizeObserver(handleResize).observe(el.value);    
    onRender()
});
onBeforeUnmount(() => {
    el.value.removeEventListener('resize', handleResize)
})
onUpdated(onRender);
</script>

<style scoped>
.resizableNode
{
    resize: both;
    overflow: scroll;
}

</style>
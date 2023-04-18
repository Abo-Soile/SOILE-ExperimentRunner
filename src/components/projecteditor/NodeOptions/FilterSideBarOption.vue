<template>
    <div>
        <div class="blockdiv">
        <label for="addFilter">Filter Name:</label>
        <input type="text" :value=newFilterName @input="event => newFilterName = event.target.value" name="addFilter">
        </div>
        <div class="blockdiv">
        <label for="addOutput">Filter expression:</label>
        <input type="text" :value=newFilter @input="event => newFilter = event.target.value" name="addOutput">
        </div>
        <button @click="createFilter()"> Create Filter </button>
        <table v-if=" currentFilters.size > 0">
        <tr v-for="(output, key) in currentFilters">
            <td class="tooltip-source">{{ output[0] }}<div class="tooltip-text"> {{ output[1] }}</div></td>
            <td><button :name=key @click="removeFilter(key)"> Remove Filter </button></td>
        </tr>
        </table>        
    </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from "vue-property-decorator";
import FilterNode from '../NodeTypes/FilterNode'
@Component
export default class FilterSideBarOption extends Vue {

    nodeID = ""
    currentNode: FilterNode
    newFilterName = ""
    newFilter = ""
    currentFilters = new Map<string,string>

    @Prop({ type: Object })
    item!: object;

    @Watch('$attrs.node')
    onNodeChange(newValue: {outputInterfaces : [] }, oldValue: { outputInterfaces : [] }) {
        this.updateNodeData();
    }

    createFilter()
    {
        if(this.newFilterName)
        {
            console.log("Adding output");
            this.currentNode.addFilter(this.newFilterName, this.newFilter)
        }
        this.newFilterName = "";
        this.newFilter = "";
    }

    removeFilter(output : string) 
    {
        console.log("removing output: " + output)
        this.currentNode.removeFilter(output)        
    }
    
    updateNodeData()
    {
        this.nodeID = this.$attrs.node.id;
        this.currentNode = this.$attrs.value();
        this.currentFilters = this.currentNode.getFilters();        
    }

    mounted(){                                        
        this.updateNodeData();
    }
}
</script>
<style scoped>
.div.blockdiv{
 display:block
}
table { border: none; }

.tooltip-source {
  position: relative;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  overflow: visible
}

.tooltip-source:hover .tooltip-text {
  visibility: visible;
}

</style>
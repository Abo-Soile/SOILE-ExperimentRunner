<template>
  <div>
    <FilterSetup
      :node="intf.data"
      v-model:filterName="newFilterName"
      v-model:filterString="newFilter"
      @saveFilter="createFilter()"
      buttonLabel="Create Filter"
    ></FilterSetup>
    <table class="filterTable" v-if="currentFilters.size > 0">
      <div v-for="(output, key) in currentFilters">
        <tr>
          <td class="tooltip-source">
            {{ output[0] }}
            <div class="tooltip-text">{{ output[1].filterstring }}</div>
          </td>
          <td>
            <button class="baklava-button" @click="removeFilter(output[0])">Remove Filter</button>
          </td>
          <td v-if="!isEditing(key)">
            <button class="baklava-button" @click="editFilter(key)">Edit Filter</button>
          </td>
        </tr>
        <tr v-if="isEditing(key)">
          <td colspan="2">
            <FilterSetup
              :filterName="output[0]"
              :filterString="output[1].filterstring"
              :node="intf.data"
              buttonLabel="Update Node"
              @saveFilter="(event) => saveFilter(event, key)"
            ></FilterSetup>
          </td>
        </tr>
      </div>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FilterNode from '../NodeTypes/FilterNode'
import { ComponentInterface } from '../NodeInterfaces/ComponentInterface'
import { FilterSetup } from '@/components'

export default defineComponent({
  props: {
    intf: {
      type: Object as () => ComponentInterface<FilterNode>,
      required: true
    }
  },
  components: { FilterSetup },
  data() {
    return {
      newFilterName: '',
      newFilter: '',
      editing: []
    }
  },
  setup(props) {
    const currentNode = props.intf.data
    const nodeID = currentNode?.id
    const currentFilters = currentNode.Filters
    return { currentNode, nodeID, currentFilters }
  },
  methods: {
    createFilter() {
      if (this.newFilterName) {
        console.log('Adding output')
        this.currentNode.addFilter(this.newFilterName, this.newFilter)
      }
      // we reset the editing, if we have
      this.editing = []
      this.newFilterName = ''
      this.newFilter = ''
    },

    removeFilter(output: string) {
      console.log('removing output: ' + output)
      this.currentNode.removeFilter(output)
      this.editing = []
    },
    editFilter(index: number) {
      this.editing.push(index)
    },
    isEditing(index: number): boolean {
      return this.editing.includes(index)
    },
    updateNodeData() {},
    saveFilter(event: { oldName: string; name: string; value: string }, index: number) {
      console.log(event)
      this.currentNode.updateFilter(event.oldName, event.name, event.value)
      this.editing = this.editing.filter((e: number) => e != index)
    }
  },
  watch: {
    currentNode() {
      this.updateNodeData()
    }
  },
  computed: {
    currentNode() {
      return this.intf.data
    },
    nodeID() {
      this.updateNodeData.id
    }
  },
  mounted() {
    this.updateNodeData()
  }
})
</script>

<style scoped>
.div.blockdiv {
  display: block;
}

table {
  border: none;
}

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
  overflow: visible;
}

.tooltip-source:hover .tooltip-text {
  visibility: visible;
}

.filterTable {
  width: 100%;
}
</style>

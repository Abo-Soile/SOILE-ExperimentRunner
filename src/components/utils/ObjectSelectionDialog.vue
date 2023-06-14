<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :header="'Select ' + objectType"
    :style="{ width: '50vw' }"
  >
    <ObjectAndVersionSelector :object-type="objectType" @update-selection="setSelected" />
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="$emit('selected', false)" text />
      <Button
        label="Select"
        icon="pi pi-check"
        @click="$emit('selected', selectionValid ? selected : false)"
        autofocus
        :disabled="!selectionValid"
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ObjectAndVersionSelector from './ObjectAndVersionSelector.vue'

export default {
  components: { Button, Dialog, ObjectAndVersionSelector },
  emits: ['selected', 'update:visible'],
  props: {
    objectType: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selected: undefined
    }
  },
  methods: {
    setSelected(selected) {
      console.log(selected)
      this.selected = selected
    }
  },
  computed: {
    selectionValid() {
      if (this.selected?.uuid && this.selected?.version) {
        return true
      } else {
        return false
      }
    },
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  }
}
</script>

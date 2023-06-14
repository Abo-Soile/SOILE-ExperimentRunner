<template>
  <div class="taskbar flex">
    <div v-if="newTask" class="taskbarfield p-field">
      <InputText
        label="Task Name"
        v-model="currentName"
        placeHolder="Choose a name for the Task"
      ></InputText>
    </div>
    <div v-else class="flex taskbarfield p-field">
      <h2>{{ currentName }}</h2>
    </div>
    <div class="taskbarfield p-field">
      <Dropdown
        v-model="selectedCodeType"
        :options="codeOptions"
        placeholder="Select Code Style"
        label="Code Style"
      />
    </div>
    <div class="taskbarfield p-field">
      <Dropdown
        v-model="selectedVersion"
        :options="codeTypeVersions"
        :disabled="!selectedCodeType"
        label="Code Style Version"
        placeholder="Select Code Version"
      />
    </div>
    <div class="taskbarfield">
      <Button class="taskbarfield" :disabled="!isValid" :label="saveLabel" @click="save"></Button>
    </div>
    <div v-if="!newTask" class="taskbarfield">
      <Button class="taskbarfield" label="Reload" @click="reload"></Button>
    </div>
    <div v-if="!newTask" class="taskbarfield">
      <Button
        class="taskbarfield"
        label="Change Version"
        @click="showChangeVersion = true"
        @select="changeTaskVersion"
      ></Button>
    </div>
    <SelectNewVersionDialog
      @selected="changeTaskVersion"
      objectType="task"
      :element="task"
      v-model:visible="showChangeVersion"
    ></SelectNewVersionDialog>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ObjectAndVersionSelectorWithProps from '@/components/utils/ObjectAndVersionSelectorWithProps.vue'
import SelectNewVersionDialog from '@/components/utils/SelectNewVersionDialog.vue'

export default {
  name: 'TaskBar',
  props: {
    codeType: {
      type: String
    },
    codeVersion: {
      type: String
    },
    // the task is the Name/UUID combination.
    task: {
      type: Object,
      required: false
    },
    taskVersion: {
      type: Object,
      required: true
    },
    codeTypeOptions: {
      type: Object,
      required: true
    },
    newTask: {
      type: Boolean,
      required: true
    },
    // this is somewhat hackish, but necessary to allow an update of the enclosing validity.
    valid: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      currentType: null,
      showChangeVersion: false
    }
  },
  computed: {
    codeTypeVersions() {
      const selectedType = this.codeTypeOptions[this.codeType]
      console.log(this.codeTypeOptions)
      console.log(this.codeType)
      console.log(selectedType)
      return selectedType ? selectedType.versions : []
    },
    codeOptions() {
      const codeOptions = []
      Object.keys(this.codeTypeOptions).forEach((element) => {
        console.log(element)
        codeOptions.push(element)
      })
      return codeOptions
    },
    selectedCodeType: {
      get() {
        return this.codeType
      },
      set(newValue) {
        // reset the version, since the value changed;
        if (this.currentType != newValue) {
          this.selectedVersion = null
        }
        this.currentType = newValue
        this.$emit('update:codeType', newValue)
      }
    },
    selectedVersion: {
      get() {
        return this.codeVersion
      },
      set(newValue) {
        // reset the version, since the value changed;
        this.$emit('update:codeVersion', newValue)
      }
    },
    currentName: {
      get() {
        return this.task.name
      },
      set(newValue) {
        // reset the version, since the value changed;
        console.log('Setting new Name')
        this.$emit('update:task', { name: newValue })
      }
    },
    // this is just a VERY informal check.
    isValid() {
      // either new or has a task and version to base any changes on.
      const taskBasicsOK =
        (this.newTask && this.currentName != '') ||
        (this.task.name != null && this.taskVersion.version != null)
      const taskTypeOk = this.codeType != null && this.codeVersion != null
      console.log('Emitting an update for valid')
      this.$emit('update:valid', taskBasicsOK && taskTypeOk)
      return taskBasicsOK && taskTypeOk
    },
    saveLabel() {
      return this.newTask ? 'Create Task' : 'Save'
    }
  },
  methods: {
    save() {
      this.$emit('save')
    },

    reload() {
      // Perform reload logic here
      this.$emit('changeTaskVersion', taskVersion)
    },
    changeTaskVersion(updated) {
      if (updated) {
        this.$emit('changeTaskVersion', updated)
      }
    }
  },
  components: {
    Dropdown,
    Button,
    ObjectAndVersionSelectorWithProps,
    InputText,
    SelectNewVersionDialog
  }
}
</script>

<style scoped>
.p-field {
  margin-bottom: 1rem;
}

.taskbar {
  width: 100%;
}

.taskbarfield {
  display: inline-block;
  margin-left: 5px;
}
</style>

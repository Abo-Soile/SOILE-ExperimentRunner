<template>
    <Dialog v-model:visible="isVisible" modal :header="'Saving ' + name">
      <div>
            <div class="flex align-items-center mb-2">
                <label for="tag">Please indicate a name for the version:</label>
                <InputText :class="isTagNotOk ? 'p-invalid' : ''" id="tag" v-model="tag" />
            </div>
        </div>            
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="isVisible = false" text ></Button>
            <Button label="Save Version" :disabled="isTagNotOk" icon="pi pi-check" @click="submit"></Button>
        </template>
    </Dialog>
</template>

<script>

import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { defineComponent } from 'vue'
export default defineComponent({
    components: { Dropdown, InputText, Button, Dialog, Checkbox },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        currentTags: {
            type: Array,
            required: true
        }
    },
    emits: ['update:visible', 'submit'],
    data() {
        return {
            tag: "",
        }
    },
    methods:
    {
        submit() {
            this.$emit("submit", this.tag)            
        }

    },
    computed:
    {
        isTagNotOk()
        {
            return this.tag === "" || this.currentTags.includes(this.tag);
        },
        isVisible:
        {
            get() {
                return this.visible;
            },
            set(newValue) {
                this.$emit('update:visible', newValue)
            }
        }        
    },
})
</script>


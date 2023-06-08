<template>
    <div class="grid">
        <div class="col flex flex-column">
            <label for="element">{{elementTitle}}</label>
    <Dropdown id="element" :class="dropDownClasses" v-model="selectedElement" :options="availableItems" :loading=loading
        :optionLabel=elementLabel :placeholder="'Select ' + objectType" />
        </div>
        <div class="col flex flex-column">
            <label for="version">{{versionTitle}}</label>
    <Dropdown id="version" :class="dropDownClasses" v-if="selectedElement" v-model="selectedVersion" :options="availableVersions"
        :optionLabel=versionLabel :disabled="!elementSelected" placeholder="Select Version" />
        </div>
    </div>
</template>

<script>

import Dropdown from 'primevue/dropdown'
import { useElementStore } from '@/stores';
import { defineComponent } from 'vue'
export default defineComponent({
    components: { Dropdown },
    props: {
        objectType: {
            type: String,
            required: true
        },
        element: {
            type: Object,
            required: false
        },
        version: {
            type: [ Object , String ],
            required: false
        },
        elementLabel: {
            type: String,
            default: "name"
        },
        versionLabel: {
            type: String,
            default: "tag"
        },
        dropDownClasses: {
            type: String
        },
        elementTitle: {
            type: String,
            default: (props) => props.objectType
        },
        versionTitle: {
            type: String,
            default: "Version"
        }
    },
    emits: ['update:element', 'update:version'],
    data() {
        return {
            loading: true,
            currentElement: undefined,
            currentVersion: undefined,
            availableItems: [],
            availableVersions: []
        }
    },
    setup() {
        const elementStore = useElementStore();
        return { elementStore: elementStore }
    },
    computed:
    {
        elementSelected()
        {
            return this.currentElement != undefined 
        },
        selectedItem() { 
            return { name: this.selectedElement?.name, uuid: this.selectedElement?.uuid, version: this.selectedVersion?.version } 
        },
        selectedElement: {
            get() {
                return this.element ? this.element : this.currentElement;
            },
            set(newValue) {

                // reset the version, since the value changed;
                if (this.currentElement != newValue) {
                    this.selectedVersion = undefined;
                }
                this.currentElement = newValue;
                this.$emit('update:element', newValue)
            }
        },            
        selectedVersion:
        {
            get() {         
                console.log(this.version)
                if(typeof this.version === 'string' )       
                {
                    return this.availableVersions.find((x) => x.version === this.version)
                }
                else
                {
                    return this.version ? this.version : this.currentVersion;
                }
            },
            set(newValue) {                
                // reset the version, since the value changed;                
                console.log("setting version");
                this.currentVersion = newValue;
                this.$emit('update:version', newValue)
            }
        }
    },
    methods: {
        async updateAvailableVersions(uuid)
        {
            const versions = await this.elementStore.getOptionsForElement(uuid, this.objectType.toLowerCase())
            this.availableVersions = versions.filter((x) => x.tag)
                                             .map(((x) => {return {tag: x.tag , version: x.version}}))            
        }
    },
    watch:
    {
        selectedItem: {
            handler(newValue) {
                this.$emit("update:element", newValue);
            },
            deep: true
        },
        'selectedItem.uuid': {            
            async handler(newValue) {
                console.log("SelectedItem uuid changed")
                if(newValue)
                {
                    this.updateAvailableVersions(newValue)
                }
            }
        }
    },
    async mounted() {
        // TODO: heck whether this savely works with onMounted or whether this should be done with onDisplay
        console.log(this.objectType);
        this.loading = true;
        await this.elementStore.updateAvailableOptions(this.objectType.toLowerCase());
        this.availableItems = await this.elementStore.getListForType(this.objectType.toLowerCase())
        if(this.selectedItem.uuid)
        {
            await this.updateAvailableVersions(this.selectedItem.uuid)
        }
        this.loading = false;
        this.currentElement = this.element;
    }
})
</script>

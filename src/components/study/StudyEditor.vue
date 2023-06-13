<template>
    <h2>{{ currentStudy.name }}</h2>
    <div class="grid studydisplay">
        <div class="displaypart col-4 h-full">
            <h3> Project Properties </h3>
            <ObjectAndVersionSelectorWithProps :dropDownClasses="isProjectEditable ? '' : 'p-disabled'"
                v-model:element=sourceProject v-model:version=sourceVersion objectType="project"
                versionTitle="at Version" elementTitle="Project Name" />
            <StudyProperties v-model:name="currentStudy.name" 
                v-model:descriptionShort="currentStudy.shortDescription"
                v-model:descriptionLong="currentStudy.description" 
                v-model:shortCut="currentStudy.shortcut"
                v-model:private="currentStudy.private" 
                @update:valid="(event) => dataValid = event" />

        </div>
        <div class="displaypart col-3">
            <StudyActivity 
            v-model:active="currentStudy.active"
            :accessTokens="accessTokens"
            :permanentToken="permanentAccessToken"
            :usedTokens="usedTokens"
            @createTokens="(event) => createAccessTokens(event)"
            @createMasterToken="createMasterToken"
            ></StudyActivity>
        <!-- Study properties-->    
    </div>
    <div class="displaypart col-5">
        Avaiable Data 
        <StudyDataSelector :projectID=selectedStudy.UUID :availableData="availableData"></StudyDataSelector>
    </div>
    </div>
</template>


<script>

import Dropdown from 'primevue/dropdown'
import ObjectAndVersionSelectorWithProps from '@/components/utils/ObjectAndVersionSelectorWithProps.vue';
import { useStudyStore, useElementStore } from '@/stores'
import { reactive } from 'vue'

import StudyProperties from './StudyProperties.vue'
import StudyActivity from './StudyActivity.vue'
import StudyDataSelector from './StudyDataSelector.vue'

export default {

    components: { StudyDataSelector, ObjectAndVersionSelectorWithProps, Dropdown, StudyProperties, StudyActivity },
    props:
    {
        editableStudies: {
            type: Array,
            required: true
        },
        selectedStudy: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dataValid: true,
            accessTokens: [],
            permanentAccessToken: null,
            usedTokens: [],
            availableData : {},
        }
    },
    setup(props) {
        console.log("Setting up StudyEditor");
        const currentStudy = reactive(JSON.parse(JSON.stringify(props.selectedStudy)))
        const projectStore = useStudyStore();
        const elementStore = useElementStore();        
        return { currentStudy, elementStore, projectStore }
    },
    computed:
    {
        isProjectEditable() {

            return this.selectedStudy.UUID == null || this.editableStudies.map((x) => x.uuid).includes(this.selectedStudy.UUID);
        },
        sourceProject: {            
            get()
            {
                return this.elementStore.availableProjects.find((x) => x.uuid === this.selectedStudy.sourceUUID);
            },
            set(newValue)
            {
                this.selectedStudy.sourceUUID = newValue.uuid;
            }
        },
        sourceVersion: {            
            get()
            {                
                return this.selectedStudy.version
            },
            set(newValue)
            {
                if(newValue)
                {
                    this.selectedStudy.version = newValue.version;
                }
                else 
                {
                    this.selectedStudy.version = undefined;
                }
            }
        }
    },
    watch: {
        // on an updated project, we reparse it. 
        selectedStudy(newValue) {
            console.log("Selected Project Changed");
            this.currentStudy = reactive(JSON.parse(JSON.stringify(this.selectedStudy)))
            this.updateData();

        },
        async "currentStudy.active"(newValue)
        {
            console.log("Activity of current project changed");
            if(newValue)
            {                
                this.projectStore.activate(this.currentStudy.UUID);
            }
            else
            {
                this.projectStore.deactivate(this.currentStudy.UUID);
            }
        }
    },
    methods: {
        updateData()
        {
            console.log("Updating Data for Study in Editor")
            this.updateTokenData();
            this.updateAvailableDLData();
        },
        async updateTokenData()
        {
            console.log("Updating token data");
            const tokenInformation = await this.projectStore.getTokenInformation(this.currentStudy.UUID);
            this.usedTokens = tokenInformation.usedTokens || [];
            this.accessTokens = tokenInformation.signupTokens || [];
            this.permanentAccessToken = tokenInformation.permanentAccessToken || '';
        },
        async updateAvailableDLData()
        {
            this.availableData = await this.projectStore.getDownloadableData(this.currentStudy.UUID)
        },
        async createAccessTokens(count)
        {            
            await this.projectStore.generateTokens(this.currentStudy.UUID, count)
            await this.updateTokenData();
        },
        async createMasterToken()
        {
            await this.projectStore.generateMasterToken(currentStudy)
            await this.updateTokenData();
        }

    },
    mounted() {
        if(this.currentStudy && this.currentStudy.UUID)
        {
            console.log("StudyEditor Mounted")
            this.updateData();        
        }
    }
    
}

</script>

<style scoped>

.displaypart {    
    margin: 2px auto;    
    border: 1px solid
}
.studydisplay {
    min-height: 50vh;
    height: 100%;
}
</style>
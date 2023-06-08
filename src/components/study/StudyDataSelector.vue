<template>
    <Tree v-model:selection-keys="selectedElements"  :value="currentSelectionView" selectionMode="checkbox" >
    <template #default="slotProps">
            <div  v-if="slotProps.node.type==='participant'">
                {{ slotProps.node.label }}
                <i v-if=slotProps.node.data class="pi pi-check" ></i>
            </div>
            <div v-else>
                {{ slotProps.node.label }}
            </div>
        </template>    
    </Tree>
    <div v-if="!waitingForDL">
        <Button :disabled="!tasksSelected && !participantsSelected" label="Download selected Data" @click="downloadSelected"></Button>
        <Button label="Download all Data" @click="downloadAll"></Button>
    </div>
    <div v-else>
        <ProgressSpinner></ProgressSpinner>
    </div>
</template>


<script>

import Tree from 'primevue/tree'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';

export default {

    components: { Tree, Button, ProgressSpinner },
    props:
    {
        availableData: {
            type: Object,
            required: true
        },
        projectID: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selectedData: {},
            selectedElements: null,
            selectedTasks: null,
            downloadID: null,
            waitingForDL: false,
            downloadReady: false,
        }
    },
    computed:
    {
        participantSelectionView()
        {
            if(!this.availableData.participants)
            {
                return [];
            }
            const participants = [];
            const participantElement = {key: 'Participants', label: "Participants", icon: 'pi pi-user',  type: "group", children : participants};
            this.availableData.participants.forEach((participant) =>
            {
                participants.push({key: participant.participantID, label: participant.participantID, type: "participant", data: participant.finished, icon: 'pi pi-user'})
            })            
            return participantElement;
        },
        taskSelectionView()
        {    
            if(!this.availableData.tasks)
            {
                return [];
            }        
            const tasks = [];
            const taskElement = {key: 'Tasks', label: "Tasks", icon: 'pi pi-folder',  children : tasks};
            this.availableData.tasks.forEach((task) =>
            {
                tasks.push({key: task.taskID , label: task.taskName, type: "element", data: task.taskID, icon: 'pi pi-document'})
            })
            return taskElement;
        },
        currentSelectionView()
        {
            if(this.tasksSelected)
            {
                return [this.taskSelectionView]
            }
            else 
            {
                if(this.participantsSelected)
                {
                    return [this.participantSelectionView]
                }
                else
                {
                    return [this.taskSelectionView, this.participantSelectionView]
                }
            }
        },
        tasksSelected()
        {            
            return this.selectedElements != null && "Tasks" in this.selectedElements
        },
        participantsSelected()
        {
            return this.selectedElements != null && "Participants" in this.selectedElements
        }
    },
    watch: {   
        downloadReady(newValue)     
        {
            if(this.downloadID && newValue)
            {
                
            }
        }
    },
    methods: {
        downloadSelected()
        {   
            this.waitingForDL = true;
            // download whatever was selected, either tasks or participants.
            const request = {};
            if("Tasks" in this.selectedElements)
            {
                const tasks = [];
                for(const task of this.selectedElements)
                {
                    if(task != "Tasks")
                    {
                        tasks.push(task);
                    }
                }
                request.tasks = tasks;
            }
            else
            {
                const participants = [];
                for(const participant of this.selectedElements)
                {
                    if(task != "Participants")
                    {
                        participants.push(participant);
                    }
                }
                request.participants = participants;
            }   
            this.download(request);
        },
        downloadAll()
        {
            this.waitingForDL = true;
            this.download("all");           
        },
        async download(request)
        {            
            this.downloadID = await this.studyStore.requestDownload(this.projectID, request);
            if(this.downloadID)
            {

            }
            else
            {
                this.waitingForDL = false;
            }
        }
    },
    mounted() {

    }
    
}

</script>

<style scoped>

.displaypart {
    margin: 2 auto;
    border: 1 solid;
}
.studydisplay {
    min-height: 50vh;
    height: 100%;
}
</style>
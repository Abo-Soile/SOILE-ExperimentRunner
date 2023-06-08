<template>
    <div v-if="selectedProject">
        <h2> {{ selectedProject.name }}</h2>
        <p> {{ selectedProject.description }}</p>
        <!-- TODO: check whether already signed up if user is logged in or authed in a different way-->        
        <div v-if="signedUpProjects.includes(selectedProject.uuid)">
            <div v-if="authStore.isAnonymous"> 
                <h2>Your token for this Project is: </h2>
                <p style="color:red">{{ authStore.projectToken }}</p>
                <h4> Note this token carfully as it is needed to continue if you quit your current execution.</h4>
            </div>
            <router-link :to="'/exp/'+selectedProject.uuid + '/' + userStore.currentTaskSettings.id + '/'" custom v-slot="{ navigate }" @click="startProject(selectedProject.uuid)">
                <Button v-if="justSignedUp[selectedProject.uuid]" @click="navigate" role="link">Start project</Button>
                <Button v-else @click="navigate" role="link">Continue project</Button>
            </router-link>
        </div>
        <div v-else>
            <Button v-if="authStore.user" @click="signUp()">Sign up as user</Button>
            <Button v-else @click="signUp()">Sign up</Button>
        </div>
    </div>
    <router-link v-else to="/">Back to Start</router-link>
</template>

<script setup>
import Button from 'primevue/button';
import { useProjectStore, useAuthStore, useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';

var justSignedUp = {};
const projectStore = useProjectStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const { signedUpProjects:signedUpProjects, selectedProject: selectedProject } = storeToRefs(projectStore);
console.log(selectedProject);

function startProject(uuid)
{
    justSignedUp[uuid] = false;
}

async function signUp() {
    console.log("Signing up to project " + this.selectedProject.uuid)    
    const signedUp = await authStore.signUp(this.selectedProject.uuid)
    console.log(signedUp)
    if(signedUp)
    {
        justSignedUp[this.selectedProject.uuid] = true;
        console.log("Signup was successful")
        await authStore.refreshSession();
        console.log("Updating signed up projects")
        await projectStore.fetchSignedUpProjects();        
        await userStore.updateTaskSettings(this.selectedProject.uuid);        
    }
    else{
        console.log("Signup was unsuccessful")
    }
}

watch(projectStore.selectedProject, async (newID) => {    
    console.log("selectedProject changed to: ")
    await userStore.updateTaskSettings(newID.uuid);
})
onMounted( async () => {
    //console.log("Signup Mounted: ")
    //console.log(projectStore.selectedProject)
    
    
})


</script>
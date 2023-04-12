<template>
    <b-table small :fields="fields" :items="items" responsive="sm">
        <!-- Project Name -->
        <template #cell(name)="data">
            {{ data.value }}
        </template>

        <!-- Link to signup for project  -->
        <template #cell(uuid)="data">
            <router-link :to="'/signup/' + data.value" @click="listStore.selectProject(data.index)">Start</router-link>
        </template>

        <!-- Optional default data cell scoped slot -->
        <template #cell(continue)="data">
            <!-- TODO: Retrieve information whether the user has already started this, and only display it if they have, otherwise this is empty.-->
            <b-button v-if=authStore.user @click="runProject(data.index)">Continue or Start</b-button>
            <b-form v-else class="d-flex" @submit="(event) => continueProject(data.index, event)">                
                <b-form-input type="text" v-model="continueTokens[data.index]" required></b-form-input>
                <b-button size="sm" type="submit" variant="primary">Continue Project</b-button>
            </b-form>
        </template>
    </b-table>
</template>
    
<script setup>
import { router } from '@/helpers';
import { useProjectStore, useUserStore ,useAuthStore} from '@/stores';
const listStore = useProjectStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const continueTokens = {};

const props = defineProps({
    items: {
        type: Array,
    }
});

async function runProject(index)
{    
    console.log("Rerouting to " + props.items[index].uuid)
    await userStore.updateTaskSettings(props.items[index].uuid);
    console.log(userStore.currentTaskSettings.id);
    router.push('/exp/' + props.items[index].uuid + "/" + userStore.currentTaskSettings.id + "/") 
}

async function continueProject(index,event)
{    
    event.preventDefault();
    const continueToken = continueTokens[index]    
    console.log("Continuing project: Setting Project token")
    await authStore.setProjectToken(continueToken)
    console.log("Updating login status")
    await authStore.updateLoginStatus()
    console.log("Running project")
    
    runProject(index)
}

const fields = [
    { key: "name", label: "Project Name", tdClass: 'align-middle' },
    { key: "uuid", label: "Select Project", tdClass: 'align-middle' },
    { key: "continue", label: "Continue Project with Token", tdClass: 'align-middle' }
]

</script>
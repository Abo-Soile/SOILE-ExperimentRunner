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
            <b-form v-else class="d-flex" @submit="continueProject(data.index)">                
                <b-form-input type="text" v-model="continueTokens[data.index]" required></b-form-input>
                <b-button size="sm" type="submit" variant="primary">Continue Project</b-button>
            </b-form>
        </template>
    </b-table>
</template>
    
<script setup>
import { useProjectStore ,useAuthStore} from '@/stores';
const listStore = useProjectStore();
const authStore = useAuthStore();

const continueTokens = {};

defineProps({
    items: {
        type: Array,
    }
});

function runProject(index)
{
    router.push('/exp/' + items[index].uuid)
}

async function continueProject(index)
{    
    const continueToken = continueTokens[index]    
    await authStore.setProjectToken(continueToken)
    runProject(index)
}

const fields = [
    { key: "name", label: "Project Name", tdClass: 'align-middle' },
    { key: "uuid", label: "Select Project", tdClass: 'align-middle' },
    { key: "continue", label: "Continue Project with Token", tdClass: 'align-middle' }
]

</script>
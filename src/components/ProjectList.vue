<template>
    <div>
        <DataTable :value="items" :editable="true">
            <Column field="name" header="Name"></Column>
            <Column header="Start">
                <template #body="{data, index}" let-index="index">
                    <div>
                        <router-link :to="'/signup/' + data.uuid"
                            @click="listStore.selectProject(index)">Start</router-link>
                    </div>
                </template>
            </Column>
            <Column header="Continue">
                <template #body="{data, index}" let-index="index">
                    <div>
                        <InputText v-if=!authStore.user v-model="continueTokens[index]"></InputText>
                        <Button label="Continue" @click="(event) => runProject(index, event)"></Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
  
<script setup>

import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';

import { router } from '@/helpers';
import { useProjectStore, useUserStore, useAuthStore } from '@/stores';
const listStore = useProjectStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const continueTokens = {};

const props = defineProps({
    items: {
        type: Array,
    }
});

async function runProject(index, event) {
    if (authStore.authed) {
        console.log("Rerouting to " + props.items[index].uuid)
        await userStore.updateTaskSettings(props.items[index].uuid);
        console.log(userStore.currentTaskSettings.id);
        router.push('/exp/' + props.items[index].uuid + "/" + userStore.currentTaskSettings.id + "/")
    }
    else {
        await continueProject(index, event)
    }
}

async function continueProject(index, event) {
    event.preventDefault();
    const continueToken = continueTokens[index]
    console.log("Continuing project: Setting Project token")
    await authStore.setProjectToken(continueToken)
    console.log("Updating login status")
    await authStore.updateLoginStatus()
    console.log("Running project")

    runProject(index)
}

</script>
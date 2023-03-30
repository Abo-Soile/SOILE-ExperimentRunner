<template>
    <h2> {{ selectedProject.name }}</h2>
    <p> {{ selectedProject.description }}</p>
    <!-- TODO: check whether already signed up if user is logged in-->    
    <b-button v-if="authStore.user" @click="authStore.signUp(selectedProject.uuid)">Sign up as user</b-button>
    <b-button v-else @click="signUp()">Sign up</b-button>    
</template>

<script setup>

import { useProjectStore, useAuthStore } from '@/stores';
import { storeToRefs } from 'pinia';

const projectStore = useProjectStore();
const authStore = useAuthStore();
const {  selectedProject : selectedProject } = storeToRefs(projectStore);       
const signedUpprojects = [];
async function signUp()
{
    authStore.signUp(selectedProject.uuid)

}



</script>
<template>
    <div>
        <h1>Welcome to Soile</h1>
        <ProjectList :items="projects"></ProjectList>
    </div>
</template>

<script setup>
import ProjectList from '@/components/ProjectList.vue'
import { useProjectStore } from '@/stores/project';

import { storeToRefs } from 'pinia';
const listStore = useProjectStore();
console.log(storeToRefs(listStore));
const { projects: projects } = storeToRefs(listStore);        

</script>

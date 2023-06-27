<template>
  <div>
    <ProjectList :items="availableStudies"></ProjectList>
  </div>
</template>

<script setup>
import ProjectList from "@/components/ProjectList.vue";
import { useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
const projectStore = useProjectStore();
console.log(storeToRefs(projectStore));
const { availableStudies: availableStudies } = storeToRefs(projectStore);
</script>

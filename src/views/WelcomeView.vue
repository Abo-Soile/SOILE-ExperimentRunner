<template>
  <div>
    <ProjectList :items="availableProjectInstances"></ProjectList>
  </div>
</template>

<script setup>
import ProjectList from "@/components/ProjectList.vue";
import { useProjectStore } from "@/stores";
import { storeToRefs } from "pinia";
const projectStore = useProjectStore();
console.log(storeToRefs(projectStore));
const { availableProjectInstances: availableProjectInstances } =
  storeToRefs(projectStore);
</script>

<template>
  <div>
    <ProjectList :items="availableProjectInstances"></ProjectList>
  </div>
</template>

<script setup>
import ProjectList from '@/components/ProjectList.vue'
import { useProjectStore } from '@/stores'

import { storeToRefs } from 'pinia'
const listStore = useProjectStore()
console.log(storeToRefs(listStore))
const { availableProjectInstances: availableProjectInstances } = storeToRefs(listStore)
</script>

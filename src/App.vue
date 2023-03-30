<script setup>
import TopNavBar from './components/TopNavbar.vue'
import { useProjectStore, useErrorStore  } from '@/stores';
import { watch } from 'vue';
const projectStore = useProjectStore();
    projectStore.updateAvailableProjects();
const errorStore = useErrorStore();

function showErrorToast(message, type)
{  

  $bvToast.toast(message, {
          title: 'Issue with ' + type,
          variant: 'danger',
          solid: true
        })
}

watch(errorStore.latestError, (newError) => {
  if(newError)
  {
    showErrorToast(newError.message,newError.class);
  }
})

</script>
<template>
  <TopNavBar></TopNavBar>
  <router-view></router-view>
</template>


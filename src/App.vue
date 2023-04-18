<script setup>
import TopNavBar from './components/TopNavbar.vue'
import { storeToRefs } from 'pinia'
import { useProjectStore, useErrorStore, useUserStore, useAuthStore } from '@/stores';
import { watch } from 'vue';

const errorStore = useErrorStore();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const userStore = useUserStore();
authStore.updateLoginStatus();
projectStore.updateAvailableProjects();
projectStore.fetchSignedUpProjects();
const {errors, latestError} = storeToRefs(errorStore)
const {isRunningTask} = storeToRefs(userStore)
function showErrorToast(message, type)
{  
  try {
  $bvToast.toast(message, {
          title: 'Issue with ' + type,
          variant: 'danger',
          solid: true
        })
      }
      catch(error)
      {
        console.log("Issue with " + type + ": " + message )
      }
}

watch(latestError, (newError) => {
  console.log("Received new errror")
  if(newError)
  {
    showErrorToast(newError.message,newError.class);
  }
})

</script>
<template>
  <div>
    <TopNavBar v-if="!isRunningTask"></TopNavBar>
    <router-view></router-view>
  </div>
</template>


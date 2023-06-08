<script setup>
import TopNavBar from './components/TopNavbar.vue'
import { storeToRefs } from 'pinia'
import { useProjectStore, useErrorStore, useUserStore, useAuthStore } from '@/stores';
import { watch } from 'vue';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
const toastInstance = useToast();
const errorStore = useErrorStore();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const userStore = useUserStore();
authStore.updateLoginStatus();
projectStore.updateAvailableStudies();
projectStore.fetchSignedUpStudies();
const {errors, latestError} = storeToRefs(errorStore)
const {isRunningTask} = storeToRefs(userStore)
function showErrorToast(severity, message)
{  
  console.log("Adding error Toast");
  console.log(severity)
  console.log(message)
  toastInstance.add({ severity: severity, detail: message, life: 10000 })
}

watch(latestError, (newError) => {
  console.log("Received new error")
  console.log(newError)
  if(newError)
  {
    showErrorToast(newError.severity,newError.message);
  }
})

</script>
<template>
  <div class="mainapp">
    <TopNavBar v-if="!isRunningTask">     
    </TopNavBar>     
    <Toast />   
    <router-view></router-view>
  </div>
</template>

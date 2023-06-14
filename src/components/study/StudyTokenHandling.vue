<template>
  <Button
    v-if="generalToken === ''"
    label="Create Token for access"
    @click="generateMasterToken"
  ></Button>
  <div v-else>
    The master token for this project is:
    <div>
      {{ generalToken }}
    </div>
  </div>
  <Button label="Create Tokens" @click=""></Button>
</template>

<script setup>
// Proper Creation of individual access tokens. Also needs backend end point to check for actives.
import Button from 'primevue/button'
import { useProjectStore } from '@/stores'
import { ref } from 'vue'
const projectStore = useProjectStore()

const generalToken = ref('')
const accessTokens = ref([])

const props = defineProps({
  active: {
    type: Boolean,
    required: true
  },
  projectID: {
    type: String,
    required: true
  }
})

// generate a master token for the project.
async function generateMasterToken() {
  generalToken.value = await projectStore.generateMasterToken(props.projectID)
}
</script>

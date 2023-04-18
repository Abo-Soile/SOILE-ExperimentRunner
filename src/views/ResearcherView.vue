<template>
    <ProjectEditor></ProjectEditor>
</template>
  
<script>
import axios from 'axios';
import ProjectEditor from '../components/projecteditor/ProjectEditor.vue';
import { mapState } from 'pinia'
import { useErrorStore } from '@/stores';
import { useUserStore } from '@/stores';


export default {

    name: 'ResearcherView',
    components: { ProjectEditor },
    data() {
        return {
            code: undefined,
            running: false
        }
    },    
}
</script>
  
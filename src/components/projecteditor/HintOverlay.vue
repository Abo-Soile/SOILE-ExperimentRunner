<template>
    <div v-if="showHints" class="hint">
        <div class="flex align-items-center">
            <div class="flex-grow-1"><b>Tips:</b></div>
            <button class="baklava-button" @click="showHints=false">
                <i class="pi pi-times" />
            </button>            
        </div>
        <br />
        The start node is highlighted with a green frame<br/>
        Right-click on empty space to add new nodes<br />
        Drag a connection from the end interface to remove it
    </div>
</template>

<script>
import Button from 'primevue/button'
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            showHints : true,
        }
    }
})
</script>
<style>
.hint {
    position: absolute;    
    top: 60px;
    left: 250px;
    z-index: 5;
    padding: 1rem;
    background: #0003;
    color: white;    
}
</style>
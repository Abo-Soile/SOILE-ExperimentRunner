<template>
    <div class="grid">
        <div class="col flex flex-column">    
    <Button v-if="active" label="Deactivate Study" @click="this.$emit('update:active',false)"></Button>
    <Button v-else label="Activate Study" @click="this.$emit('update:active',true)"></Button>    
    
    <Button v-if="permanentToken != null  && permanentToken != ''" label="Create Permanent Access Token"  @click="$emit('createMasterToken')" />
    <div v-else> Permanent Access token is : {{ permanentToken }}</div>

    <Button label="Create Access Tokens"  @click="showCreateTokensDialog=true" />
    <div v-if="accessTokens != null && accessTokens.length > 0">
    <ScrollPanel :style="{ width: '100%', height: maxSignupSize + 'rem'}"  >
        <ul>
            <li v-for="token in accessTokens"> {{ token }}</li>
        </ul>
    </ScrollPanel>
    </div>
    <div v-if=" usedTokens != null && usedTokens.length > 0">
    <ScrollPanel :style="{ width: '100%', height: maxUsedSize + 'rem'}"  >
        <ul>
            <li v-for="token in usedTokens"> {{ token }}</li>
        </ul>
    </ScrollPanel>
    </div>
    

    </div>
    <Dialog v-if=showCreateTokensDialog v-model:visible="showCreateTokensDialog">
        <div class="grid">
            <div class="col">
                <label for="project">How many tokens to you want to create</label>
            </div>
            <div class="col">
                <InputNumber v-model="tokenCount"/>
            </div>
        </div>        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="showCreateTokensDialog=false" text />
            <Button label="Create" icon="pi pi-check" @click="createTokens" autofocus :disabled="!(tokenCount > 0)" />
        </template>
    </Dialog>
    </div>
</template>

<script setup>

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import ScrollPanel from 'primevue/scrollpanel';
import {ref, defineEmits, computed} from 'vue'
const props = defineProps({
    active: { 
        type: Boolean,
        required: true
    },
    accessTokens: {
        type: Array,
        required: true
    },
    permanentToken: {
        type: [String, null],
        required: true
    },
    usedTokens: {
        type: Array,
        required: true
    }

})
const emit = defineEmits(['update:active', 'createTokens', 'createMasterToken'])
const showCreateTokensDialog=ref(false)
const tokenCount = ref(10);

function createTokens()
{
    // hide dialog
    showCreateTokensDialog.value = false;
    emit('createTokens', tokenCount.value);
    // reset tokenCount
    tokenCount.value = 10;
}


const maxSignupSize = computed(() => math.max(accessTokens.length, 10) )
const maxUsedSize = computed(() => math.max(usedtokens.length, 10) )

//TODO: Deactivate project. 
</script>
<template>
    <div ref="el" class="baklava-select" :class="{ '--open': open }" :title="options.name" @click="open = !open">
        <div class="__selected">
            <div class="__text">
                {{ selectedText }}
            </div>
            <div class="__icon">
                <i-arrow />
            </div>
        </div>
        <transition name="slide-fade">
            <div v-show="open" class="__dropdown">
                <div class="item --header">
                    {{ options.name }}
                </div>
                <div
                    v-for="(item, i) in options.items"
                    :key="i"
                    :class="['item', { '--active': item === selected }]"
                    @click="setSelected(item)"
                >
                    {{ item.text }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">

import { onClickOutside } from "@vueuse/core";
import { computed, defineComponent, ref } from "vue";
import Arrow from '@/components/icons/DownArrow.vue';

export interface SelectionItem
{
    value? : any,
    text? : string
}
export default defineComponent({
    components: {
        "i-arrow": Arrow,
    },
    props: {
        options: {
            type: Object as () => {
                name : string,
                items: [ SelectionItem ]                
            },
            required: true
        },
        selected: {
            type: Object as () => SelectionItem ,
            required: true
        }
    },
    emits: ['itemSelected'],

    setup(props) {
        const el = ref<HTMLElement | null>(null);
        const open = ref(false);

        onClickOutside(el, () => {
            open.value = false;
        });

        return { el, open };
    },

    computed: {
        selectedText()
        {
            if(this.selected?.value)
            {
                return this.selected.text;
            }
            else{
                return "";
            }
        }
    },
    methods: {
        setSelected(item  : SelectionItem)
        {            
            this.$emit("itemSelected", item);
        }
    },
});
</script>

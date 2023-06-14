<template>
  <div v-if="items.length > 0">
    <h5>{{ title }}</h5>
    <ul>
      <li style="display: block" v-for="item in items" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    intf: {
      type: Object as () => ComponentInterface,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      items: new Array<string>(),
    };
  },
  mounted() {
    this.title = this.intf.data.title;
    this.items = this.intf.data.items;
  },
});
</script>

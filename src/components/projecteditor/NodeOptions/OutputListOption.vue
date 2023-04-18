<template>
    <div v-if="items.length > 0">
      <h5>{{ title }}</h5>
      <ul>
        <li style="display:block" v-for="item in items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { INodeOption, INodeInterface } from "baklavajs/baklavajs-core/types";


  @Component
  export default class OutputListOption extends Vue {


    @Prop({ type: Object })
    option!: INodeOption|INodeInterface;

    public title = "";
    public items = new Array<string>;

    mounted()
    {
      console.log("mounting");
      this.items = this.option.items || [];
      this.title = this.option.title || "Outputs:"
    }
  }
  </script>
 
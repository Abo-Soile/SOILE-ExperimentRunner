<template>
    <div>
      <h3>Select an item:</h3>
      <Listbox v-model="selectedItem" :options="items" @change="updateContent"/>
      <h3>Content for selected item:</h3>
      <Listbox :options="content"/>
    </div>
  </template>
  
  <script>
  import { Listbox } from 'primevue/listbox';
  
  export default {
    name: 'ItemList',
    components: {
      Listbox,
    },
    props: {
        items: {
            type: Array
        }
    },
    data() {
      return {
        selectedItem: null,
        content: [],
      };
    },
    methods: {
      updateContent() {
        // Use the selected item to fetch content from an API or from a local data store
        // and update the `content` array
        switch (this.selectedItem) {
          case 'item1':
            this.content = [
              {label: 'Content A', value: 'contentA'},
              {label: 'Content B', value: 'contentB'},
              {label: 'Content C', value: 'contentC'},
            ];
            break;
          case 'item2':
            this.content = [
              {label: 'Content D', value: 'contentD'},
              {label: 'Content E', value: 'contentE'},
              {label: 'Content F', value: 'contentF'},
            ];
            break;
          case 'item3':
            this.content = [
              {label: 'Content G', value: 'contentG'},
              {label: 'Content H', value: 'contentH'},
              {label: 'Content I', value: 'contentI'},
            ];
            break;
          default:
            this.content = [];
            break;
        }
      },
    },
  };
  </script>
  
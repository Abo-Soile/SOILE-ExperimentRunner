<template>
  <div>
  <QuestionnaireComponent v-for="(element, index) in inlineGroups" :key='"component_" + index' :component_data="element" @dataUpdate="dataUpdate" />
  </div>
</template>

<script>
import QuestionnaireComponent from "./QuestionnaireComponent.vue";

export default {
  props: {
    paragraph_data: {
      type: Array,
      required: true,
    },
  },
  emits: ['dataUpdate'],
  methods: {
    dataUpdate(data) {
      this.$emit("dataUpdate", data);
      console.log(data);
    },
  },
  computed: {
    inlineGroups() {
      var groups = [];
      var currentgroup = [];
      for (const element of this.paragraph_data) {
        if (element.data.inline) {
          currentgroup.push(element);
        } else {
          if (currentgroup.length > 0) {
            groups.push(currentgroup);
          }
          // start with the new element
          currentgroup = [];
          groups.push([element]);
        }
      }
      if (currentgroup.length > 0) {
        groups.push(currentgroup);
      }
      console.log(groups);
      return groups;
    },
  },
  components: { QuestionnaireComponent, QuestionnaireComponent },
  emits: ["dataUpdate"]
};
</script>

<style scoped>
b-form-row {
  
}
</style>

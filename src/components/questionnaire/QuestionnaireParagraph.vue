<template>
  <div class="flex w-full flex-column">
    <QuestionnaireComponent
      v-for="(element, index) in inlineGroups"
      :key="'component_' + index"
      :component_data="element"
      @dataUpdate="dataUpdate"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  props: {
    paragraph_data: {
      type: Array,
      required: true,
    },
  },
  emits: ["dataUpdate"],
  methods: {
    dataUpdate(data) {
      this.$emit("dataUpdate", data);
    },
  },
  computed: {
    inlineGroups() {
      var groups = [];
      var currentgroup = [];
      for (const element of this.paragraph_data) {
        console.log(element);
        console.log(element.data.inline);

        if (element.data.inline) {
          currentgroup.push(element);
        } else {
          if (currentgroup.length > 0) {
            groups.push(currentgroup);
          }
          // start with the new element
          currentgroup = [];
          currentgroup.push(element);
        }
        console.log(currentgroup);
      }

      // final item
      if (currentgroup.length > 0) {
        groups.push(currentgroup);
      }

      return groups;
    },
  },
  components: {
    QuestionnaireComponent: defineAsyncComponent(() =>
      import("./QuestionnaireComponent.vue")
    ),
  },
  emits: ["dataUpdate"],
};
</script>

<style scoped>
b-form-row {
}
</style>

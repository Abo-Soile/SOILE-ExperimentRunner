<template>
  <div>
    <QuestionnaireInlineComponent
      v-for="(element, index) in component_data"
      :key="index"
      :element="element"
      @dataUpdate="dataUpdate"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import QuestionnaireInlineComponent from "./QuestionnaireInlineComponent.vue";

export default {
  props: {
    component_data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      questionnaire_data: {},
    };
  },
  emits: ["dataUpdate"],
  methods: {
    dataUpdate(data) {
      this.$emit("dataUpdate", data);
    },
  },
  mounted() {},
  components: {
    QuestionnaireInlineComponent,
  },
};
</script>

<style scoped>
div {
  float: left;
}
</style>

<template>
  <QuestionnaireStyledText v-if="hasStyle" :data="data" />
  <QuestionnaireUnstyledText v-else :data="data" />
</template>

<script>
import QuestionnaireUnstyledText from "./QuestionnaireUnstyledText.vue";
import QuestionnaireStyledText from "./QuestionnaireStyledText.vue";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { QuestionnaireUnstyledText, QuestionnaireStyledText },
  computed: {
    hasStyle() {
      return Object.keys(this.data.style).length === 0 ? false : true; // this will return false for an empty string
    },
  },
};
</script>

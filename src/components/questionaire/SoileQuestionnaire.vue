<template>    
    <b-form inline v-for="(paragraph, index) in source_data" :key='"paragraph_" + index'>
      <QuestionnaireParagraph
        :paragraph_data="paragraph"
      ></QuestionnaireParagraph>
    </b-form>    
</template>

<script>
import QuestionnaireParagraph from "./QuestionnaireParagraph.vue";

export default {
  props: {
    source_data: {
      type: Array,
      required: true,
    },    
  },
  data() {
    return {
      questionnaire_data: {},
    };
  },
  components: { QuestionnaireParagraph },
};
</script>

<style scoped>

</style>

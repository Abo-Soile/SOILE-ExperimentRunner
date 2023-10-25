<template>
  <span v-if="data.type == 'text'">{{ content }}</span>
  <h3 v-else-if="data.type == 'subtitle'">{{ content }}</h3>
  <h1 v-else-if="data.type == 'title'">{{ content }}</h1>
  <a v-else-if="data.type == 'link'" :href="data.href" target="_blank">
    {{ content }}
  </a>
  <QuestionnairePersonalLink
    v-if="data.type == 'personalLink'"
    :data="data"
  ></QuestionnairePersonalLink>
</template>

<script>
import QuestionnairePersonalLink from "./QuestionnairePersonalLink.vue";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { QuestionnairePersonalLink },
  computed: {
    content() {
      return this.data.text;
    },
  },
};
</script>

<style scoped>
span {
  display: inline;
  white-space: pre-wrap;
}
a {
  display: inline;
  white-space: pre-wrap;
}
</style>

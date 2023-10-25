<template>
  <span v-if="data.type == 'text'" :style="computedStyle">{{ content }}</span>
  <h3 v-else-if="data.type == 'subtitle'" :style="computedStyle">
    {{ content }}
  </h3>
  <h1 v-else-if="data.type == 'title'" :style="computedStyle">
    {{ content }}
  </h1>
  <a
    v-else-if="data.type == 'link'"
    :href="data.href"
    target="_blank"
    :style="computedStyle"
  >
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
    computedStyle() {
      return this.data.style
        ? Object.entries(this.data.style)
            .map(([k, v]) => `${k}:${v}`)
            .join(";")
        : ""; // empty if there is no style field.
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

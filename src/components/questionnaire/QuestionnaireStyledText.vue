<template>
  <span v-if="data.type == 'text'" :style="textStyle">{{ content }}</span>
  <h3 v-else-if="data.type == 'subtitle'" :style="textStyle">
    {{ content }}
  </h3>
  <h1 v-else-if="data.type == 'title'" :style="textStyle">
    {{ content }}
  </h1>
  <a
    v-else-if="data.type == 'link'"
    :href="data.href"
    target="_blank"
    :style="textStyle"
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
import { getStyle } from "@/helpers/styleHelper.js";

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
    textStyle() {
      return getStyle(this.data.style);
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

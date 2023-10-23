<template>
  <span>
    <span class="mb-2 mr-sm-2 mb-sm-0 justify-content-center" v-if="hasStyle">
      <span
        class="flex"
        v-if="data.type == 'text'"
        :style="computedStyle"
        v-html="content"
      ></span>
      <h3
        v-else-if="data.type == 'subtitle'"
        :style="computedStyle"
        v-html="content"
      ></h3>
      <h1
        v-else-if="data.type == 'title'"
        :style="computedStyle"
        v-html="content"
      ></h1>
      <a
        v-else-if="data.type == 'link'"
        class="flex"
        :href="data.target"
        target="_blank"
        :style="computedStyle"
        v-html="content"
      >
      </a>
      <QuestionnairePeronsalLink
        v-if="data.type == 'personalLink'"
        :data="data"
      ></QuestionnairePeronsalLink>
    </span>
    <span class="mb-2 mr-sm-2 mb-sm-0 justify-items-center" v-else>
      <span v-if="data.type == 'text'" class="flex" v-html="content"></span>
      <h3 v-else-if="data.type == 'subtitle'" v-html="content"></h3>
      <h1 v-else-if="data.type == 'title'" v-html="content"></h1>
      <a
        class="flex"
        v-else-if="data.type == 'link'"
        :href="data.href"
        target="_blank"
        v-html="content"
      >
      </a>
      <QuestionnairePeronsalLink
        v-if="data.type == 'personalLink'"
        :data="data"
      ></QuestionnairePeronsalLink>
    </span>
  </span>
</template>

<script>
import QuestionnairePeronsalLink from "./QuestionnairePersonalLink.vue";
import { getMarkDownContent } from "@/helpers/markDownHelper";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { QuestionnairePeronsalLink },
  computed: {
    content() {
      return getMarkDownContent(this.data.text);
    },
    computedStyle() {
      return this.data.style
        ? Object.entries(this.data.style)
            .map(([k, v]) => `${k}:${v}`)
            .join(";")
        : ""; // empty if there is no style field.
    },
    hasStyle() {
      return this.computedStyle ? true : false; // this will return false for an empty string
    },
  },
};
</script>

<style scoped>
div {
  white-space: pre-wrap;
}
</style>

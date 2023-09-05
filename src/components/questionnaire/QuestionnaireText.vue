<template>
  <div>
    <span class="mb-2 mr-sm-2 mb-sm-0" v-if="hasStyle">
      <div v-if="data.type == 'text'" :style="computedStyle">{{ content }}</div>
      <h3 v-else-if="data.type == 'subtitle'" :style="computedStyle">
        {{ content }}
      </h3>
      <h1 v-else-if="data.type == 'title'" :style="computedStyle">
        {{ content }}
      </h1>
      <a
        v-else-if="data.type == 'link'"
        :href="data.target"
        target="_blank"
        :style="computedStyle"
      >
        {{ content }}
      </a>
    </span>
    <span class="mb-2 mr-sm-2 mb-sm-0" v-else>
      <div v-if="data.type == 'text'">{{ content }}</div>
      <h3 v-else-if="data.type == 'subtitle'">{{ content }}</h3>
      <h1 v-else-if="data.type == 'title'">{{ content }}</h1>
      <a v-else-if="data.type == 'link'" :href="data.href" target="_blank">
        {{ content }}
      </a>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
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

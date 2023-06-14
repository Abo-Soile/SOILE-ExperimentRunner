<template>
  <Editor></Editor>
</template>

<script>
import Editor from "@/components/projecteditor/Editor.vue";

export default {
  name: "ResearcherView",
  components: { Editor },
  data() {
    return {
      code: undefined,
      running: false,
      currentTabs: [],
    };
  },
  mounted() {},
};
</script>

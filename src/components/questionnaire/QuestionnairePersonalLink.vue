<template>
  <a :href="href" target="_blank" :style="computedStyle"> {{ data.text }}</a>
</template>

<script>
import { mapState } from "pinia";
import { useProjectStore } from "@/stores";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useProjectStore, ["currentTaskSettings"]),
    href() {
      return (
        this.data.href +
        (this.currentTaskSettings.participantID
          ? this.currentTaskSettings.participantID
          : "USER_ID")
      );
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

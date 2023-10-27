<template>
  <a :href="href" target="_blank" :style="style">{{ content }}</a>
</template>

<script>
import { mapState } from "pinia";
import { useProjectStore } from "@/stores";
import { getStyle } from "@/helpers/styleHelper.js";

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
    content() {
      return this.data.text;
    },
    textStyle() {
      return getStyle(this.source_data.style);
    },
  },
};
</script>

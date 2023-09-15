<template>
  <table :style="tableStyle">
    <tr :style="tableStyle" v-for="(row, index) in tableRows">
      <td :style="tableStyle" v-for="(column, colindex) in row">
        <QuestionnaireParagraph
          class="col-12 questionnaire"
          v-for="(paragraph, index) in column"
          :key="'paragraph_' + index"
          @dataUpdate="dataUpdate"
          :paragraph_data="paragraph"
        >
        </QuestionnaireParagraph>
      </td>
    </tr>
  </table>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  props: {
    source_data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  emits: ["dataUpdate"],
  methods: {
    dataUpdate(data) {
      this.$emit("dataUpdate", data);
    },
  },
  computed: {
    tableStyle() {
      return this.source_data.style;
    },
    tableRows() {
      return this.source_data.tableRows;
    },
  },
  mounted() {},
  components: {
    QuestionnaireParagraph: defineAsyncComponent(() =>
      import("./QuestionnaireParagraph.vue")
    ),
  },
};
</script>

<style scoped></style>

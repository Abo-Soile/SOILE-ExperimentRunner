<template>
  <QuestionnaireTable
    v-if="element.type == 'table'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireDropDownMenu
    v-if="element.type == 'dropdownmenu'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireNumberField
    v-if="element.type == 'numberfield'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireTextBox
    v-else-if="element.type == 'textbox'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireTextArea
    v-else-if="element.type == 'textarea'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireSlider
    v-else-if="element.type == 'slider'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireMultiSelect
    v-else-if="element.type == 'select'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireSingleSelect
    v-else-if="element.type == 'selectradio'"
    @dataUpdate="dataUpdate"
    :source_data="element.data"
  />
  <QuestionnaireText v-else-if="element.type == 'html'" :data="element.data" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import QuestionnaireDropDownMenu from "./QuestionnaireDropDownMenu.vue";
import QuestionnaireText from "./QuestionnaireText.vue";
import QuestionnaireMultiSelect from "./QuestionnaireMultiSelect.vue";
import QuestionnaireNumberField from "./QuestionnaireNumberField.vue";
import QuestionnaireSingleSelect from "./QuestionnaireSingleSelect.vue";
import QuestionnaireSlider from "./QuestionnaireSlider.vue";
import QuestionnaireTextArea from "./QuestionnaireTextArea.vue";
import QuestionnaireTextBox from "./QuestionnaireTextBox.vue";

export default {
  props: {
    element: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      questionnaire_data: {},
    };
  },
  emits: ["dataUpdate"],
  methods: {
    dataUpdate(data) {
      this.$emit("dataUpdate", data);
    },
  },
  mounted() {},
  components: {
    QuestionnaireText,
    QuestionnaireNumberField,
    QuestionnaireDropDownMenu,
    QuestionnaireSingleSelect,
    QuestionnaireMultiSelect,
    QuestionnaireTextBox,
    QuestionnaireTextArea,
    QuestionnaireSlider,
    QuestionnaireTable: defineAsyncComponent(() =>
      import("./QuestionnaireTable.vue")
    ),
  },
};
</script>

<style scoped></style>

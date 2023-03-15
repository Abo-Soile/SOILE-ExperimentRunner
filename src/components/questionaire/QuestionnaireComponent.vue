<template>
  <b-input-group v-for="(element, index) in component_data" :key="index">
    <QuestionnaireDropDownMenu
      v-if="element.type == 'dropdownmenu'"
      @dataUpdate="dataUpdate"
      :source_data="element.data"
    />
    <QuestionnaireNumberField
      v-if="element.type == 'numberfield'"
      @dataUpdate="dataUpdate"
      :source_data="element.data"/>
    <QuestionnaireTextBox v-else-if="element.type=='textbox'" @dataUpdate="dataUpdate" :source_data="element.data"/>
    <QuestionnaireTextArea v-else-if="element.type=='textarea'" @dataUpdate="dataUpdate" :source_data="element.data"/>
    <QuestionnaireSlider v-else-if="element.type=='slider'" @dataUpdate="dataUpdate" :source_data="element.data"/>
    <QuestionnaireMultiSelect v-else-if="element.type=='select'" @dataUpdate="dataUpdate" :source_data="element.data"/>
    <QuestionnaireSingleSelect v-else-if="element.type=='selectradio'" @dataUpdate="dataUpdate" :source_data="element.data"/>
    <QuestionnaireText v-else-if="element.type == 'html'" :data="element.data" />
  </b-input-group>
</template>

<script>
import QuestionnaireDropDownMenu from "./QuestionnaireDropDownMenu.vue";
import QuestionnaireText from "./QuestionnaireText.vue";
import QuestionnaireMultiSelect from './QuestionnaireMultiSelect.vue';
import QuestionnaireNumberField from "./QuestionnaireNumberField.vue";
import QuestionnaireSingleSelect from "./QuestionnaireSingleSelect.vue";
import QuestionnaireSlider from "./QuestionnaireSlider.vue";
import QuestionnaireTextArea from "./QuestionnaireTextArea.vue";
import QuestionnaireTextBox from "./QuestionnaireTextBox.vue";

export default {
  props: {
    component_data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      questionnaire_data: {},
    };
  },
  methods: {
    dataUpdate(data) {
      this.$emit('dataUpdate', data)
    },
  },
  mounted()
  {
  },
  components: { QuestionnaireText, QuestionnaireNumberField, QuestionnaireDropDownMenu, QuestionnaireSingleSelect, QuestionnaireMultiSelect, QuestionnaireTextBox, QuestionnaireTextArea, QuestionnaireSlider },
};
</script>

<style scoped>

</style>

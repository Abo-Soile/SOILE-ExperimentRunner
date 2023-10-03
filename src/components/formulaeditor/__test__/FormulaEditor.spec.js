import { describe, it, expect, beforeEach } from "vitest";

import { mount } from "@vue/test-utils";
import PrimeVue from "primevue/config";

import FormulaEditor from "../FormulaEditor.vue";
import { nextTick } from "vue";

beforeEach(async () => {});

describe("FormulaEditor", () => {
  it("renders correctly", async () => {
    const testFormula = "Variable1 + 2 = 3";
    const wrapper = mount(FormulaEditor, {
      props: {
        variables: ["Variable1", "Variable2"],
        formula: testFormula,
      },
      global: {
        plugins: [PrimeVue],
      },
    });
    expect(wrapper.vm.isValid).toBe(true);
    expect(wrapper.vm.internalFormula).toEqual(testFormula);
    // displays the variables
    expect(wrapper.text()).toContain("Variable1");
    expect(wrapper.text()).toContain("Variable2");
  });
});

<template>
  <div>
    <div class="grid">
      <!-- Variables Panel -->
      <div class="col-3">
        <h3>Variables</h3>
        <div class="grid">
          <div
            class="col-6 p-button m-1 justify-content-center"
            v-for="(variable, index) in variables"
            :key="index"
            :id="variable"
            @dragstart="
              (event) => startDrag(event, variable, index, 'variable')
            "
            @click="addElementAtCursor(variable, 'variable')"
            draggable="true"
          >
            {{ variable }}
          </div>
        </div>
      </div>

      <!-- Operators Panel -->
      <div class="col-3">
        <h3>Operators</h3>
        <div class="grid">
          <div
            class="col-1 p-button m-1 justify-content-center"
            v-for="(operator, index) in operators"
            :key="index"
            :id="operator.symbol"
            @dragstart="
              (event) => startDrag(event, operator.symbol, index, 'operator')
            "
            @click="addElementAtCursor(operator.symbol, 'operator')"
            draggable="true"
          >
            {{ operator.symbol }}
          </div>
        </div>
      </div>
      <!-- Functions Panel -->
      <div class="col-3">
        <h3>Functions</h3>
        <div class="grid">
          <div
            class="col-3 p-button m-1 justify-content-center"
            v-for="(func, index) in filterFunctions"
            :key="index"
            :id="func.symbol"
            @dragstart="
              (event) => startDrag(event, func.symbol, index, 'function')
            "
            @click="addElementAtCursor(func.symbol, 'function')"
            draggable="true"
          >
            {{ func.symbol }}
          </div>
        </div>
      </div>
      <!-- Number Panel -->
      <div class="col-3">
        <h3>Numbers</h3>
        <div class="grid">
          <div
            class="col-3 p-button m-1 justify-content-center"
            v-for="(number, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.']"
            :key="index"
            :id="number.toString()"
            @dragstart="
              (event) => startDrag(event, number.toString(), index, 'number')
            "
            @click="addElementAtCursor(number.toString(), 'number')"
            draggable="true"
          >
            {{ number }}
          </div>
        </div>
      </div>
      <!-- Formula Editor Workspace -->
      <div class="workspace col-12" @dragover.prevent @drop="handleDrop">
        Formula
        <div class="formula">
          <!-- Input field for manual formula input -->
          <input
            :class="[
              'p-inputtext',
              'p-component',
              'w-full',
              isValid ? '' : 'p-invalid',
            ]"
            ref="formulaInput"
            v-model="internalFormula"
          />
        </div>
        <div v-if="!isValid" class="text-red-500 text-xs">{{ this.error }}</div>
      </div>
    </div>
    <span ref="helperSpan" class="helper"></span>
  </div>
</template>

<script lang="ts">
import InputText from "primevue/inputtext";
import { Operators, FilterFunctions, checkFormula } from "@/helpers/formula";
import { nextTick } from "vue";

export default {
  props: {
    variables: {
      type: Array<string>,
      default: ["task1.a", "task2.b", "task3.c"],
    },
    formula: {
      type: String,
      required: true,
    },
  },
  components: {
    InputText,
  },
  data() {
    return {
      operators: Operators,
      filterFunctions: FilterFunctions,
      insertPosition: 0,
      formulaOffset: 0,
      dragType: "variable",
      error: "",
    };
  },
  emits: ["formulaValid", "update:formula"],
  methods: {
    startDrag(event: DragEvent, item: string, index: number, type: string) {
      // Store the dragged item's data
      event.dataTransfer?.setData("text/plain", item);
      this.dragType = type;
      // Optionally, you can store the index for reference
      event.dataTransfer?.setData("index", index.toString());
    },

    handleDrop(event: DragEvent) {
      event.preventDefault();
      this.setDropPosition(event);
      // Get the dropped data
      const droppedItem = event.dataTransfer?.getData("text/plain");
      // Add the dropped item to the formula at the cursor position
      if (droppedItem) {
        this.addToFormula(droppedItem, this.dragType);
      }
    },

    setDropPosition(event: DragEvent) {
      console.log(this.formulaOffset);

      const x =
        event.clientX -
        this.$refs.formulaInput.getBoundingClientRect().left -
        this.formulaOffset;
      console.log(x);
      for (let i = 0; i < this.formula.length; i++) {
        this.$refs.helperSpan.textContent = this.formula.substring(0, i + 1);

        const spanWidth = this.$refs.helperSpan.offsetWidth;
        console.log(this.formula.substring(0, i + 1) + ": " + spanWidth);
        if (spanWidth >= x) {
          this.insertPosition = i;
          return;
        }
      }
      checkFormula(this.internalFormula, this.variables);
      this.insertPosition = this.formula.length;
    },
    async addElementAtCursor(element: string, type: string) {
      console.log(this.$refs.formulaInput.selectionStart);
      const originalLength = this.formula.length;
      this.insertPosition = this.$refs.formulaInput.selectionStart;
      this.addToFormula(element, type);
      await nextTick();
      const newPosition =
        this.insertPosition +
        this.formula.length -
        originalLength -
        (type === "function" ? 2 : 0);
      this.$refs.formulaInput.setSelectionRange(newPosition, newPosition);
      this.$refs.formulaInput.focus();
    },
    addToFormula(text: string, type: string) {
      var offset = type === "number" ? "" : " ";
      if (this.formula.length <= this.insertPosition) {
        this.internalFormula = this.formula + offset + text;
      } else {
        const textBeforeCursor = this.formula.slice(0, this.insertPosition);
        const textAfterCursor = this.formula.slice(this.insertPosition);

        this.internalFormula = (
          textBeforeCursor +
          offset +
          text +
          offset +
          textAfterCursor
        ).replace("  ", " ");
      }
      this.$refs.formulaInput.focus();
    },
  },
  computed: {
    internalFormula: {
      get(): string {
        return this.formula;
      },
      set(newValue: string) {
        this.$emit("update:formula", newValue);
      },
    },
    isValid() {
      try {
        const valid = checkFormula(this.internalFormula, this.variables);
        if (valid) {
          this.error = "";
        } else {
          this.error = "Not a valid Formula";
        }
        this.$emit("formulaValid", valid);
        return valid;
      } catch (err) {
        console.log(err);
        this.error = err.message ? err.message : err;
        this.$emit("formulaValid", false);
        return false;
      }
    },
  },
  mounted() {
    console.log(this.$refs.formulaInput);
    const inputFieldStyle = window.getComputedStyle(this.$refs.formulaInput);
    this.formulaOffset =
      parseFloat(inputFieldStyle.paddingLeft) +
      parseFloat(inputFieldStyle.borderLeftWidth) +
      parseFloat(inputFieldStyle.marginLeft);
    console.log(inputFieldStyle);
    const styleToCopy = [
      "fontSize",
      "fontFamily",
      "fontWeight",
      "fontStyle",
      "letterSpacing",
    ];
    styleToCopy.forEach((prop) => {
      this.$refs.helperSpan.style[prop] = inputFieldStyle[prop];
    });
  },
};
</script>

<style scoped>
/* CSS styles remain the same as in the previous example */
.helper {
  position: absolute;
  visibility: hidden;
  white-space: pre;
}
</style>

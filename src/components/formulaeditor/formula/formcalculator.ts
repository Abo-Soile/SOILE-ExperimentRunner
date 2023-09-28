import { FilterFunctions, type FilterFunction } from "./functions";
import { Operator, Operators } from "./operators";

const functionNames = FilterFunctions.map((f) => f.name);
const operatorCharacters = Operators.map((op: Operator) => op.symbol)
  .join("")
  .replace(/[\/\-\\^$*+?.()|[\]{}]/g, "\\$&");

// forbidden characters are: all operator characters, all function names
/**
 * Check, whethera  formula is syntaktically correct. No logical checks are performed.
 * @param formulaString The string of the formula
 * @param variables the variables available
 * @returns
 */
export function checkFormula(formulaString: string, variables: Array<string>) {
  const invalid = variables.some((x: string) => {
    x.includes(",") ||
      functionNames.includes(x) ||
      Operators.some((op: Operator) => x.includes(op.symbol));
  });
  const sortedVariables = variables.sort((a: string, b: string) => {
    return b.length - a.length;
  });

  if (invalid) {
    throw "InvalidVariables";
  }
  console.log(formulaString);
  var updatedFormula = formulaString
    .replace(new RegExp(" *([,\\(\\)" + operatorCharacters + "]) *", "g"), "$1")
    .trim();
  console.log(updatedFormula);
  var currentFormulaString = handleInnermostParenthesis(
    updatedFormula,
    sortedVariables
  );
  console.log(currentFormulaString);
  while (updatedFormula != currentFormulaString) {
    updatedFormula = currentFormulaString;
    currentFormulaString = handleInnermostParenthesis(
      updatedFormula,
      sortedVariables
    );
    console.log(currentFormulaString);
  }
  return checkExpression(currentFormulaString, sortedVariables);
}

/**
 * The input String is a space-free input string.
 * @param inputString The input string to handle the innermost parenthesis
 * @param variables the variables available
 * @returns
 */
function handleInnermostParenthesis(
  inputString: string,
  variables: Array<string>
) {
  const innerMostPairs = findAllInnermostParentheses(inputString);
  if (innerMostPairs.length == 0) {
    // there is no parenthesis any more.
    return inputString;
  }
  // check if it is a function
  const replacementStrings = [];

  for (const parenthesisPair of innerMostPairs) {
    // check, whether it is a function:
    const start = parenthesisPair[0];
    const stop = parenthesisPair[1];
    const preFix = inputString.substring(0, start);
    var content = inputString.substring(start + 1, stop);
    console.log(content);
    const isFunction =
      content.includes(",") ||
      preFix.match(new RegExp("(^|[," + operatorCharacters + "])$")) == null;
    if (isFunction) {
      // we need to find the function this represents
      const expressions = content.split(",");
      for (const expression of expressions) {
        if (!checkExpression(expression, variables))
          throw "Problem with " + expression;
      }
      // determine the function
      // they are suffixfree.
      const cfunc = FilterFunctions.find((func: FilterFunction) =>
        preFix.endsWith(func.name)
      );
      if (!cfunc) {
        const matches = preFix.match(
          new RegExp(
            "[" +
              operatorCharacters +
              "](?:(?![" +
              operatorCharacters +
              "]).)*?$"
          )
        );
        if (matches) {
          throw "Unknown function: " + matches[0].substring(1);
        } else {
          throw "Problem at end of " + inputString.substring(0, stop);
        }
      }
      if (!cfunc.isArgCountAllowed(expressions.length)) {
        throw "Invalid number of Arguments for " + cfunc.name;
      }
      replacementStrings.push(cfunc.name + "(" + content + ")");
    } else {
      if (!checkExpression(content, variables)) {
        throw "Problem with " + content;
      }
      replacementStrings.push("(" + content + ")");
    }
  }
  var outputString = inputString;
  for (const replacement of replacementStrings) {
    outputString = outputString.replace(replacement, "1");
  }
  return outputString;
}

function checkExpression(
  expression: string,
  variables: Array<string>
): boolean {
  var content = expression;
  for (const variable of variables) {
    // the variables are sorted, so we just replace them by 1s)
    content = content.replaceAll(variable, "1");
  }

  // split at any position where a single operator is present.
  const entries = content.split(
    new RegExp(
      "(?<=[^" +
        operatorCharacters +
        "])[" +
        operatorCharacters +
        "](?=-|[^" +
        operatorCharacters +
        "])"
    )
  );
  for (const entry of entries) {
    if (entry.match(/^-?[0-9]+(.[0-9]+)?$/g) == null) {
      const onlyNumbersAndOps = new RegExp(
        "^[0-9." + operatorCharacters + "]+$"
      );
      if (entry.match(onlyNumbersAndOps) == null) {
        throw "Unknown variable: " + entry;
      }
    }
  }

  const opRegExp = new RegExp("-?[0-9]+(.[0-9]+)?[" + operatorCharacters + "]");
  var currentContent = content.replace(opRegExp, "");
  while (currentContent != content) {
    content = currentContent;
    currentContent = content.replace(opRegExp, "");
  }
  //const minimalExpression = expression.replaceAll(opRegExp, "");
  const exprOk = currentContent.match(/^-?[0-9]+(\.[0-9]+)?$/g);
  return exprOk != null && exprOk.length > 0;
}

function findAllInnermostParentheses(input: string): Array<[number, number]> {
  var openPosition = 0;
  var isOpen = false;
  var openCount = 0;
  const innermostPairs = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "(") {
      openCount++;
      isOpen = true; // Push the index of the opening parenthesis onto the stack
      openPosition = i;
    } else if (char === ")") {
      if (isOpen) {
        innermostPairs.push([openPosition, i]);
        isOpen = false;
      } else {
        if (openCount == 0) {
          throw "Non Matching closing parenthesis at position " + i;
        } else {
          openCount--;
        }
      }
    }
  }
  return innermostPairs;
}

export const exportForTesting = {
  checkExpression,
  handleInnermostParenthesis,
  Function,
};

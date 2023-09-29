import {
  operatorCharacters,
  functionNames,
} from "../formula/formcalculator.ts";

export function checkOutput(variableName) {
  return (
    variableName !== "" &&
    variableName.match(
      new RegExp(`[ ${operatorCharacters}]|${functionNames.join("|")}`)
    ) == null
  );
}

/**
 * Extract elements available for outputs from the QMarkUp language
 * @param {*} compiledCode
 * @returns
 */
export function extractQMarkUpOutputOptions(compiledCode) {
  const possibleOutputs = [];
  const possiblePersistent = [];
  // codeData.mapping is a JsonArray
  for (const dbElement of compiledCode.mapping) {
    // we use isNaN as we do convert strings to numbers in the outputs...
    console.log(dbElement);
    if (
      !isNaN(dbElement.defaultValue) &&
      !(
        typeof dbElement.defaultValue == "string" &&
        dbElement.defaultValue == ""
      ) &&
      checkOutput(dbElement.dbcolumn)
    ) {
      console.log("Added");
      possibleOutputs.push(dbElement.dbcolumn);
    } else {
      console.log(!isNaN(dbElement.defaultValue));
      console.log(dbElement.defaultValue != "");
      console.log(checkOutput(dbElement.dbcolumn));
    }
    possiblePersistent.push(dbElement.dbcolumn);
  }

  return {
    outputs: [...new Set(possibleOutputs)],
    persistent: [...new Set(possiblePersistent)],
    outputInfoType: "fixed",
  };
}
/**
 * Function to extract usable Variables from elang.
 * @param {*} code
 * @returns
 */
export function extractElangOutputOptions(code) {
  const outputs = [
    ...code.matchAll(/((savevariable)|(storesingle))\("(.*?)"/g),
  ].map((match) => match[4]);
  return {
    outputs: [...new Set(outputs)],
    persistent: [...new Set(outputs.concat["rows"])], // we can make rows persistent, even though the variable is the same for all elang experiment.
    outputInfoType: "fixed",
  };
}

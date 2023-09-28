import { describe, it, expect, afterEach } from "vitest";

import {
  exportForTesting,
  FilterFunctions,
  checkFormula,
} from "../formcalculator";

describe("formulaparser", () => {
  it("Checks expressions correctly", () => {
    const checkExpression = exportForTesting.checkExpression;
    const variables = ["task1.out1", "task2.out2"];
    const expression = "task1.out1+17.3-task2.out2^4/2%task1.out1";
    expect(checkExpression(expression, variables)).toBe(true);
    const secondExpression = "task1.out1+17.3-task2.out2^4/2%";
    expect(checkExpression(secondExpression, variables)).toBe(false);
    const thirdExpression = "task1.out1++17.3-task2.out2^4/2%4";
    expect(checkExpression(thirdExpression, variables)).toBe(false);
    const fourthExpression = "+task1.out1+17.3-task2.out2^4/2%2";
    expect(checkExpression(fourthExpression, variables)).toBe(false);
    const fifthExpression = "-task1.out1+17.3-task2.out2^4/2%15";
    expect(checkExpression(fifthExpression, variables)).toBe(true);
    expect(checkExpression("task1.out1", variables)).toBe(true);
    expect(checkExpression("17.3-task2.out2^4", variables)).toBe(true);
    const plusMinus = "task1.out1+-17.3-task2.out2^4/2%4";
    expect(checkExpression(plusMinus, variables)).toBe(true);
    const wrongVar = "task3.out1+-17.3-task2.out2^4/2%4";
    expect(() => checkExpression(wrongVar, variables)).toThrow(
      "Unknown variable: task3.out1"
    );
  });
  it("Handles innermost parenthesis", () => {
    const handleInnerMost = exportForTesting.handleInnermostParenthesis;
    const variables = ["task1.out1", "task2.out2"];
    const expression = "task1.out1+(17.3-task2.out2^4)/2%task1.out1";
    const expressionDone = "task1.out1+1/2%task1.out1";
    expect(handleInnerMost(expression, variables)).toEqual(expressionDone);
    const expression2 = "task1.out1+median(17.3,task2.out2)/2%task1.out1";
    expect(handleInnerMost(expression2, variables)).toEqual(expressionDone);
    const expression3 = "task1.out1+sqrt(17.3,task2.out2)/2%task1.out1";
    expect(() => handleInnerMost(expression3, variables)).toThrow(
      "Invalid number of Arguments for sqrt"
    );

    const expression5 = "task1.out1+sqrt(17.3)/2%task1.out1";
    expect(handleInnerMost(expression5, variables)).toEqual(expressionDone);

    const expression4 = "task1.out1+blubb(17.3,task2.out2)/2%task1.out1";
    expect(() => handleInnerMost(expression4, variables)).toThrow(
      "Unknown function: blubb"
    );
  });

  it("Handles Formulas", () => {
    const variables = ["task1.out1", "task2.out2"];
    const expression = "task1.out1+(17.3-task2.out2^4)/2%task1.out1";
    const expressionDone = "task1.out1+1/2%task1.out1";
    expect(checkFormula(expression, variables)).toBe(true);
    const expression2 = "task1.out1+median(17.3,task2.out2)/2%task1.out1";
    expect(checkFormula(expression2, variables)).toBe(true);
    const expression3 = "task1.out1+sqrt(17.3,task2.out2)/2%task1.out1";
    expect(() => checkFormula(expression3, variables)).toThrow(
      "Invalid number of Arguments for sqrt"
    );

    const expression5 = "task1.out1+sqrt(17.3)/2%task1.out1";
    expect(checkFormula(expression5, variables)).toBe(true);

    const expressionWithSpace =
      " task1.out1 + max( 17.3, mean( 2, 4) ) / 2 % task1.out1";
    expect(checkFormula(expressionWithSpace, variables)).toBe(true);

    const expression4 = "task1.out1+blubb(17.3,task2.out2)/2%task1.out1";
    expect(() => checkFormula(expression4, variables)).toThrow(
      "Unknown function: blubb"
    );

    const manyParenthesis =
      "(task1.out1)+( max(17.3, (17 + 2), (-3 + task2.out2))/2)%task1.out1";
    expect(checkFormula(manyParenthesis, variables)).toBe(true);
    const expression6 = "task3.out1+4-7=0";
    expect(() => checkFormula(expression6, variables)).toThrow(
      "Unknown variable: task3.out1"
    );
  });
});

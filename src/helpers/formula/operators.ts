export interface Operator {
  name: string;
  symbol: string;
}

const PLUS = {
  name: "plus",
  symbol: "+",
};

const MINUS = {
  name: "minus",
  symbol: "-",
};
const TIMES = {
  name: "multiply",
  symbol: "*",
};
const EXPONENT = {
  name: "power",
  symbol: "^",
};
const DIVIDE = {
  name: "divison",
  symbol: "/",
};
const REMAINDER = {
  name: "modulo",
  symbol: "%",
};
const OR = {
  name: "or",
  symbol: "|",
};

const AND = {
  name: "and",
  symbol: "&",
};

const EQUALS = {
  name: "equals",
  symbol: "=",
};

export const Operators = [
  DIVIDE,
  TIMES,
  MINUS,
  PLUS,
  REMAINDER,
  EXPONENT,
  OR,
  AND,
  EQUALS,
];

class Formula {
  variables: String[];
  getNumericalValue(variables: Map<String, number>): number {
    return 0;
  }
}

/**
 * Entries all Elements need to implement for a formula to "work";
 */
abstract class FormulaElement {
  precedence: number;
  parent: FormulaElement | Formula;
  constructor(precedence: number, parent: FormulaElement | Formula) {
    this.precedence = precedence;
    this.parent = parent;
  }
  abstract getNumericalValue(variables: Map<String, number>): number;
  abstract isValid(variables: Map<String, number>): boolean;
}

/**
 * An operator like  + / - / * / / or %
 */
abstract class Operator extends FormulaElement {
  leftValue: FormulaElement | null;
  rightValue: FormulaElement | null;
  abstract leftValid(variables: Map<String, number>): boolean;
  abstract rightValid(variables: Map<String, number>): boolean;
  abstract getSymbol(): string;
  getLeftValue(variables: Map<String, number>): number {
    return this.leftValue.getNumericalValue(variables);
  }
  getRightValue(variables: Map<String, number>): number {
    return this.leftValue.getNumericalValue(variables);
  }
  isValid(variables: Map<String, number>): boolean {
    return this.leftValid(variables) && this.rightValid(variables);
  }
  inValidReason(variables: Map<String, number>): string {
    const reasons = [];
    if (this.leftValid(variables)) {
      reasons.push("Left hand side not valid.");
    }
    if (this.rightValid(variables)) {
      reasons.push("Right hand side not valid.");
    }
    return reasons.join(" ");
  }
}
/**
 * A Variable or actual value
 */
class Value extends FormulaElement {
  value: string;
  constructor(value: string, parent: FormulaElement | Formula) {
    super(1, parent);
    this.value = value;
  }
  isValid(variables: Map<String, number>): boolean {
    return !Number.isNaN(this.getNumericalValue(variables));
  }
  getValue(): string {
    return this.value;
  }
  getNumericalValue(variables: Map<String, number>): number {
    if (variables.has(this.value)) {
      return variables.get(this.value);
    } else {
      return Number(this.value);
    }
  }
}

abstract class FormulaFunction extends FormulaElement {
  arguments: Array<FormulaElement>;
  maxArgs: number;
  minArgs: number;
  isValid(variables: Map<String, number>): boolean {
    return (
      arguments.length <= this.maxArgs &&
      arguments.length >= this.minArgs &&
      this.arguments.every((x) => x.isValid(variables))
    );
  }
  constructor(parent: FormulaElement | Formula) {
    super(16, parent);
    this.arguments = new Array<FormulaElement>();
  }
  addArgument(newElement: FormulaElement) {
    if (this.arguments.length < this.maxArgs) {
      this.arguments.push(newElement);
    }
  }
  removeArgument(position: number) {
    this.arguments.splice(position, 1);
  }
}

abstract class TwoValueOperator extends Operator {
  leftValid(variables: Map<String, number>): boolean {
    return this.leftValue != null && this.leftValue.isValid(variables);
  }
  rightValid(variables: Map<String, number>): boolean {
    return this.rightValue != null && this.rightValue.isValid(variables);
  }
}

class Plus extends TwoValueOperator {
  constructor(parent: FormulaElement | Formula) {
    super(11, parent);
  }
  getSymbol(): string {
    return "+";
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.getLeftValue(variables) + this.getRightValue(variables);
  }
}

class Times extends TwoValueOperator {
  constructor(parent: FormulaElement | Formula) {
    super(12, parent);
  }

  getSymbol(): string {
    return "*";
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.getLeftValue(variables) * this.getRightValue(variables);
  }
}

class Divide extends TwoValueOperator {
  constructor(parent: FormulaElement | Formula) {
    super(12, parent);
  }

  getSymbol(): string {
    return "/";
  }
  rightValid(variables: Map<String, number>) {
    return this.rightValue != null && this.getRightValue(variables) != 0;
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.getLeftValue(variables) / this.getRightValue(variables);
  }
  inValidReason(variables: Map<String, number>): string {
    if (this.rightValue != null && this.getRightValue(variables) == 0) {
      return "Possible division by zero!";
    }
    return super.inValidReason(variables);
  }
}

class Minus extends Operator {
  constructor(parent: FormulaElement | Formula) {
    super(11, parent);
  }

  getSymbol(): string {
    return "-";
  }
  rightValid(variables: Map<String, number>): boolean {
    return this.rightValue != null && this.rightValue.isValid(variables);
  }
  leftValid(variables: Map<String, number>): boolean {
    return this.rightValue == null || this.rightValue.isValid(variables);
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.leftValue != null
      ? this.getLeftValue(variables)
      : 0 - this.getRightValue(variables);
  }
}

class Remainder extends TwoValueOperator {
  constructor(parent: FormulaElement | Formula) {
    super(12, parent);
  }

  getSymbol(): string {
    return "%";
  }
  rightValid(variables: Map<String, number>) {
    return this.rightValue != null && this.getRightValue(variables) != 0;
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.getLeftValue(variables) % this.getRightValue(variables);
  }
  inValidReason(variables: Map<String, number>): string {
    if (this.rightValue != null && this.getRightValue(variables) == 0) {
      return "Possible division by zero!";
    }
    return super.inValidReason(variables);
  }
}

class Exponent extends TwoValueOperator {
  constructor(parent: FormulaElement | Formula) {
    super(13, parent);
  }

  getSymbol(): string {
    return "^";
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.getLeftValue(variables) ** this.getRightValue(variables);
  }
}

class Grouping extends FormulaElement {
  enclosed: FormulaElement | null;
  constructor(parent: FormulaElement | Formula) {
    super(16, parent);
    this.enclosed = null;
  }
  getNumericalValue(variables: Map<String, number>): number {
    return this.enclosed?.getNumericalValue(variables);
  }
  isValid(variables: Map<String, number>): boolean {
    return this.enclosed != null && this.enclosed.isValid(variables);
  }
}

export const operators = {
  "+": (parent: FormulaElement | Formula) => new Plus(parent),
  "-": (parent: FormulaElement | Formula) => new Minus(parent),
  "*": (parent: FormulaElement | Formula) => new Times(parent),
  "/": (parent: FormulaElement | Formula) => new Divide(parent),
  "%": (parent: FormulaElement | Formula) => new Remainder(parent),
  "^": (parent: FormulaElement | Formula) => new Exponent(parent),
};

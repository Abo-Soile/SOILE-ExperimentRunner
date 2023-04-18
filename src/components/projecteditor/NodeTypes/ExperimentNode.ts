import { Node } from "@baklavajs/core";

export default class ExperimentNode extends Node {
  public type = "ExperimentNode";
  public name = this.type;

  private counter = 0;

  public constructor() {
    super();
    this.addInputInterface("Input", null, null, { twoColumn: true });
    this.addOutputInterface("Output", { twoColumn: true });
    this.addOption("Open sidebar", "ButtonOption");
  }

  public load(state) {
    super.load(state);
  }

  public action(action: string) {
    if (action === "Add Input") {
      this.addInputInterface("Input " + ++this.counter);
    } else if (action === "Remove Input" && this.counter > 0) {
      this.removeInterface("Input " + this.counter--);
    }
  }
}

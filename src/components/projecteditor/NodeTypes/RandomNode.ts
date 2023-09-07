import { v4 as uuidv4 } from "uuid";
import { NodeInterface } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine";
import { RandomSideBarOption, SideBarButton } from "../NodeOptions";
import { markRaw, reactive } from "vue";
import { displayInSideBar } from "./utilities";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { RandomOption } from "../interfaces/RandomizerInterfaces";
import { useErrorStore } from "@/stores/errors";

import SoileNode from "./SoileNode";

export default class RandomNode extends SoileNode {
  public type = "RandomNode";
  public name = "Randomizer";
  public twoColumn = true;
  public randomType = { name: "Basic Randomization", value: "random" };
  public outputIDs = [];
  public settings = reactive({});
  randomOptions = [
    {
      name: "Basic Randomization",
      value: "random",
    },
    {
      name: "Block Randomization",
      value: "block",
    },
  ];
  public inputs = {
    previous: new NodeInterface("Previous", []).use(allowMultipleConnections),

    type: new TextInterface(
      "RandomType",
      "Type: " + this.randomType.name
    ).setPort(false),

    edit: new NodeInterface("Edit", uuidv4())
      .setComponent(markRaw(SideBarButton))
      .setPort(false),

    sideBarOption1: new ComponentInterface<RandomNode>(
      "SideBar",
      this,
      RandomSideBarOption
    )
      .setHidden(true)
      .use(displayInSideBar, true)
      .setPort(false),
  };

  public getType(): RandomOption {
    return this.randomType;
  }
  public setType(type: RandomOption) {
    this.resetSettings();
    this.setOutputs([]);
    this.randomType = type;
    this.inputs.type.value = "Type: " + this.randomType.name;
  }
  public outputs = {};
  public getOutputCount(): number {
    return this.outputIDs.length;
  }
  constructor() {
    super();
    this.myTitle = this.type;
    this.initializeIo();
  }

  public setSetting(key: string, value: any) {
    this.settings[key] = value;
  }

  public resetSettings() {
    this.settings = {};
  }
  public isValid(): boolean {
    return this.getOutputCount() > 0;
  }
  public setOutputsForCount(count: number) {
    const outputs = [];
    for (let i = 1; i <= count; ++i) {
      outputs.push("" + i);
    }
    this.setOutputs(outputs);
  }
  public setBlockSpecification(spec: string) {
    this.settings["blockSpecification"] = spec;
    const names = [];
    for (let i = 0; i < spec.length; ++i) {
      if (!names.includes(spec.charAt(i))) {
        names.push(spec.charAt(i));
      }
    }
    this.setOutputs(names);
  }

  public setOutputs(names: string[]) {
    // get those outputs that are not in the list
    const toRemove = this.outputIDs.filter((x) => !names.includes(x));
    const toAdd = names.filter((x) => !this.outputIDs.includes(x));
    this.removeOutputs(toRemove);
    this.addOutputs(toAdd);
  }
  /**
   * Get the possible random Options
   * @returns the possible random Options
   */
  public getRandomOptions(): RandomOption[] {
    return this.randomOptions;
  }

  /**
   * Get the random option spec for a specific value
   * @param toRemove
   */
  getRandomOptionForValue(value: string): RandomOption {
    for (let i = 0; i < this.randomOptions.length; i++) {
      if (value === this.randomOptions[i].value) {
        return this.randomOptions[i];
      }
    }
    return null;
  }
  removeOutputs(toRemove: string[]) {
    toRemove.forEach((x) => {
      if (this.outputIDs.includes(x)) {
        this.removeOutput(x);
      }
    });
    this.outputIDs = this.outputIDs.filter((x) => !toRemove.includes(x));
  }
  addOutputs(toAdd: string[]) {
    toAdd.forEach((name) => {
      this.addOutput(name, new NodeInterface(name, "OutputConnection"));
      this.outputIDs.push(name);
    });
  }
}

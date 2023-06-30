import { v4 as uuidv4 } from "uuid";
import { NodeInterface } from "@baklavajs/core";
import { allowMultipleConnections } from "@baklavajs/engine";
import { FilterSideBarOption, SideBarButton } from "../NodeOptions";
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { useErrorStore } from "@/stores/errors";

import SoileNode from "./SoileNode";

export default class FilterNode extends SoileNode {
  public type = "FilterNode";
  public name = "Filter";
  public twoColumn = true;
  defaultOption = "";
  Filters = new Map<string, { filterstring: string; interfaceID: string }>();
  public inputs = {
    previous: new NodeInterface("Previous", []).use(allowMultipleConnections),
    edit: new NodeInterface("Edit", uuidv4())
      .setComponent(markRaw(SideBarButton))
      .setPort(false),
    sideBarOption1: new ComponentInterface<FilterNode>(
      "SideBar",
      this,
      FilterSideBarOption
    )
      .setHidden(true)
      .use(displayInSideBar, true)
      .setPort(false),
  };

  public outputs = {
    default: new NodeInterface("Default", "OutputConnection"),
  };

  public isValid(): boolean {
    // need to think, what checks could be made here.
    return true;
  }

  constructor() {
    super();
    this.myTitle = this.type;
    this.initializeIo();
  }

  public addFilter(name: string, filterString: string) {
    //this.addOption(outputName, "TextOption");
    console.log(this.inputs);
    //this.Filters.set(name,filterString);
    console.log(this.inputs.edit.value);
    /*    const newValue = uuidv4();
    console.log(newValue)
    this.inputs.edit.value = newValue;*/
    console.log(this.inputs);
    this.addOutput(name, new NodeInterface(name, "OutputConnection"));
    this.Filters.set(name, {
      filterstring: filterString,
      interfaceID: this.outputs[name].id,
    });
  }
  public removeFilter(name: string) {
    console.log("Removing filter: " + name);
    //this.removeOption(outputName);
    const success = this.removeOutput(name);
    console.log(success);
    console.log(this.outputs);
    this.Filters.delete(name);
  }

  public updateFilter(oldName: string, newName: string, newValue: string) {
    if (!oldName) {
      const errorStore = useErrorStore();
      errorStore.raiseError("error", "No Filter to update specified");
      return;
    }
    if (newName != oldName && this.Filters.has(newName)) {
      const errorStore = useErrorStore();
      errorStore.raiseError(
        "error",
        "The Filtername already exists on this FilterNode"
      );
      return;
    }
    if (newName != oldName) {
      const errorStore = useErrorStore();
      errorStore.raiseError(
        "warn",
        "Filter was changed. You have to update the connections!"
      );
      this.removeFilter(oldName);
      this.addFilter(newName, newValue);
    } else {
      this.Filters.get(newName).filterstring = newValue;
    }
  }

  public getFilters() {
    return this.Filters;
  }
}

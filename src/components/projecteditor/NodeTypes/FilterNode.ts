import { Node } from "@baklavajs/core";
import { v4 as uuidv4 } from 'uuid'

export default class FilterNode extends Node {
  public type = "FilterNodeNode";
  public name = "Filter";
  Filters = new Map<string,string>

  constructor() {
    super();    
    this.twoColumn = true;
    this.name = "Filter" + uuidv4();
    this.addInputInterface("Previous", null, null, { twoColumn: true });
    this.getInterface("Previous").value =  {type: "InputConnection", value: this.name};
    this.updateEdit();
    console.log("Generated Node")
    console.log(this);
  }

  public load(state) {
    super.load(state);
  }

  public addFilter(name: string, filterString: string)
  {
    //this.addOption(outputName, "TextOption");
    this.Filters.set(name,filterString);
    this.addOutputInterface(name, { twoColumn: true });
    this.getInterface(name).value = {type: "OutputConnection", value: name};
  }
  public removeFilter(name: string)
  {
    console.log()
    //this.removeOption(outputName);
    this.removeInterface(name);
    this.Filters.delete(name);

  }
  public getFilters()
  {
    return this.Filters;
  }
  updateEdit()
  {
    this.removeOption("Edit")
    this.addOption("Edit", "ButtonOption",() => this,"FilterSideBarOption");        
  }
}

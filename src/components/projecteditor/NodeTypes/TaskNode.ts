import { Node } from "@baklavajs/core";
import { v4 as uuidv4 } from 'uuid'


export default class TaskNode extends Node {
  public type = "TaskNode";
  public name = "Task";
  twoColumn = true;
  outputs = new Array<string>;

  constructor() {
    super();    
    this.name = "Task" + uuidv4();
    this.addInputInterface("Previous",null, null, { twoColumn: true, maxConnections: Infinity});
    this.getInterface("Previous").value =  {type: "InputConnection", value: this.name};
    this.addOutputInterface("Next", { twoColumn: true, maxConnections: 1});
    this.getInterface("Next").value =  {type: "OutputConnection", value: this.name};
    this.addOption("Outputs", "OutputListOption",undefined, undefined, {items : this.outputs, title: "Outputs:"});        
    this.updateEdit();
    console.log("Generated Node")
    console.log(this);
  }

  public load(state) {
    super.load(state);
  }

  calculate() {    


  }

  public addOutput(outputName: string)
  {
    //this.addOption(outputName, "TextOption");
    this.outputs.push(outputName);
    if(this.outputs.length == 1)
    {
      this.updateEdit();
    }
    //this.addOutputInterface(outputName);
    //this.getInterface(outputName).value = {type: "Output", value: this.name + "." + outputName};
  }
  public printStatus()
  {
    console.log("YeeHaw");
    console.log(this)
  }
  public removeOutput(outputName: string)
  {
    console.log()
    //this.removeOption(outputName);
    this.outputs.splice(this.outputs.indexOf(outputName),1)
    //this.removeInterface(outputName);
  }
  public getOutputs()
  {
    return this.outputs;
  }

  updateEdit()
  {
    this.removeOption("Edit")
    this.addOption("Edit", "ButtonOption",() => this,"TaskSideBarOption");        
  }
}

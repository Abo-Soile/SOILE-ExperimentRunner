import { Node, NodeInterface, CalculateFunction, INodeState, NodeInterfaceDefinitionStates } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, ExperimentSideBarOption} from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import axios from 'axios'
import { InputInterface } from "../NodeInterfaces/InputInterface";
import { useGraphStore } from "@/stores/";
import { SoileNodeState } from "../Interfaces/SoileNodeProperties";
interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}



export default class ExperimentNode extends Node<Inputs,Outputs> implements SoileNodeState{
  public type = "ExperimentNode";
  myTitle = this.type;
  public set title( newTitle : string)
  {
    console.log("Setting title")
    if(this.graphStore.isNameOk(this,newTitle))
    {      
      console.log("updating title to" + newTitle);
       const changedTitle = this.graphStore.updateName(this,this.myTitle,newTitle);
       console.log("The changed Title is" + changedTitle);
       this.myTitle = changedTitle
    }
  }
  public get title() : string
  {
    return this.myTitle;
  }


  public twoColumn = true;
  public taskOutputs = new Array<string>;  
  public experiment = {uuid : "", name: "", version: "", tag: ""}
  public graphStore = useGraphStore();
  
  public isStartNode()
  {
    return this.graphStore.isStartNode(this);  
  }

  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(allowMultipleConnections),    
    ExperimentName: new TextInterface("ExperimentName", "Experiment: " + (this.experiment.name != "" ? this.experiment.name : "" ) ).setPort(false),
    ExperimentVersion: new TextInterface("ExperimenVersion", "Version: " + this.experiment.tag ).setPort(false),
    // Potentially we don't need this, but it might be necessary.
    outputs: new ComponentInterface("Outputs", { items: this.taskOutputs, title: "Outputs" }, OutputListOption).setPort(false),
    edit: new NodeInterface("Edit", undefined).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface("SideBar", this, ExperimentSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };

  isValid(){
    return this.experiment.uuid != "" && this.experiment.version != "";
  }

  public outputs = {
    next: new NodeInterface("Next", "OutputConnection"),
  };

  public constructor() {
    super();
    this.id = "Experiment " + uuidv4();
    this.initializeIo();
  }

  public getOutputs() {
    return this.taskOutputs;
  }
  public addTaskOutput(outputName: string) {
    this.graphStore.addOutput(this, outputName);
  }
  public removeTaskOutput(outputName: string) {
    console.log()
    this.taskOutputs.splice(this.taskOutputs.indexOf(outputName), 1)
  }

  public calculate: CalculateFunction<Inputs, Outputs> = ({ previous }) => {
    console.log("Trying to calculate")
    if (previous.length > 0) {
      console.log(previous)
      console.log(this.inputs.previous)
    }
    return { next: this.id };
  }

  public setExperimentInformation(data : { uuid: string, name: string})
  {
    this.experiment.uuid = data.uuid;
    this.experiment.name = data.name;
    this.inputs.ExperimentName.value = "Task: " + this.experiment.name
  }
  public setTaskVersion(version : string, tag : string)
  {
    this.experiment.version = version;   
    this.experiment.tag = tag; 
    this.inputs.ExperimentVersion.value = "Version: " + this.experiment.tag;
  }
  onPlaced(): void {
    this.graphStore.setupNode(this);
    if(this.title == this.type)
    {
      this.myTitle = this.graphStore.getUniqueName(this);
    }
  }
  onDestroy()
  {
    this.graphStore.removeNode(this);
  }    

}

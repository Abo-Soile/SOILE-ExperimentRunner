import { Node, NodeInterface, CalculateFunction } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, TaskSideBarOption } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import axios from 'axios'
import { InputInterface } from "../NodeInterfaces/InputInterface";
import { useGraphStore } from "@/stores/graph";
interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}



export default class TaskNode extends Node<Inputs,Outputs> {
  public type = "TaskNode";
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
  public task = {uuid : "", name: "", version: "", tag: "", type: ""}
  public graphStore = useGraphStore();
  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(allowMultipleConnections),
    type: new TextInterface("TaskType", "Type: " + this.task.type).setPort(false),
    taskInformation: new TextInterface("TaskInformation", "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "") ).setPort(false),
    outputs: new ComponentInterface("Outputs", { items: this.taskOutputs, title: "Outputs" }, OutputListOption).setPort(false),
    edit: new NodeInterface("Edit", undefined).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface("SideBar", this, TaskSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };

  isValid(){
    return this.task.uuid != "" && this.task.version != "";
  }

  public outputs = {
    next: new NodeInterface("Next", "OutputConnection"),
  };

  public constructor() {
    super();
    this.id = "Task " + uuidv4();
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
    if (previous.length > 0) {
      console.log(previous)
      console.log(this.inputs.previous)
    }
    return { next: this.id };
  }

  public setTaskInformation(data : { uuid: string, name: string})
  {
    this.task.uuid = data.uuid;
    this.task.name = data.name;
    this.inputs.taskInformation.value = "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "")
  }
  public setTaskVersion(version : string, tag : string)
  {
    this.task.version = version;   
    this.task.tag = tag; 
    this.inputs.taskInformation.value = "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "")
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

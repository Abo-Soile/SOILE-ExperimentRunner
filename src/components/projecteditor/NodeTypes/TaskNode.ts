import {  NodeInterface, CalculateFunction } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, TaskSideBarOption } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { InputInterface } from "../NodeInterfaces/InputInterface";

import SoileNode from "./SoileNode";
interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}



export default class TaskNode extends SoileNode {
  public type = "TaskNode";
  myTitle = this.type;

  public nodeOutputs = new Array<string>;  
  public nodePersistent = new Array<string>;  
  public task = {uuid : "", name: "", version: "", tag: "", type: ""}  

  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(allowMultipleConnections),
    type: new TextInterface("TaskType", "Type: " + this.task.type).setPort(false),
    taskInformation: new TextInterface("TaskInformation", "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "") ).setPort(false),
    outputs: new ComponentInterface("Outputs", { items: this.nodeOutputs, title: "Outputs" }, OutputListOption).setPort(false),
    persistent: new ComponentInterface("Persistent", { items: this.nodePersistent, title: "Persistent Data" }, OutputListOption).setPort(false),
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
    return this.nodeOutputs;
  }
  public addTaskOutput(outputName: string) {
    this.graphStore.addOutput(this, outputName);
  }
  public removeTaskOutput(outputName: string) {
    console.log()
    this.nodeOutputs.splice(this.nodeOutputs.indexOf(outputName), 1)
  }
  public getPersistent() {
    return this.nodePersistent;
  }
  public addTaskPersistent(dataName: string) {
    this.graphStore.addPersistantData(this, dataName);
  }
  public removeTaskPersistent(dataName: string) {
    this.graphStore.removePersistantData(this,dataName)
  }
  public setTaskInformation(data : { uuid: string, name: string})
  {
    this.task.uuid = data.uuid;
    this.task.name = data.name;
    this.task.version = "";
    this.task.tag = "";
    this.inputs.taskInformation.value = "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "")
  }
  public setTaskVersion(version : string, tag : string)
  {
    this.task.version = version;   
    this.elementStore.getPersistentDataForTask(this.task.uuid, this.task.version).then((persistant => {
      for(const persistentValue of persistant)
      {
        this.addTaskPersistent(persistentValue);
      }
    }).bind(this))
    this.task.tag = tag; 
    this.inputs.taskInformation.value = "Task: " + (this.task.name != "" ? this.task.name + "@" + this.task.tag : "")
  }
}

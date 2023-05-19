import { NodeInterface } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, ExperimentSideBarOption} from "../NodeOptions"
import { markRaw, reactive } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { InputInterface } from "../NodeInterfaces/InputInterface";
import SoileVersionedNode from "./SoileVersionedNode";




export default class ExperimentNode extends SoileVersionedNode  {
  public type = "ExperimentNode";
  public objectType = "experiment";
  myTitle = this.type;
  public nodeOutputs = new Array<string>;  
  public nodePersistent = new Array<string>;  
  public random = false;
  public constructor() {
    super();
    this.id = "Experiment " + uuidv4();
    this.initializeIo();
  }

  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(allowMultipleConnections),    
    ExperimentName: new TextInterface("ExperimentName", "Experiment: " + (this.objectData.name != "" ? this.objectData.name : "" ) ).setPort(false),
    ExperimentVersion: new TextInterface("ExperimenVersion", "Version: " + this.objectData.tag ).setPort(false),
    // Potentially we don't need this, but it might be necessary.
    persistent: new ComponentInterface("Persistent", { items: this.nodePersistent, title: "Persistent Data" }, OutputListOption).setPort(false),
    edit: new NodeInterface("Edit", undefined).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface("SideBar", this, ExperimentSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };
  
  public outputs = {
    next: new NodeInterface("Next", "OutputConnection"),
  };
  public setName(name : string) : void
  {
    this.inputs.ExperimentName.value = "Experiment: " + name
  }
  public setTag(tag : string) : void
  {
    console.log("Setting Tag to " + tag);
    this.inputs.ExperimentVersion.value = "Version: " + tag
  }

  isValid(){
    return this.objectData.uuid != "" && this.objectData.version != "";
  }
  public isDataNode() {
    return true;
  };
 
}

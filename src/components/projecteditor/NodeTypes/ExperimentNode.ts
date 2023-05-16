import { NodeInterface } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, ExperimentSideBarOption} from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { InputInterface } from "../NodeInterfaces/InputInterface";
import SoileNode from "./SoileNode";




export default class ExperimentNode extends SoileNode {
  public type = "ExperimentNode";
  myTitle = this.type;
  public nodeOutputs = new Array<string>;  
  public nodePersistent = new Array<string>;  
  public experiment = {uuid : "", name: "", version: "", tag: ""}

  public constructor() {
    super();
    this.id = "Experiment " + uuidv4();
    this.initializeIo();
  }

  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(allowMultipleConnections),    
    ExperimentName: new TextInterface("ExperimentName", "Experiment: " + (this.experiment.name != "" ? this.experiment.name : "" ) ).setPort(false),
    ExperimentVersion: new TextInterface("ExperimenVersion", "Version: " + this.experiment.tag ).setPort(false),
    // Potentially we don't need this, but it might be necessary.
    persistent: new ComponentInterface("Persistent", { items: this.nodePersistent, title: "Persistent Data" }, OutputListOption).setPort(false),
    edit: new NodeInterface("Edit", undefined).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface("SideBar", this, ExperimentSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };
  
  public outputs = {
    next: new NodeInterface("Next", "OutputConnection"),
  };

  isValid(){
    return this.experiment.uuid != "" && this.experiment.version != "";
  }
 
  public getPersistent() {
    return this.nodePersistent;
  }
  public addPersistent(dataName: string) {
    this.graphStore.addPersistantData(this, dataName);
  }
  public removePersistent(dataName: string) {
    this.graphStore.removePersistantData(this,dataName)
  }
  public setExperimentInformation(data : { uuid: string, name: string})
  {
    this.experiment.uuid = data.uuid;
    this.experiment.name = data.name;
    this.experiment.version = "";
    this.experiment.tag = "";
    this.inputs.ExperimentName.value = "Task: " + this.experiment.name
  }
  public setExperimentVersion(version : string, tag : string)
  {
    this.experiment.version = version;   
    this.elementStore.getPersistentDataForExperiment(this.experiment.uuid, this.experiment.version).then((persistant => {
      for(const persistentValue of persistant)
      {
        this.addPersistent(persistentValue);
      }
    }).bind(this))
    this.experiment.tag = tag; 
    this.inputs.ExperimentVersion.value = "Version: " + this.experiment.tag
  }

}

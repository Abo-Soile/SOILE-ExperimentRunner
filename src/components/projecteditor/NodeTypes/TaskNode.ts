import { NodeInterface } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine";
import { v4 as uuidv4 } from "uuid";
import { SideBarButton, TaskSideBarOption } from "../NodeOptions";
import { markRaw, reactive, ref } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import { InputInterface } from "../NodeInterfaces/InputInterface";
import SoileVersionedNode from "./SoileVersionedNode";
interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}

export default class TaskNode extends SoileVersionedNode {
  public type = "TaskNode";

  public objectType = "task";
  public codeType = reactive({ language: "", version: "" });
  public outputOptions = [];
  public persisitentOptions = [];
  public outputOptionType = "";
  public inputs = {
    previous: new InputInterface("Previous", "InputConnection").use(
      allowMultipleConnections
    ),
    type: new TextInterface(
      "TaskType",
      "Type: " + this.codeType.language + "@" + this.codeType.version
    ).setPort(false),
    taskInformation: new TextInterface(
      "TaskInformation",
      "Task: " + this.objectData.name ? this.objectData.name : ""
    ).setPort(false),
    taskVersion: new TextInterface(
      "TaskVersion",
      "Version: " + this.objectData.tag ? this.objectData.tag : "UNVERSIONED"
    ).setPort(false),
    outputs: new ComponentInterface(
      "Outputs",
      {
        items: this.nodeOutputs,
        title: "Outputs",
      },
      OutputListOption
    ).setPort(false),
    persistent: new ComponentInterface(
      "Persistent",
      { items: this.nodePersistent, title: "Persistent Data" },
      OutputListOption
    ).setPort(false),
    edit: new NodeInterface("Edit", undefined)
      .setComponent(markRaw(SideBarButton))
      .setPort(false),
    sideBarOption1: new ComponentInterface("SideBar", this, TaskSideBarOption)
      .setHidden(true)
      .use(displayInSideBar, true)
      .setPort(false),
  };
  public setName(name: string): void {
    this.inputs.taskInformation.value = "Task: " + name;
  }
  public setTag(tag: string): void {
    console.log("Setting Tag to " + tag);
    this.inputs.taskVersion.value = "Version: " + tag;
  }
  isValid() {
    return this.objectData.UUID != "" && this.objectData.version != "";
  }
  public isDataNode() {
    return true;
  }
  public outputs = {
    next: new NodeInterface("Next", "OutputConnection"),
  };

  public async setElementVersion(version: string, tag: string): Promise<void> {
    await super.setElementVersion(version, tag);
    const elementInfo = await this.elementStore.getElement(
      this.objectData.UUID,
      this.objectData.version,
      "task"
    );
    this.codeType = elementInfo.codeType;
    this.inputs.type.value =
      "Type: " + this.codeType.language + "@" + this.codeType.version;
    this.checkOutputOptions();
    const outputInfo = await this.elementStore.getTaskOutputs(elementInfo);
    this.outputOptionType = outputInfo.outputInfoType;
    this.outputOptions = outputInfo.outputs;
    this.persisitentOptions = outputInfo.persistent;
  }

  async checkOutputOptions() {
    if (this.codeType.language === "qmarkup") {
    }
  }
  public constructor() {
    super();
    console.log(this);
    this.id = "Task " + uuidv4();
    console.log("TaskNode Constructed: " + this.id);
    this.myTitle = this.type;
    this.initializeIo();
  }
}

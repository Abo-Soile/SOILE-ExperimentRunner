import { v4 as uuidv4 } from 'uuid'
import { INodeState, NodeInterface } from "@baklavajs/core";
import { allowMultipleConnections } from "@baklavajs/engine"
import { FilterSideBarOption, SideBarButton } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import { DynamicNode } from "@baklavajs/core";
import { ComponentInterface } from '../NodeInterfaces/ComponentInterface';
import { useGraphStore } from "@/stores";


export default class FilterNode extends DynamicNode<I,O> {
  public type = "FilterNode";
  public name = "Filter";  
  public twoColumn = true;  
  myTitle = this.type;
  graphStore = useGraphStore();

  public set title( newTitle : string)
  {
    if(this.graphStore.isNameOk(this,newTitle))
    {      
      this.myTitle = this.graphStore.updateName(this,this.myTitle,newTitle);
    }
  }
  public get title() : string
  {
    return this.myTitle;
  }

  Filters = new Map<string,string>  
  
  public inputs = {
    previous: new NodeInterface("Previous", []).use(allowMultipleConnections),
    edit: new NodeInterface("Edit", undefined).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface<FilterNode>("SideBar", this, FilterSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };

  public outputs = {    
  };

  constructor() {
    super();      
    this.initializeIo();
  }

  public addFilter(name: string, filterString: string)
  {
    //this.addOption(outputName, "TextOption");
    this.Filters.set(name,filterString);
    this.addOutput(name, new NodeInterface(name, "OutputConnection") );    

  }
  public removeFilter(name: string)
  {
    console.log("Removing filter: " + name)
    //this.removeOption(outputName);
    const success = this.removeOutput(name);
    console.log(success)
    console.log(this.outputs)
    this.Filters.delete(name);

  }
  public getFilters()
  {
    return this.Filters;
  }

  load(state: INodeState<any, any>): void {
      console.log(state);
  }
  onPlaced(): void {
    this.graphStore.setupNode(this);
    if(this.title === this.type)
    {
      console.log("Getting unique name")
      this.myTitle = this.graphStore.getUniqueName(this);
    }
  }
  onUpdate()
  {
    return {
             inputs: this.inputs,
             outputs: this.outputs
            }
  }
  onDestroy()
  {
    this.graphStore.removeNode(this);
  }
}

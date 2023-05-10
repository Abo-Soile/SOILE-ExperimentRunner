import { v4 as uuidv4 } from 'uuid'
import { DynamicNodeDefinition, INodeState, Node, NodeInterface, NodeInterfaceDefinitionStates } from "@baklavajs/core";
import { allowMultipleConnections } from "@baklavajs/engine"
import { FilterSideBarOption, SideBarButton } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import { DynamicNode } from "@baklavajs/core";
import { ComponentInterface } from '../NodeInterfaces/ComponentInterface';
import { useGraphStore } from "@/stores";
import { mapValues } from '../utils/utils';
import { FilterNodeState } from './SoileNodeState';
import { SoileNodeState } from '../Interfaces/SoileNodeProperties';


export default class FilterNode extends Node<any,any> implements SoileNodeState{
  public type = "FilterNode";
  public name = "Filter";  
  public twoColumn = true;    
  defaultOption = '';
  myTitle = this.type;
  graphStore = useGraphStore();

  public isStartNode()
  {
    return this.graphStore.isStartNode(this);  
  }

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

  Filters = new Map<string,{filterstring : string, interfaceID : string}>  
  
  public inputs = {
    previous: new NodeInterface("Previous", []).use(allowMultipleConnections),
    edit: new NodeInterface("Edit", uuidv4()).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface<FilterNode>("SideBar", this, FilterSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };

  public outputs = {
    default: new NodeInterface("Default", "OutputConnection")
  };


  constructor() {
    super();      
    this.initializeIo();
  }

  public addFilter(name: string, filterString: string)
  {
    //this.addOption(outputName, "TextOption");
    console.log(this.inputs)
    //this.Filters.set(name,filterString);
    console.log(this.inputs.edit.value)
    const newValue = uuidv4();
    console.log(newValue)
    this.inputs.edit.value = newValue;
    console.log(this.inputs);
    this.addOutput(name, new NodeInterface(name, "OutputConnection") );        
    this.Filters.set(name,{ filterstring: filterString, interfaceID : this.outputs[name].id });    
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
  onUpdate(inputs: any, outputs: any)
  {
    console.log(inputs);
    console.log(outputs);
    console.log(this.outputs)
    return {             
             outputs: this.outputs 
            } 
  }
  onDestroy()
  {
    this.graphStore.removeNode(this);
  }

  public save(): INodeState<any,any> {
    console.log("Saving Filter")
    const inputStates = mapValues(this.inputs, (intf) => intf.save()) as NodeInterfaceDefinitionStates<any>;
    // we don't have any outputs present, but we know that they will have the correct type
    const outputStates = mapValues(this.outputs, (intf) => intf.save()) as NodeInterfaceDefinitionStates<any>;

    const state: FilterNodeState<any, any> = {
        type: this.type,
        id: this.id,
        title: this.title,
        inputs: inputStates,
        outputs: outputStates,    
        filters: this.Filters,
        default: this.outputs.default.id
    };

    return this.hooks.afterSave.execute(state);
  }

}

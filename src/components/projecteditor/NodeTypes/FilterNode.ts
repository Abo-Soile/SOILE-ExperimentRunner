import { v4 as uuidv4 } from 'uuid'
import { NodeInterface } from "@baklavajs/core";
import { allowMultipleConnections } from "@baklavajs/engine"
import { FilterSideBarOption, SideBarButton } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import { ComponentInterface } from '../NodeInterfaces/ComponentInterface';

import SoileNode from './SoileNode';


export default class FilterNode extends SoileNode{
  public type = "FilterNode";
  public name = "Filter";  
  public twoColumn = true;    
  defaultOption = '';
  myTitle = this.type;
  Filters = new Map<string,{filterstring : string, interfaceID : string}>  
  
  public inputs = {
    previous: new NodeInterface("Previous", []).use(allowMultipleConnections),
    edit: new NodeInterface("Edit", uuidv4()).setComponent(markRaw(SideBarButton)).setPort(false),
    sideBarOption1: new ComponentInterface<FilterNode>("SideBar", this, FilterSideBarOption).setHidden(true).use(displayInSideBar, true).setPort(false)
  };

  public outputs = {
    default: new NodeInterface("Default", "OutputConnection")
  };

  public isValid(): boolean {
      // need to think, what checks could be made here.
      return true;
  }

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

}

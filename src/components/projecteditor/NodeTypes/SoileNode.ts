import { Node } from "@baklavajs/core";


interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}


export default abstract class SoileNode extends Node<Inputs, Outputs>  {
  public type = "TaskNode";
  public title = this.type;
  public id : string;
  public twoColumn = true;
  public name = this.id;
  
  public constructor() {
    super();        
  }

  abstract isValid() : boolean;  

}

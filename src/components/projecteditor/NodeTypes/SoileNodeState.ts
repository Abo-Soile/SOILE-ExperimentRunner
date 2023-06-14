import { INodeState, NodeInterfaceDefinitionStates } from "@baklavajs/core";

interface NodePosition {
  x: Number;
  y: Number;
  width: Number;
  height: Number;
}

export interface TaskNodeState<I, O> extends INodeState<I, O> {
  type: string;
  start: boolean;
  id: string;
  title: string;
  taskUUID: string;
  taskVersion: string;
  inputs: NodeInterfaceDefinitionStates<any>;
  outputs: NodeInterfaceDefinitionStates<any>;
  taskOutputs: Array<string>;
}

export interface FilterNodeState<I, O> extends INodeState<I, O> {
  type: string;
  start: boolean;
  id: string;
  title: string;
  inputs: NodeInterfaceDefinitionStates<any>;
  outputs: NodeInterfaceDefinitionStates<any>;
  filters: Map<string, any>;
  default: string;
}

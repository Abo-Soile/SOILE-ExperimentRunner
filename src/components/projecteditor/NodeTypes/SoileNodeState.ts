import { INodeState, NodeInterfaceDefinitionStates } from "@baklavajs/core";

export class SoileNodeState<I,O> implements INodeState<I,O>
{
    type: string;
    id: string;
    title: string;
    inputs: NodeInterfaceDefinitionStates<any>;
    outputs: NodeInterfaceDefinitionStates<any>;
    taskOutputs: Array<string>;
}

export class DynamicSoileNodeState<I,O> implements INodeState<I,O>
{

}

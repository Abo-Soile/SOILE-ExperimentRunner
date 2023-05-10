// Some Interfaces to make all Soile Nodes have a couple of common properties that can be used.

import { AbstractNode, Graph } from "@baklavajs/core"

export interface queryPropertyFunc {
    () : boolean
}

export interface SoileNodeState {
    isStartNode : queryPropertyFunc,
    title: String,
    graph: Graph | undefined
}

export abstract class SoileNode extends AbstractNode implements SoileNodeState
{
    abstract isStartNode: queryPropertyFunc;
}
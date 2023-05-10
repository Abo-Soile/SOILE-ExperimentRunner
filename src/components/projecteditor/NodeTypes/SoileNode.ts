import { Node, NodeInterface, CalculateFunction, INodeState, NodeInterfaceDefinitionStates } from "@baklavajs/core";
import { TextInterface } from "@baklavajs/renderer-vue";
import { allowMultipleConnections } from "@baklavajs/engine"
import { v4 as uuidv4 } from 'uuid'
import { SideBarButton, TaskSideBarOption } from "../NodeOptions"
import { markRaw } from "vue";
import { displayInSideBar } from "./utilities";
import OutputListOption from "../NodeOptions/OutputListOption.vue";
import { ComponentInterface } from "../NodeInterfaces/ComponentInterface";
import axios from 'axios'
import { InputInterface } from "../NodeInterfaces/InputInterface";
import { useGraphStore } from "@/stores/graph";
import { mapValues } from '../utils/utils.ts';
import { TaskNodeState } from "./SoileNodeState";
import { SoileNodeState } from "../Interfaces/SoileNodeProperties";
interface Inputs {
    previous: any[];
}

interface Outputs {
    next: string;
}



export default abstract class SoileNode extends Node<Inputs, Outputs> implements SoileNodeState {
    public twoColumn = true;
    public graphStore = useGraphStore();

    public abstract type: string;
    abstract myTitle: string;
    public constructor() {
        super();
        this.id = uuidv4();
        this.initializeIo();
    }
    public set title(newTitle: string) {
        console.log("Setting title")
        if (this.graphStore.isNameOk(this, newTitle)) {
            console.log("updating title to" + newTitle);
            const changedTitle = this.graphStore.updateName(this, this.myTitle, newTitle);
            console.log("The changed Title is" + changedTitle);
            this.myTitle = changedTitle
        }
    }
    public get title(): string {
        return this.myTitle;
    }  

    public isStartNode() {
        return this.graphStore.isStartNode(this);
    }
    public abstract isValid() : boolean;

    onPlaced(): void {
        this.graphStore.setupNode(this);
        if (this.title === this.type) {
            this.myTitle = this.graphStore.getUniqueName(this);
        }
    }
    onDestroy() {
        this.graphStore.removeNode(this);
    }

}

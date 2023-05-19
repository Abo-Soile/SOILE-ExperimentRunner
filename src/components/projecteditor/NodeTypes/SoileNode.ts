import { Graph, GraphTemplate, IGraphNode, Node } from "@baklavajs/core";
import { useGraphStore } from "@/stores/graph";
import { useElementStore } from "@/stores/elements";
import { SoileBaseNode, queryPropertyFunc } from "@/helpers/projecteditor/SoileTypes";

interface Inputs {
    previous: any[];
}

interface Outputs {
    next: string;
}

/**
 * Base class for Soile Nodes in Baklava. Contains functionality to essentially ensure uniqueness of Node Names (to generate unique Instance IDs)
 */

export default abstract class SoileNode extends Node<any, any> implements SoileBaseNode, IGraphNode {
    public twoColumn = true;
    public graphStore = useGraphStore();
    public elementStore = useElementStore();
    public position = { x :0, y : 0, width :200, height: 400}
    public abstract type: string;
    abstract myTitle: string;
    public constructor() {
        super();
    }
    public isDataNode() {
        return false;
    };
    template: GraphTemplate;
    subgraph: Graph;
    public set title(newTitle: string) {
        //console.log("Setting title")
        if (this.graphStore.isNameOk(this, newTitle)) {
            //console.log("updating title to" + newTitle);
            const changedTitle = this.graphStore.updateName(this, this.myTitle, newTitle);
            //console.log("The changed Title is" + changedTitle);
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


import {
  DynamicNode,
  Graph,
  GraphTemplate,
  IGraphNode,
  INodeState,
  Node,
} from "@baklavajs/core";
import { useGraphStore } from "@/stores/graph";
import { useElementStore } from "@/stores/elements";
import {
  SoileBaseNode,
  queryPropertyFunc,
} from "@/helpers/projecteditor/SoileTypes";

interface Inputs {
  previous: any[];
}

interface Outputs {
  next: string;
}

/**
 * Base class for Soile Nodes in Baklava. Contains functionality to essentially ensure uniqueness of Node Names (to generate unique Instance IDs)
 */

export default abstract class SoileNode
  extends DynamicNode<any, any>
  implements SoileBaseNode, IGraphNode
{
  public twoColumn = true;
  public graphStore = useGraphStore();
  public elementStore = useElementStore();
  public position = { x: 0, y: 0, width: 200, height: 400 };
  public abstract type: string;
  public myTitle: string;
  public constructor() {
    super();
  }
  public isDataNode() {
    return false;
  }
  template: GraphTemplate;
  subgraph: Graph;
  public set title(newTitle: string) {
    //console.log("Setting title")
    if (this.graphStore.isNameOk(this, newTitle)) {
      console.log(this.graph);
      console.log("Name was ok, changing");
      //console.log("updating title to" + newTitle);
      const changedTitle = this.graphStore.updateName(
        this,
        this.myTitle,
        newTitle
      );
      //console.log("The changed Title is" + changedTitle);
      this.myTitle = changedTitle;
    }
  }
  public get title(): string {
    return this.myTitle;
  }

  public isStartNode() {
    return this.graphStore.isStartNode(this);
  }
  public makeStartNode() {
    return this.graphStore.setStartNode(this);
  }
  public abstract isValid(): boolean;

  onPlaced(): void {
    console.log("Placing node " + this.title);
    console.log("MyTitle: " + this.myTitle);
    console.log("Type: " + this.type);

    this.graphStore.setupNode(this);
    if (this.title === this.type) {
      this.graphStore.setUniqueName(this);
    }
  }
  onDestroy() {
    console.log("Removing Node");
    this.graphStore.removeNode(this);
  }
  load(state: INodeState<any, any>): void {
    // nothing to be done here.
    console.log(state);
  }
}

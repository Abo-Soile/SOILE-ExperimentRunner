import { defineStore } from "pinia";
import { useErrorStore } from "./errors";
import { Graph } from "@baklavajs/core";
import {
  SoileBaseNode,
  SoileDataNode,
} from "@/helpers/projecteditor/SoileTypes";
import * as diacritics from "diacritics";
//var removeDiacritics = require('diacritics').remove;

export const useGraphStore = defineStore({
  id: "graphs",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    nodePersistentInformation: new Map<string, Map<string, string[]>>(),
    nodeOutputInformation: new Map<string, Map<string, string[]>>(),
    nodeNames: new Map<string, Map<any, string>>(),
    startNodes: new Map<string, string>(),
    graphs: new Map<string, Graph>(),
  }),
  actions: {
    clearData() {
      this.nodePersistentInformation = new Map<string, Map<string, string[]>>();
      this.nodeOutputInformation = new Map<string, Map<string, string[]>>();
      this.nodeNames = new Map<string, Map<any, string>>();
      this.startNodes = new Map<string, string>();
      this.graphs = new Map<string, Graph>();
    },
    processAxiosError(err: { response: { status: any; data: any } }) {
      const errorStore = useErrorStore();
      //console.log(err);
      errorStore.raiseError(err.response?.status, err.response?.data);
    },
    isNameOk(node: SoileBaseNode, name: string) {
      //console.log("Checking name: " + name)
      const graph = node.graph;
      this.setupGraph(graph);
      return ![...this.nodeNames.get(graph?.id).values()].some(
        (v) => v === this.refineName(name)
      );
    },
    updateName(node: SoileBaseNode, oldName: string, newName: string): string {
      const graphid = node.graph?.id;
      if (this.isNameOk(node, newName)) {
        //console.log("New Name is ok")
        this.nodeNames.get(graphid).set(node, this.refineName(newName));
        return this.refineName(newName);
      } else {
        //console.log("New Name is not ok")
        return oldName;
      }
    },
    setStartNode(node: SoileBaseNode) {
      const graph = node.graph;
      this.startNodes.set(graph?.id, node.id);
    },
    isStartNode(node: SoileBaseNode): boolean {
      const graph = node.graph;
      this.setupGraph(graph);
      return this.startNodes.get(graph?.id) === node.id;
    },
    setupGraph(graph: Graph) {
      if (!(graph.id in this.graphs)) {
        this.graphs.set(graph.id, graph);
        const nodeNameMap = new Map<any, string>();
        for (const node of graph.nodes) {
          nodeNameMap.set(node, node.title);
        }
        this.nodeNames.set(graph.id, nodeNameMap);
        this.nodeOutputInformation.set(graph.id, new Map());
        this.nodePersistentInformation.set(graph.id, new Map());
      }
    },
    // Remove a graph from the
    removeGraph(graph: Graph) {
      const id = graph.id;
      this.graphs.delete(id);
      this.nodeNames.delete(id);
      this.outputInformation.delete(id);
      this.startNodes.delete(id);
    },
    refineName(name: string) {
      return diacritics
        .remove(name)
        .replace(" ", "_")
        .replace(/[^\w_\.]/g, "");
    },
    getUniqueName(node: SoileBaseNode) {
      const graph = node.graph;
      const nodeID = node.id;
      this.setupGraph(graph);
      //console.log(graph?.id);

      const nodeNames = this.nodeNames.get(graph?.id);
      let i = 1;
      //console.log(nodeNames);
      //console.log(nodeNames.values());
      //console.log([...nodeNames.values()].some(v => v === this.refineName(node.type + " " + i)));
      // ugly but we need unique names.
      while (
        [...nodeNames.values()].some(
          (v) => v === this.refineName(node.type + " " + i)
        )
      ) {
        i = i + 1;
      }
      return this.refineName(node.type + " " + i);
    },
    setupNode(node: SoileBaseNode) {
      this.setupGraph(node.graph);

      if (node.isDataNode()) {
        // we know this is a data node.
        const datanode = node as SoileDataNode;
        if (!(node.id in this.nodeOutputInformation.get(node.graph?.id))) {
          console.log(
            "Setting up node " + node.id + " in graph " + node.graph?.id
          );
          this.nodeOutputInformation
            .get(node.graph?.id)
            .set(node.id, datanode.nodeOutputs);
          this.nodePersistentInformation
            .get(node.graph?.id)
            .set(node.id, datanode.nodePersistent);
          //TODO: Check if we need to add the nodeName here.
        }
      }
      if (!this.startNodes.has(node.graph?.id)) {
        this.setStartNode(node);
      }
    },
    removeNode(node: SoileBaseNode) {
      this.nodeOutputInformation.get(node.graph?.id).delete(node.id);
      this.nodePersistentInformation.get(node.graph?.id).delete(node.id);
      this.nodeNames.get(node.graph?.id).delete(node);
    },
    canAddTaskOutput(node: SoileBaseNode, outputName: string) {
      // just in case this hasn't been done.
      this.setupNode(node);
      console.log("Checking node " + node.id + " in graph " + node.graph?.id);
      console.log(this.nodeOutputInformation.get(node.graph?.id));
      console.log(this.nodeOutputInformation.get(node.graph?.id).get(node.id));
      return !this.nodeOutputInformation
        .get(node.graph?.id)
        .get(node.id)
        .includes(outputName);
    },
    addOutput(node: SoileBaseNode, outputName: string) {
      // just in case this hasn't been done.
      if (this.canAddTaskOutput(node, outputName)) {
        this.nodeOutputInformation
          .get(node.graph?.id)
          .get(node.id)
          .push(outputName);
      }
    },
    removeOutput(node: SoileBaseNode, outputName: string) {
      this.setupNode(node);
      const currentOutputs = this.outputInformation.get(node.graph?.id);
      currentOutputs.splice(currentOutputs.indexOf(outputName), 1);
    },
    addPersistantData(node: SoileDataNode, persistentData: string) {
      // just in case this hasn't been done.
      this.setupNode(node);
      this.nodePersistentInformation
        .get(node.graph?.id)
        .get(node.id)
        .push(persistentData);
    },
    removePersistantData(node: SoileDataNode, data: string) {
      this.setupNode(node);
      const currentData = this.nodePersistentInformation
        .get(node.graph?.id)
        .get(node.id);
      currentData.splice(currentData.indexOf(data), 1);
    },
    addExperiment(node: SoileDataNode) {
      // needs to be handled specially (all the enclosed nodes etc pp)
    },
    removeExperiment(node: SoileDataNode) {
      // needs to be handled specially (all the enclosed nodes etc pp)
    },
    convertGraphToSOILE(name: string, graph: Graph) {},
  },
});

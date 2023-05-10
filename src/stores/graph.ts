import { defineStore } from 'pinia';

import axios, { AxiosError } from 'axios';
import { useErrorStore } from './errors';
import { Graph, Node } from '@baklavajs/core';
import TaskNode from '../components/projecteditor/NodeTypes/TaskNode';
import FilterNode from '../components/projecteditor/NodeTypes/FilterNode';
import ExperimentNode from '../components/projecteditor/NodeTypes/ExperimentNode';


export const useGraphStore = defineStore({
    id: 'graphs',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data
        outputInformation: new Map<string, Map<string, string[]>>(),
        nodeNames: new Map<string, Map<any, string>>(),
        startNodes: new Map<string, string>(),
        graphs: new Map<string, Graph>()        
    }),
    actions: {
        processAxiosError(err: { response: { status: any, data: any } }) {
            const errorStore = useErrorStore()
            console.log(err);
            errorStore.raiseError(err.response?.status, err.response?.data)
        },
        isNameOk(node: TaskNode | ExperimentNode | FilterNode, name: string) {
            console.log("Checking name: " + name)
            const graph = node.graph;
            this.setupGraph(graph);
            return !([... this.nodeNames.get(graph?.id).values()].some(v => v === this.refineName(name)))
        },
        updateName(node: TaskNode | ExperimentNode | FilterNode, oldName: string, newName: string): string {
            const graphid = node.graph?.id;
            if (this.isNameOk(node, newName)) {
                console.log("New Name is ok")
                this.nodeNames.get(graphid).set(node, this.refineName(newName));
                return this.refineName(newName);
            }
            else {
                console.log("New Name is not ok")
                return oldName;
            }

        },
        setStartNode(node: TaskNode | ExperimentNode | FilterNode)
        {
            const graph = node.graph;
            this.startNodes.set(graph?.id, node.id)
        },
        isStartNode(node: TaskNode | ExperimentNode | FilterNode) : boolean
        {
            const graph = node.graph;
            this.setupGraph(graph);
            return this.startNodes.get(graph?.id) === node.id
        },
        setupGraph(graph: Graph) {
            if (!(graph.id in this.graphs)) {
                this.graphs.set(graph.id, graph)
                const nodeNameMap = new Map<any, string>();
                for (const node of graph.nodes) {
                    nodeNameMap.set(node, node.title)
                }
                this.nodeNames.set(graph.id, nodeNameMap);
                this.outputInformation.set(graph.id, new Map())
            }
        },
        // Remove a graph from the 
        removeGraph(graph: Graph)
        {
            const id = graph.id;
            this.graphs.delete(id);
            this.nodeNames.delete(id);
            this.outputInformation.delete(id);
            this.startNodes.delete(id);
        },
        refineName(name: string) {
            return name.replace(" ", "_");
        },
        getUniqueName(node: TaskNode | ExperimentNode | FilterNode) {
            const graph = node.graph;
            const nodeID = node.id;
            this.setupGraph(graph)
            console.log(graph?.id);

            const nodeNames = this.nodeNames.get(graph?.id);
            var i = 1;
            console.log(nodeNames);
            console.log(nodeNames.values());
            console.log([...nodeNames.values()].some(v => v === this.refineName(node.type + " " + i)));
            // ugly but we need unique names.
            while ([...nodeNames.values()].some(v => v === this.refineName(node.type + " " + i))) {
                i = i + 1;
            }
            return this.refineName(node.type + " " + i);
        },        
        setupNode(node: TaskNode | ExperimentNode | FilterNode) {
            this.setupGraph(node.graph);
            if (node instanceof TaskNode) {
                if (!(node.id in this.outputInformation.get(node.graph?.id))) {
                    this.outputInformation.get(node.graph?.id).set(node.id, node.taskOutputs);
                }
            }
            if(!this.startNodes.has(node.graph?.id))
            {
                this.setStartNode(node);
            }
        },
        removeNode(node: TaskNode | ExperimentNode | FilterNode) {
            this.outputInformation.delete(node.id);
            this.nodeNames.get(node.graph?.id).delete(node);
        },
        canAddTaskOutput(node: TaskNode, outputName: string) {
            // just in case this hasn't been done.
            this.setupNode(node)
            console.log(this.outputInformation.get(node.graph?.id).get(node.id));
            return !(this.outputInformation.get(node.graph?.id).get(node.id).contains(outputName));

        },
        addOutput(node: TaskNode, outputName: string) {
            // just in case this hasn't been done.            
            if (this.canAddTaskOutput(node, outputName)) {
                this.outputInformation.get(node.graph?.id).get(node.id).push(outputName);
            }
        },
        removeOutput(node: TaskNode, outputName: string) {
            this.setupNode(node)
            const currentOutputs = this.outputInformation.get(node.graph?.id).get(node.id);
            currentOutputs.splice(currentOutputs.indexOf(outputName), 1)
        },
        convertGraphToSOILE(name: string, graph: Graph )
        {

        }
    }
});

import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import TaskNode from "../components/projecteditor/NodeTypes/TaskNode";
import FilterNode from "../components/projecteditor/NodeTypes/FilterNode";
import { Graph, NodeInterface } from "@baklavajs/core";
import ExperimentNode from "../components/projecteditor/NodeTypes/ExperimentNode";




export function loadSoileProjectToBaklava(baklava : IBaklavaViewModel, soileJson : SOILEProject) {


    // this is a map of InstanceIDs to OutputInterfaces
    const nextMap = new Map<String, NodeInterface>()
    // and this is a map of InstanceIDs to "Previous" interfaces
    const previousMap = new Map<String, NodeInterface>()
    const connections = new Array<{from : String, to : String}>();
    const filterconnections = new Array<{from : NodeInterface, to : String}>();
    const graph = baklava.editor.graph;
    for(const task of soileJson.tasks)
    {        
        const t = new TaskNode();
        graph.addNode(t);        
        t.setTaskInformation({uuid: task.UUID, name: task.name});
        t.setTaskVersion(task.version, task.tag);
        t.title = task.instanceID;
        nextMap.set(task.instanceID, t.outputs.next);
        previousMap.set(task.instanceID, t.inputs.previous);
        for(const output of task.outputs)
        {
            t.addTaskOutput(output)
        }
        connections.push({from: task.instanceID, to : task.next});        
    }
    for(const filter of soileJson.filters)
    {
        
        const f = new FilterNode();
        graph.addNode(f);
        f.title = filter.instanceID;        
        for(const { i , option } of filter.options.map((value,index) => ({index,option})))
        {
            f.addFilter(option.name ? option.name : "Filter " + i , option.filter)
            filterconnections.push({ from : f.outputs[option.name], to : option.next})
        }        
        connections.push({from: filter.instanceID, to : filter.defaultOption});
        nextMap.set(filter.instanceID, f.outputs.default);
        previousMap.set(filter.instanceID, f.inputs.previous);
    }
    for(const experiment of soileJson.experiments)
    {
        const e = new ExperimentNode;
        graph.addNode(e);
        e.title = experiment.instanceID;
        e.setExperimentInformation({uuid: experiment.UUID, name : experiment.name})
        e.setTaskVersion(experiment.version, experiment.tag)
        nextMap.set(experiment.instanceID, e.outputs.next);
        previousMap.set(experiment.instanceID, e.inputs.previous);
        connections.push({from: experiment.instanceID, to: experiment.next})
    }
    for(const connection of connections)
    {
        if(connection.to != "end")
        {
            graph.addConnection(previousMap.get(connection.from) as NodeInterface, nextMap.get(connection.to) as NodeInterface)
        }        
    }
    for(const connection of filterconnections)
    {
        if(connection.to != "end")
        {
            graph.addConnection(connection.from, nextMap.get(connection.to) as NodeInterface)
        }        
    }

}


export function BaklavaToSoileProjectJSON(graph: Graph ) {
            
    const nodes = graph.nodes;
    const connections = graph.connections;
    const projectData = {
        tasks : new Array<any>(),
        experiments :  new Array<any>(),
        filter: new Array<any>(),
        start : ''
    }
    const previousMap = new Map<string,string>();    
    // first, we collect the previous Interface IDs and map them to Nodes.
    for(const node of nodes)
    {
        previousMap.set(node.inputs.previous.id, node.title);        
    }
    const nextMap = new Map<string,string>();
    for(const connection of connections)
    {
        nextMap.set(connection.from.id, previousMap.get(connection.to.id) as string);        
    }
    // now actually make the nodes
    for(const node of nodes)
    {
        if(node.type === "TaskNode")
        {
            const cnode = node as TaskNode
            const taskData = {
                UUID : cnode.task.uuid,
                version: cnode.task.version,
                tag: cnode.task.tag,
                outputs: cnode.taskOutputs,
                instanceID : cnode.title,
                next: nextMap.get(node.outputs.next.id),
                codeType: cnode.task.type
            }
            projectData.tasks.push(taskData)
        }
        if(node.type === "FilterNode")
        {
            const cnode = node as FilterNode;
            const filters = new Array<any>;
            for(let [name, filterData] of cnode.Filters)
            {
                const current = {
                    name: name,
                    filter: filterData.filterstring,
                    next: nextMap.get(filterData.interfaceID)
                }
                filters.push(current);
            }
            const filterData = {
                instanceID : node.title,
                defaultOption: nextMap.get(cnode.outputs.default.id),                
                options: filters
            }
            projectData.filter.push(filterData);
        }

        //TODO: Experiments.
        
    }
    return projectData;

}


interface FilterInstance 
{
    instanceID: string,
    "options": [
      {
        "name": string,
        "filter": string,
        "next": string
      }
    ],
    defaultOption: string
    position: {
        x : number,
        y: number
    }
  }

interface TaskInstance {
    "UUID": string,
    "name": string,
    "version": string,
    "tag": string,
    "instanceID": string,
    filter?: string,
    "outputs": [
      string
    ],
    next: string,
    codeType: {
      "language": string,
      "version": string
    }
    position: {
        x : number,
        y: number
    }

  }

interface SOILEProject {
    
        "UUID": string,
        "name": string,
        "version": string,
        "tag": string,
        "tasks": [
          TaskInstance
        ],
        "experiments": [
          {
            "UUID": string,
            "name": string,
            "version": string,
            "tag": string,
            "elements": [
              {
                "elementType": string,
                "data": [ FilterInstance | TaskInstance ]
              }
            ],
            "randomize": boolean,
            "instanceID": string,
            next: string,
            position: {
                x : number,
                y: number
            }
          }
        ],
        "filters": [
          FilterInstance
        ],
        "start": string,
        "private": boolean
      }


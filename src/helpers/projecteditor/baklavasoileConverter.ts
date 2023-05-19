import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import TaskNode from "@/components/projecteditor/NodeTypes/TaskNode";
import FilterNode from "@/components/projecteditor/NodeTypes/FilterNode";
import { Graph, NodeInterface } from "@baklavajs/core";
import ExperimentNode from "@/components/projecteditor/NodeTypes/ExperimentNode";
import { TaskSideBarOption } from "@/components/projecteditor/NodeOptions";
import { SOILEProject } from './SoileTypes'
import { useGraphStore } from "@/stores/graph";
import { instantiateExperimentInProject } from "./experimentConverter";


export async function loadSoileProjectToBaklava(baklava : IBaklavaViewModel, soileJson : SOILEProject) {
    const graphStore = useGraphStore();

    // this is a map of InstanceIDs to OutputInterfaces
    const nextMap = new Map<String, NodeInterface>()
    // and this is a map of InstanceIDs to "Previous" interfaces
    const previousMap = new Map<String, NodeInterface>()
    const connections = new Array<{from : String, to : String}>();
    const filterconnections = new Array<{from : NodeInterface, to : String}>();
    const graph = baklava.editor.graph;
    var defaultX = 500
    var defaultY = 300    
    for(const task of soileJson.tasks)
    {        
        const t = new TaskNode();
        if(task.position)
        {
          t.position = task.position;        
        }
        else{
          t.position = {x : defaultX, y: defaultY, width: 300, height: 300}
          defaultX = defaultX + 300;
          defaultY = defaultY + 100;
        }                
        t.setElement(task.UUID, task.name);
        await t.setElementVersion(task.version, task.tag);
        graph.addNode(t);
        t.title = task.instanceID;        
        if(task.instanceID === soileJson.start)
        {
            graphStore.setStartNode(t);
        }
        nextMap.set(task.instanceID, t.outputs.next);
        previousMap.set(task.instanceID, t.inputs.previous);
        for(const output of task.outputs)
        {
            t.addElementOutput(output)
        }
        connections.push({from: task.instanceID, to : task.next});        
    }
    for(const filter of soileJson.filters)
    {
        
        const f = new FilterNode();
        if(filter.position)
        {
          f.position = filter.position;        
        }
        else{
          f.position = {x : defaultX, y: defaultY, width: 300, height: 300}
          defaultX = defaultX + 300;
          defaultY = defaultY + 100;
        }
        graph.addNode(f);
        f.title = filter.instanceID;      
          
        for(const { index , value } of filter.options.map((value,index) => ({index,value})))
        {
            const filterName = value.name ? value.name : "Filter " + index
            f.addFilter(filterName , value.filter)
            filterconnections.push({ from : f.outputs[filterName], to : value.next})
        }        
        connections.push({from: filter.instanceID, to : filter.defaultOption});

        nextMap.set(filter.instanceID, f.outputs.default);

        previousMap.set(filter.instanceID, f.inputs.previous);
    }
    for(const experiment of soileJson.experiments)
    {        
        const e = new ExperimentNode;
        if(e.position)
        {
          e.position = experiment.position;        
        }
        else{
          e.position = {x : defaultX, y: defaultY, width: 300, height: 300}
          defaultX = defaultX + 300;
          defaultY = defaultY + 100;
        }
        
        e.setElement(experiment.UUID,  experiment.name)
        await e.setElementVersion(experiment.version, experiment.tag)
        
        graph.addNode(e);
        if(experiment.instanceID === soileJson.start)
        {
            graphStore.setStartNode(e);
        }
        e.title = experiment.instanceID;                
        e.random = experiment.randomize;
        nextMap.set(experiment.instanceID, e.outputs.next);
        previousMap.set(experiment.instanceID, e.inputs.previous);
        connections.push({from: experiment.instanceID, to: experiment.next})
    }
    for(const connection of connections)
    {
        if(connection.to != "end")
        {
            // We need to map from the next Interface to the previous interface
            graph.addConnection(nextMap.get(connection.from) as NodeInterface, previousMap.get(connection.to) as NodeInterface)
        }        
    }
    for(const connection of filterconnections)
    {
        if(connection.to != "end")
        {
            graph.addConnection(connection.from, previousMap.get(connection.to) as NodeInterface)
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
                UUID : cnode.objectData.uuid,
                version: cnode.objectData.version,
                tag: cnode.objectData.tag,
                outputs: cnode.nodeOutputs,
                instanceID : cnode.title,
                next: nextMap.get(node.outputs.next.id),
                codeType: cnode.codeType
            }
            projectData.tasks.push(taskData)
        }
        if(node.type === "FilterNode")
        {
            const cnode = node as FilterNode;
            const filters = new Array<any>;
            for(const name in cnode.Filters.keys())
            {
                const filterData = cnode.Filters.get(name);
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
        if(node.type === "ExperimentNode")
        {
            const cnode = node as ExperimentNode;
            projectData.experiments.push(instantiateExperimentInProject(cnode.objectData.uuid, cnode.objectData.version, cnode.random, cnode.title))
        }

    }
    return projectData;

}




import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import TaskNode from "../components/projecteditor/NodeTypes/TaskNode";
import FilterNode from "../components/projecteditor/NodeTypes/FilterNode";
import { Graph, NodeInterface } from "@baklavajs/core";




export function loadSoileProjectToBaklava(baklava : IBaklavaViewModel, soileJson : SOILEProject) {


    // this is a map of InstanceIDs to OutputInterfaces
    const nextMap = new Map<string, NodeInterface>()
    // and this is a map of InstanceIDs to "Previous" interfaces
    const previousMap = new Map<string, NodeInterface>()
    const connections = new Array<{from : String, to : String}>();
    const graph = baklava.editor.graph;
    for(const task of soileJson.tasks)
    {        
        const t = new TaskNode();
        graph.addNode(t);
        t.setTaskInformation({uuid: task.UUID, name: task.name});
        t.setTaskVersion(task.version, task.tag);
        t.title = task.instanceID;
        for(const output of task.outputs)
        {
            t.addTaskOutput(output)
        }
        if(task.next)
        {
            connections.push({from: task.instanceID, to : task.next});
        }
    }
    for(const filter of soileJson.filters)
    {
        
        const f = new FilterNode();
        graph.addNode(f);
        f.title = filter.instanceID;
        for()
        t.title = task.instanceID;
        for(const output of task.outputs)
        {
            t.addTaskOutput(output)
        }
        if(task.next)
        {
            connections.push({from: task.instanceID, to : task.next});
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



interface SOILEProject {
    
        "UUID": string,
        "name": string,
        "version": string,
        "tag": string,
        "tasks": [
          {
            "UUID": string,
            "name": string,
            "version": string,
            "tag": string,
            "instanceID": string,
            filter?: string,
            "outputs": [
              string
            ],
            next?: string,
            codeType: {
              "language": string,
              "version": string
            }
            position: {
                x : number,
                y: number
            }

          }
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
                "data": string
              }
            ],
            "randomize": boolean,
            "instanceID": string,
            next?: string
            position: {
                x : number,
                y: number
            }
          }
        ],
        "filters": [
          {
            "instanceID": string,
            "options": [
              {
                "name": string,
                "filter": string,
                "next": string
              }
            ],
            "defaultOption": string
            position: {
                x : number,
                y: number
            }
          }
        ],
        "start": string,
        "private": boolean
      }
}

import { stringifyQuery } from 'vue-router';
import { ExperimentInstance , Experiment, TaskInstance, FilterInstance } from './SoileTypes'
import { useElementStore } from '@/stores/elements'
import ExperimentNode from '@/components/projecteditor/NodeTypes/ExperimentNode';


/**
 * This file contains functionality to convert an experiment into an experimentInstance, by converting the corresponding json representation
 * For now, we will handle this by simple replacement actions in the Json. 
 */


const elementStore = useElementStore();

export async function instantiateExperimentInProject(UUID : string, Version : string, random: boolean, InstanceID : string) : Promise<ExperimentInstance> {

    const experiment = JSON.parse(JSON.stringify(await elementStore.getElement(UUID, Version, "experiment"))) as Experiment; // stringyfy/destringyfy for a deep copy.
    const outputs = new Map<string,string>();
    for(const element of experiment.elements)
    {
        if(element.elementType === "task")
        {
            const currentTask = element.data as TaskInstance;
            for(const output of currentTask.outputs)
            {
                outputs.set(currentTask.instanceID + "." + output, InstanceID + "."  + currentTask.instanceID + "." + output)
            }
            // update the instance ID.
            element.data.instanceID = InstanceID + "." + element.data.instanceID;
            if(random)
            {
                currentTask.next = InstanceID;
            }
            else{
                // if the next task is "end or nothing, we return to the experiment", otherwise we replace the instanceID with the new one.
                currentTask.next = (currentTask.next || currentTask.next === "end" ) ? InstanceID + "." + currentTask.next : InstanceID;
            }
        }
        if(element.elementType === "filter")
        {
            if(random)
            {
                throw "Filter in Random Experiment is not possible!"
            }
            const currentFilter = element.data as FilterInstance;
            // We are already in an instance, so the elements already have to point back. 
            currentFilter.defaultOption = InstanceID + "." + currentFilter.defaultOption;
            for(const option of currentFilter.options)
            {
                option.next = InstanceID + "." + option.next;
            }
        }
        if(element.elementType === "experiment")
        {
            // Experiments are self-contained.
            element.data = updateExperimentInstance(InstanceID, element.data as ExperimentInstance)
        }
    }
    var stringifyedExp = JSON.stringify(experiment);
    // doing split/join since replaceAll is only available with es2021 and I'd like to stay with es6 for now
    outputs.forEach((value, key, map) => stringifyedExp = stringifyedExp.split(key).join(value))
    return JSON.parse(stringifyedExp) as ExperimentInstance; 
}

function updateExperimentInstance(InstanceID : string, currentInstance : ExperimentInstance) : ExperimentInstance {
    const outputs = new Map<string,string>();
    // update ID and next.
    currentInstance.instanceID = InstanceID + "." + currentInstance.instanceID;
    currentInstance.next = InstanceID + "." + currentInstance.next;
    for(const element of currentInstance.elements)
    {
        if(element.elementType === "task")
        {
            const currentTask = element.data as TaskInstance;
            for(const output of currentTask.outputs)
            {
                outputs.set(currentTask.instanceID + "." + output, InstanceID + "."  + currentTask.instanceID + "." + output)
            }
            // update the instance ID.
            element.data.instanceID = InstanceID + "." + element.data.instanceID;
            currentTask.next = InstanceID + "." + currentTask.next;
        }        
        if(element.elementType === "experiment")        
        {
            // ID and next are updated automatically
            element.data = updateExperimentInstance(InstanceID, element.data as ExperimentInstance)            
        }
        if(element.elementType === "filter")
         {
            const currentFilter = element.data as FilterInstance;
            // We are already in an instance, so the elements already have to point back. 
            currentFilter.defaultOption = InstanceID + "." + currentFilter.defaultOption;
            for(const option of currentFilter.options)
            {
                option.next = InstanceID + "." + option.next;
            }
         }
    }
    var stringifyedExp = JSON.stringify(currentInstance);
    // doing split/join since replaceAll is only available with es2021 and I'd like to stay with es6 for now
    outputs.forEach((value, key, map) => stringifyedExp = stringifyedExp.split(key).join(value))
    return JSON.parse(stringifyedExp) as ExperimentInstance;        
}


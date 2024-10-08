import { IBaklavaViewModel } from "@baklavajs/renderer-vue";
import TaskNode from "@/components/projecteditor/NodeTypes/TaskNode";
import FilterNode from "@/components/projecteditor/NodeTypes/FilterNode";
import {
  AbstractNode,
  Connection,
  Graph,
  NodeInterface,
} from "@baklavajs/core";
import ExperimentNode from "@/components/projecteditor/NodeTypes/ExperimentNode";
import {
  Experiment,
  ExperimentInstance,
  FilterInstance,
  RandomizerInstance,
  SOILEProject,
  TaskInstance,
} from "./SoileTypes";
import { useGraphStore } from "@/stores/graph";
import { instantiateExperimentInProject } from "./experimentConverter";
import SoileNode from "@/components/projecteditor/NodeTypes/SoileNode";
import RandomNode from "@/components/projecteditor/NodeTypes/RandomNode";

interface BasicConnection {
  from: string;
  to: string;
}

interface FilterConnection {
  from: NodeInterface;
  to: String;
}
let defaultX = 200;
let defaultY = 300;
/**
 * Load a Soile Project into a baklava editor.
 * @param baklava the aklava view instance.
 * @param soileJson the soile Project json
 */
export async function loadSoileProjectToBaklava(
  baklava: IBaklavaViewModel,
  soileJson: SOILEProject
) {
  // this is a map of InstanceIDs to OutputInterfaces
  const nextMap = new Map<String, NodeInterface>();
  // and this is a map of InstanceIDs to "Previous" interfaces
  const previousMap = new Map<String, NodeInterface>();
  const connections = new Array<BasicConnection>();
  const filterconnections = new Array<FilterConnection>();
  const graph = baklava.editor.graph;
  defaultX = 500;
  defaultY = 300;
  for (const task of soileJson.tasks) {
    await addTask(
      graph,
      task,
      soileJson.start,
      connections,
      nextMap,
      previousMap
    );
  }
  for (const filter of soileJson.filters) {
    await addFilter(
      graph,
      filter,
      filterconnections,
      connections,
      nextMap,
      previousMap
    );
  }
  for (const experiment of soileJson.experiments) {
    await addExperiment(
      graph,
      experiment,
      soileJson.start,
      connections,
      nextMap,
      previousMap
    );
  }
  for (const randomizer of soileJson.randomizers) {
    await addRandomizer(
      graph,
      randomizer,
      filterconnections,
      previousMap,
      soileJson.start
    );
  }
  buildconnections(graph, filterconnections, connections, nextMap, previousMap);
}

/**
 * Load a Soile Experiment into a baklava editor.
 * @param baklava the aklava view instance.
 * @param soileJson the soile experiment json
 */
export async function loadSoileExperimentToBaklava(
  baklava: IBaklavaViewModel,
  soileJson: Experiment
) {
  // this is a map of InstanceIDs to OutputInterfaces
  const nextMap = new Map<String, NodeInterface>();
  // and this is a map of InstanceIDs to "Previous" interfaces
  const previousMap = new Map<String, NodeInterface>();
  const connections = new Array<BasicConnection>();
  const filterconnections = new Array<FilterConnection>();
  const graph = baklava.editor.graph;
  defaultX = 500;
  defaultY = 300;
  for (const element of soileJson.elements) {
    if (element.elementType === "task") {
      await addTask(
        graph,
        element.data as TaskInstance,
        "",
        connections,
        nextMap,
        previousMap
      );
    }
    if (element.elementType === "filter") {
      await addFilter(
        graph,
        element.data as FilterInstance,
        filterconnections,
        connections,
        nextMap,
        previousMap
      );
    }
    if (element.elementType === "experiment") {
      await addExperiment(
        graph,
        element.data as ExperimentInstance,
        "",
        connections,
        nextMap,
        previousMap
      );
    }
    if (element.elementType === "randomizer") {
      await addRandomizer(
        graph,
        element.data as RandomizerInstance,
        filterconnections,
        previousMap,
        ""
      );
    }
  }
  buildconnections(graph, filterconnections, connections, nextMap, previousMap);
}

/**
 * Generate the connections in the given graph.
 * This requires that the graph has been set up appropriaty and all connections indicated are present.
 * @param graph
 * @param filterconnections Connections between Filter (interfaces) and target nodes
 * @param connections connections between nodes
 * @param nextMap map of Node IDs to Next Interfaces
 * @param previousMap map of Node IDs to previous Interfaces
 */
function buildconnections(
  graph: Graph,
  filterconnections: FilterConnection[],
  connections: BasicConnection[],
  nextMap: Map<String, NodeInterface>,
  previousMap: Map<String, NodeInterface>
) {
  for (const connection of connections) {
    if (connection.to != "end") {
      // We need to map from the next Interface to the previous interface
      graph.addConnection(
        nextMap.get(connection.from) as NodeInterface,
        previousMap.get(connection.to) as NodeInterface
      );
    }
  }
  for (const connection of filterconnections) {
    if (connection.to != "end") {
      graph.addConnection(
        connection.from,
        previousMap.get(connection.to) as NodeInterface
      );
    }
  }
}

async function addTask(
  graph: Graph,
  task: TaskInstance,
  start: string,
  connections: BasicConnection[],
  nextMap: Map<String, NodeInterface>,
  previousMap: Map<String, NodeInterface>
) {
  const graphStore = useGraphStore();
  const t = new TaskNode();
  if (task.position) {
    t.position = task.position;
    t.position.width = Math.max(200, t.position.width);
  } else {
    t.position = { x: defaultX, y: defaultY, width: 300, height: 300 };
    defaultX = defaultX + 300;
    defaultY = defaultY + 100;
  }
  t.setElement(task.UUID, task.name);
  await t.setElementVersion(task.version, task.tag);

  // need to add the node before we can set the ElementVersion, since
  // setting the element version does retrieve some data potentially that requires the node to be in a graph
  graph.addNode(t);
  t.title = task.instanceID;
  if (task.instanceID === start) {
    graphStore.setStartNode(t);
  }
  nextMap.set(task.instanceID, t.outputs.next);
  previousMap.set(task.instanceID, t.inputs.previous);
  for (const output of task.outputs) {
    t.addElementOutput(output);
  }
  connections.push({ from: task.instanceID, to: task.next });
}

async function addExperiment(
  graph: Graph,
  experiment: ExperimentInstance,
  start: string,
  connections: BasicConnection[],
  nextMap: Map<String, NodeInterface>,
  previousMap: Map<String, NodeInterface>
) {
  const graphStore = useGraphStore();

  const e = new ExperimentNode();
  if (experiment.position) {
    e.position = experiment.position;
    e.position.width = Math.max(200, e.position.width);
  } else {
    e.position = { x: defaultX, y: defaultY, width: 300, height: 300 };
    defaultX = defaultX + 300;
    defaultY = defaultY + 100;
  }

  e.setElement(experiment.UUID, experiment.name);
  await e.setElementVersion(experiment.version, experiment.tag);

  graph.addNode(e);
  if (experiment.instanceID === start) {
    graphStore.setStartNode(e);
  }
  e.title = experiment.instanceID;
  e.random = experiment.randomize ? experiment.randomize : false;
  nextMap.set(experiment.instanceID, e.outputs.next);
  previousMap.set(experiment.instanceID, e.inputs.previous);
  connections.push({ from: experiment.instanceID, to: experiment.next });
}

async function addFilter(
  graph: Graph,
  filter: FilterInstance,
  filterconnections: FilterConnection[],
  connections: BasicConnection[],
  nextMap: Map<String, NodeInterface>,
  previousMap: Map<String, NodeInterface>
) {
  const f = new FilterNode();
  if (filter.position) {
    f.position = filter.position;
    f.position.width = Math.max(200, f.position.width);
  } else {
    f.position = { x: defaultX, y: defaultY, width: 300, height: 300 };
    defaultX = defaultX + 300;
    defaultY = defaultY + 100;
  }
  graph.addNode(f);
  f.title = filter.instanceID;

  for (const { index, value } of filter.options.map((value, index) => ({
    index,
    value,
  }))) {
    const filterName = value.name ? value.name : "Filter " + index;
    f.addFilter(filterName, value.filter);
    filterconnections.push({ from: f.outputs[filterName], to: value.next });
  }
  connections.push({ from: filter.instanceID, to: filter.defaultOption });

  nextMap.set(filter.instanceID, f.outputs.default);

  previousMap.set(filter.instanceID, f.inputs.previous);
}

async function addRandomizer(
  graph: Graph,
  randomizer: RandomizerInstance,
  filterconnections: FilterConnection[],
  previousMap: Map<String, NodeInterface>,
  start: string
) {
  const f = new RandomNode();
  if (randomizer.position) {
    f.position = randomizer.position;
    f.position.width = Math.max(200, f.position.width);
  } else {
    f.position = { x: defaultX, y: defaultY, width: 300, height: 300 };
    defaultX = defaultX + 300;
    defaultY = defaultY + 100;
  }
  const type = randomizer.type;
  f.setType(f.getRandomOptionForValue(type));
  switch (type) {
    case "block":
      for (const setting of randomizer.settings) {
        if (setting.name === "blockSpecification") {
          f.setBlockSpecification(setting.value as string);
        }
      }
      break;
    case "random":
      f.setOutputsForCount(randomizer.options.length);
      break;
  }

  graph.addNode(f);
  f.title = randomizer.instanceID;

  for (let i = 0; i < randomizer.options.length; ++i) {
    var outputName;
    var outputTarget;
    if (type === "block") {
      const currentOutput = randomizer.options[i];
      outputName = currentOutput.name;
      outputTarget = currentOutput.next;
    }
    if (type === "random") {
      outputTarget = randomizer.options[i].next;
      outputName = "" + (i + 1);
    }
    filterconnections.push({ from: f.outputs[outputName], to: outputTarget });
  }
  previousMap.set(randomizer.instanceID, f.inputs.previous);
  if (randomizer.instanceID === start) {
    const graphStore = useGraphStore();
    graphStore.setStartNode(f);
  }
}

export async function BaklavaToSoileProjectJSON(
  graph: Graph
): Promise<SOILEProject> {
  const nodes = graph.nodes;
  const connections = graph.connections;
  const projectData = {
    tasks: new Array<TaskInstance>(),
    experiments: new Array<ExperimentInstance>(),
    filters: new Array<FilterInstance>(),
    randomizers: new Array<RandomizerInstance>(),
    start: "",
    UUID: "",
    name: "",
    version: "",
    tag: "",
    private: false,
  };
  const graphStore = useGraphStore();
  if (!graphStore.getStartNode(graph)) {
    throw new Error(
      "No start node defined. Select a start node before saving."
    );
  }
  const nextMap = createNextMap(nodes, connections);
  // now actually make the nodes
  for (const node of nodes) {
    const soileNode = node as SoileNode;
    if (!soileNode.isValid()) {
      throw new Error(
        "Cannot convert. Node " +
          soileNode.title +
          " is not valid (Probably no target Element selected)"
      );
    }
    if (node.type === "TaskNode") {
      const taskNode = node as TaskNode;
      if (taskNode.isStartNode()) {
        projectData.start = taskNode.title;
      }
      projectData.tasks.push(createTaskJson(node as TaskNode, nextMap));
    }
    if (node.type === "FilterNode") {
      projectData.filters.push(createFilterJson(node as FilterNode, nextMap));
    }
    if (node.type === "RandomNode") {
      projectData.randomizers.push(
        createRandomJson(node as RandomNode, nextMap)
      );
      const randomNode = node as RandomNode;
      if (randomNode.isStartNode()) {
        projectData.start = randomNode.title;
      }
    }
    if (node.type === "ExperimentNode") {
      const cnode = node as ExperimentNode;
      if (cnode.isStartNode()) {
        projectData.start = cnode.title;
      }
      const instance = await instantiateExperimentInProject(
        cnode.objectData.UUID,
        cnode.objectData.version,
        cnode.random,
        cnode.title
      );
      instance.next = nextMap.get(cnode.outputs.next.id)
        ? nextMap.get(cnode.outputs.next.id)
        : "end";
      instance.position = cnode.position;
      projectData.experiments.push(instance);
    }
  }
  return projectData;
}

export async function BaklavaToSoileExperimentJSON(
  graph: Graph
): Promise<Experiment> {
  const nodes = graph.nodes;
  const connections = graph.connections;
  const experimentData = {
    elements: new Array<{
      elementType: string;
      data:
        | TaskInstance
        | ExperimentInstance
        | FilterInstance
        | RandomizerInstance;
    }>(),
    UUID: "",
    version: "",
    tag: "",
    randomize: false,
    private: false,
    name: "",
  };
  const graphStore = useGraphStore();
  if (!graphStore.getStartNode(graph)) {
    throw new Error(
      "No start node defined. Select a start node before saving."
    );
  }
  const tempData = {} as Experiment;
  tempData.elements = new Array<{
    elementType: string;
    data:
      | TaskInstance
      | ExperimentInstance
      | FilterInstance
      | RandomizerInstance;
  }>();
  const nextMap = createNextMap(nodes, connections);
  // now actually make the nodes
  for (const node of nodes) {
    const soileNode = node as SoileNode;
    if (!soileNode.isValid()) {
      throw new Error(
        "Cannot convert. Node " +
          soileNode.title +
          " is not valid (Probably no target Element selected)"
      );
    }
    if (node.type === "TaskNode") {
      if (!(node as TaskNode).isStartNode()) {
        experimentData.elements.push({
          elementType: "task",
          data: createTaskJson(node as TaskNode, nextMap),
        });
      } else {
        // start Node needs to be the very first element. (maybe we change this later...)
        experimentData.elements.splice(0, 0, {
          elementType: "task",
          data: createTaskJson(node as TaskNode, nextMap),
        });
      }
    }
    if (node.type === "FilterNode") {
      experimentData.elements.push({
        elementType: "filter",
        data: createFilterJson(node as FilterNode, nextMap),
      });
    }
    if (node.type === "RandomNode") {
      experimentData.elements.push({
        elementType: "randomizer",
        data: createRandomJson(node as RandomNode, nextMap),
      });
    }
    if (node.type === "ExperimentNode") {
      const cnode = node as ExperimentNode;
      const instance = await instantiateExperimentInProject(
        cnode.objectData.UUID,
        cnode.objectData.version,
        cnode.random,
        cnode.title
      );
      instance.next = nextMap.get(cnode.outputs.next.id)
        ? nextMap.get(cnode.outputs.next.id)
        : "end";
      instance.position = cnode.position;
      if (!(node as ExperimentNode).isStartNode()) {
        experimentData.elements.push({
          elementType: "experiment",
          data: instance,
        });
      } else {
        // start Node needs to be the very first element. (maybe we change this later...)
        experimentData.elements.splice(0, 0, {
          elementType: "experiment",
          data: instance,
        });
      }
    }
  }
  return experimentData;
}

function createNextMap(
  nodes: readonly AbstractNode[],
  connections: readonly Connection[]
) {
  const previousMap = new Map<string, string>();
  // first, we collect the previous Interface IDs and map them to Nodes.
  for (const node of nodes) {
    previousMap.set(node.inputs.previous.id, node.title);
  }
  const nextMap = new Map<string, string>();
  for (const connection of connections) {
    nextMap.set(
      connection.from.id,
      previousMap.get(connection.to.id) as string
    );
  }
  return nextMap;
}

function createTaskJson(
  cnode: TaskNode,
  nextMap: Map<string, string>
): TaskInstance {
  const test = {} as TaskInstance;
  test.codeType = cnode.codeType;
  const taskData = {
    UUID: cnode.objectData.UUID,
    version: cnode.objectData.version,
    tag: cnode.objectData.tag,
    outputs: cnode.nodeOutputs,
    instanceID: cnode.title,
    next: nextMap.get(cnode.outputs.next.id)
      ? nextMap.get(cnode.outputs.next.id)
      : "end",
    codeType: cnode.codeType,
    name: cnode.objectData.name,
    position: cnode.position,
  };
  return taskData;
}

function createFilterJson(
  cnode: FilterNode,
  nextMap: Map<string, string>
): FilterInstance {
  const filters = new Array<{ name: string; filter: string; next: string }>();
  cnode.Filters.forEach((value, key) => {
    const current = {
      name: key,
      filter: value.filterstring,
      next: nextMap.get(value.interfaceID)
        ? nextMap.get(value.interfaceID)
        : "end",
    };
    filters.push(current);
  });
  const filterData = {
    instanceID: cnode.title,
    defaultOption: nextMap.get(cnode.outputs.default.id)
      ? nextMap.get(cnode.outputs.default.id)
      : "end",
    options: filters,
    position: cnode.position,
  };
  return filterData;
}

function createRandomJson(
  cnode: RandomNode,
  nextMap: Map<string, string>
): RandomizerInstance {
  const options = new Array<{ name: string; next: string }>();
  const settings = new Array<{ name: string; value: string }>();
  cnode.outputIDs.forEach((outputName) => {
    options.push({
      name: outputName,
      next: nextMap.get(cnode.outputs[outputName].id),
    });
  });
  for (const [key, value] of Object.entries(cnode.settings)) {
    settings.push({ name: key, value: value as string });
  }
  const filterData = {
    instanceID: cnode.title,
    options,
    settings,
    position: cnode.position,
    type: cnode.randomType.value,
  };
  return filterData;
}

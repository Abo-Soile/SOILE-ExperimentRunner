export interface FilterInstance {
    instanceID: string,
    options: [
        {
            name: string,
            filter: string,
            next: string
        }
    ],
    defaultOption: string
    position: {
        x: number,
        y: number
    }
}

export interface TaskInstance {
    UUID: string,
    name: string,
    version: string,
    tag: string,
    instanceID: string,
    filter?: string,
    outputs: [
        string
    ],
    next: string,
    codeType: {
        language: string,
        version: string
    }
    position: {
        x: number,
        y: number
    }

}

// For NOW we don't allow experiments in experiments.
export interface Experiment {

    UUID: string,
    name: string,
    version: string,
    tag: string,
    elements: [
        {
            elementType: string,
            data: TaskInstance | FilterInstance | ExperimentInstance
        }
    ],
    randomize: true,
    private: true
}

export interface ExperimentInstance {

    UUID: string,
    name: string,
    version: string,
    tag: string,
    instanceID: string,
    elements: [
        {
            elementType: string,
            data: TaskInstance | FilterInstance | ExperimentInstance
        }
    ],
    randomize: boolean,
    private: boolean,
    next : string
}

export interface SOILEProject {

    UUID: string,
    name: string,
    version: string,
    tag: string,
    tasks: [
        TaskInstance
    ],
    experiments: [
        ExperimentInstance
    ],
    filters: [
        FilterInstance
    ],
    start: string,
    private: boolean
}

export interface Position {
    x: number,
        y : number,
            width : number,
                height : number,
}

export interface Filter {
    instanceID: string,
        position: Position,
            options: {
        name: string | undefined
        filter: string
        next: string
    },
    defaultOption: string
}

import { defineStore } from 'pinia';

import axios from 'axios';
import { useErrorStore } from './errors';
import { useElementStore } from './elements';

export const useEditorStore = defineStore({
    id: 'editing',
    state: () => ({
        // initialize the state. We don't update from the local storage, because this could contain privilegded data        
        experiments: { active: 0, elements: [] },
        projects: { active: 0, elements: [] },
        tasks: { active: 0, elements: [] },
        activeElement: "",
    }),
    actions: {
        createElement(type) {
            const store = this.getStoreForType(type);
            const existentNames = store.elements.map((x) => x.name)
            const name = this.uniqueID(type, existentNames);
            store.elements.push({ name: name });
            store.active = store.elements.length - 1;
            this.activeElement = type;
        },
        // load an element and push 
        async loadElement(type, elementName, elementID, elementVersion) {
            console.log(type)
            const store = this.getStoreForType(type);
            console.log(store);
            for (const [i, element] of store.elements.entries()) {
                if (element.name === elementName && element.version === elementVersion) {
                    store.active = i;
                    this.activeElement = type;
                    return;
                }
            }
            // not present, so we need to actually load it.
            const data = await this.loadObject(type, elementID, elementVersion)
            store.elements.push({ name: elementName, version: elementVersion, data: data })
            store.active = store.elements.length - 1;
            this.activeElement = type;
        },
        getStoreForType(type) {
            switch (type) {
                case "Task": return this.tasks;
                case "Project": return this.projects;
                case "Experiment": return this.experiments;
            }
        },
        uniqueID(prefix, existing) {
            var i = 1;
            // ugly but we need unique names.
            while ([...existing.values()].some(v => v === prefix + " " + i)) {
                i = i + 1;
            }
            return prefix + " " + i;
        },
        async loadObject(type, id, version) {
            const elementStore = useElementStore();
            return await elementStore.getElement(id, version, type)
        },                
        processAxiosError(err) {
            const errorStore = useErrorStore()
            errorStore.processAxiosError(err)

        },

    }
});

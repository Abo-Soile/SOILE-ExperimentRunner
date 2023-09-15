import { Experiment, SOILEProject } from "@/helpers/projecteditor/SoileTypes";
import { defineStore } from "pinia";

export const usePilotStore = defineStore({
  id: "pilot",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    pilotedElement: null as null | Experiment | SOILEProject,
    isExperiment: false,
  }),
  actions: {
    clearData() {
      this.pilotedElement = null;
      this.isExperiment = false;
    },
    setCurrentObject(element: Experiment | SOILEProject) {
      this.pilotedElement = element;
      if ("elements" in element) {
        // project does not have element
        this.isExperiment = true;
      }
    },
  },
});

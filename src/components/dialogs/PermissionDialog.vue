<template>
  <Dialog v-model:visible="dialogVisible" header="User Details" modal>
    <PermissionSelector
      :currentPermissions="currentPermissions.tasks"
      :availablePermissions="['READ', 'READ_WRITE', 'FULL']"
      :availableElements="availableTasks"
    >
    </PermissionSelector>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";

import { useStudyStore, useElementStore, useUserStore } from "@/stores";
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import PermissionSelector from "@/components/utils/PermissionSelector.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  components: { Dialog, PermissionSelector },
  data() {
    return {
      //TODO: refactor to remove instances
      currentPermissions: reactive({
        tasks: [],
        experiments: [],
        projects: [],
        instances: [],
      }),
    };
  },
  methods: {
    async updateCurrentPermissions(user) {
      if (user) {
        const permissionInfo = await this.userStore.getPermissions(user);
        if (permissionInfo) {
          this.currentPermissions = {
            tasks: permissionInfo.permissions.tasks,
            experiments: permissionInfo.permissions.experiments,
            projects: permissionInfo.permissions.projects,
            instances: permissionInfo.permissions.instances,
          };
        } else {
          resetPermissionInfo();
        }
      }
    },
    resetPermissionInfo() {
      this.currentPermissions = {
        tasks: [],
        experiments: [],
        projects: [],
        instances: [],
      };
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        console.log;
        this.loading = false;
        this.$emit("update:visible", value);
      },
    },
  },
  setup() {
    const studyStore = useStudyStore();
    const userStore = useUserStore();
    const elementStore = useElementStore();
    const { researchStudies } = storeToRefs(studyStore);
    const { availableTasks, availableExperiments, availableProjects } =
      storeToRefs(elementStore);

    return {
      researchStudies,
      availableTasks,
      availableExperiments,
      availableProjects,
      elementStore,
      studyStore,
      userStore,
    };
  },
  watch: {
    user(newValue) {
      console.log("User updated as: " + newValue);
      this.updateCurrentPermissions(newValue);
    },
  },
  async mounted() {
    await this.studyStore.updateResearchStudies();
    await this.elementStore.updateAvailableProjects();
    await this.elementStore.updateAvailableTasks();
    await this.elementStore.updateAvailableExperiments();
    console.log("Mounted with user: " + this.user);
    console.log(this.availableTasks);
    await this.updateCurrentPermissions(this.user);
  },
};
</script>

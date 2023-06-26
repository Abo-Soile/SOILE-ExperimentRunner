<template>
  <ProgressSpinner v-if="loading"></ProgressSpinner>
  <PermissionSelector
    v-else
    :currentPermissions="currentPermissions"
    :availablePermissions="availablePermissions"
    :availableElements="userList"
    @savePermissions="(event) => addUsers(event)"
    idField="username"
    displayField="name"
    permissionField="permission"
    currentLabel="Current Collaborators"
    availableLabel="Possible Collaborators"
    saveLabel="Save Collaborators"
  >
  </PermissionSelector>
</template>

<script>
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ProgressSpinner from "primevue/progressspinner";

import { useAuthStore } from "@/stores";
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import PermissionSelector from "@/components/utils/PermissionSelector.vue";

export default {
  props: {
    userList: {
      type: Array,
      required: true,
    },
    currentCollaborators: {
      type: Array,
      required: true,
    },
    availablePermissions: {
      type: Array,
      required: true,
    },
  },
  components: {
    Dialog,
    PermissionSelector,
    ProgressSpinner,
  },
  methods: {
    savePermissions(permissions, type) {
      console.log(
        permissions.map((x) => {
          return { type: x.permission, target: x.id };
        })
      );
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        console.log;
        this.$emit("update:visible", value);
      },
    },
    loading() {
      console.log("Updating loading");
      return this.currentCollaborators == null || this.userList == null;
    },
    currentPermissions() {
      return this.currentCollaborators.map((x) => {
        return { username: x.user, permission: x.access };
      });
    },
    availableUsers() {
      return this.userList.filter((x) => x.username != authStore.user);
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>

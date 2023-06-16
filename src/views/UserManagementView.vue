<template>
  <UserEditor
    :roleOptions="roleOptions"
    :userList="users"
    :showPermissions="true"
    :showFilters="true"
    roleColumn="role"
    :showCreate="true"
    :showDetails="true"
    :columnHeaders="columnHeaders"
    @updateRole="updateRole"
  />
</template>

<script>
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import UserEditor from "@/components/UserEditor.vue";
export default {
  data() {
    return {
      roleOptions: ["Participant", "Researcher", "Admin"],
      columnHeaders: [
        {
          name: "username",
          header: "User",
        },
        {
          name: "email",
          header: "Email Address",
        },
        {
          name: "fullname",
          header: "Full Name",
        },
        {
          name: "role",
          header: "Role",
        },
      ],
    };
  },
  components: { UserEditor },
  setup() {
    const userStore = useUserStore();
    userStore.fetchUserData();
    const { users } = storeToRefs(userStore);
    return { userStore, users };
  },
  methods: {
    updateRole(event) {
      userStore.changeUserRole(event.element.username, event.newRole);
    },
  },
  mounted() {},
};
</script>

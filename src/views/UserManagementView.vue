<template>
  <UserEditor
    :roleOptions="roleOptions"
    :userList="users"
    :showPermissions="true"
    :showFilters="true"
    roleColumn="role"
    :showUserEdit="true"
    :showDetails="true"
    :columnHeaders="columnHeaders"
    @updateUserInfo="
      (updateData) =>
        userStore
          .setUserInfo(updateData)
          .then((res) => userStore.fetchUserData())
    "
    @deleteUser="
      (userToDelete) =>
        userStore
          .deleteUser(userToDelete, true)
          .then((res) => userStore.fetchUserData())
    "
    @updateRole="
      (roleData) =>
        userStore
          .changeUserRole(roleData.username, roleData.role)
          .then((res) => userStore.fetchUserData())
    "
    @createUser="
      (userDetails) =>
        userStore
          .createUser(userDetails, true)
          .then((res) => userStore.fetchUserData())
    "
    @updateUsers="userStore.fetchUsers()"
  />
</template>

<script>
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import UserEditor from "@/components/user/UserEditor.vue";
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
  methods: {},
  mounted() {},
};
</script>

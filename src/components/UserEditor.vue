<template>
  <DataTable :value="products" tableStyle="min-width: 50rem">
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">{{ title }}</span>
      </div>
    </template>
    <Column v-for="column in columns">
      <template v-if="column === roleColumn" #body="rowData">
        <Dropdown
          :options="roleOptions"
          :value="rowData.role"
          @change="updateRole(rowData, $event)"
        ></Dropdown>
      </template>
    </Column>
    <Column v-if="showPermissions">
      <template #body="rowData">
        <Button
          label="Change Permissions"
          @click="showPermissions(rowData)"
        ></Button>
      </template>
    </Column>
    <Column>
      <template #body="rowData">
        <Button label="Delete" @click="deleteUser(rowData)"></Button>
      </template>
    </Column>
  </DataTable>

  <div v-if="showPermissions">
    <!-- Placeholder for the Permission settings dialog-->
  </div>
</template>

<script setup>

import Datatable from 'primevue/datatable'
import Column from 'primevue/column';
import DropDown from 'primevue/dropdown';

import { ref, computed, reactive } from "vue";

props = defineProps({
  title: {
    type: String
        default: "Users"
  },
  userList: {
    type: Array,
    required: true
  },
  roleOptions: {
    type: Array,
    required: true
  },
  roleColumn: {
    type: String,
    required: true
  },
  showPermissions: {
    type: boolean,
    default: false
  }
})
const columns = computed(() => userList.length > 0 ? Object.keys(userList[0]) : [])

const showPermissionDialog = ref(false);
const selectedUser = ref(null);
const emit = defineEmits(['updateRole', 'deleteUser'])

function updateRole(user, newRole) {
  const index = this.userList.indexOf(user);
  console.log(user)
  console.log(newRole)
  emit('updateRole', { index, newRole })
}

function deleteUser(user) {
  // Delete the user
  const index = this.userList.indexOf(user);
  if (index !== -1) {
    // Perform additional actions on user deletion
    console.log(index);
    emit('deleteUser', index)
  }

}
function showPermissions(rowData) {
  console.log(rowData);
}
</script>

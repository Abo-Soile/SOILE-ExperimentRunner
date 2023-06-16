<template>
  <DataTable
    v-model:filters="filters"
    :value="userList"
    tableStyle="width:100%"
    :globalFilterFields="columns"
  >
    <template #header>
      <div
        class="flex flex-wrap align-items-center justify-content-between gap-2"
      >
        <span class="text-xl text-900 font-bold">{{ title }}</span>
        <div
          class="flex flex-wrap align-items-center justify-content-between gap-2"
        >
          <span v-if="showFilters" class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </span>
          <span v-if="showCreate" class="p-input-icon-left">
            <Button
              @click="showUserDialog = true"
              icon="pi pi-user-plus"
              rounded
              raised
            />
          </span>
          <Button
            @click="$emit('updateUsers')"
            icon="pi pi-refresh"
            rounded
            raised
          />
        </div>
      </div>
    </template>
    <Column v-for="column in columns" :header="getHeader(column)">
      <template
        v-if="column === roleColumn && !showPermissions"
        #body="rowData"
      >
        <DropDownWrapper
          :options="roleOptions"
          :value="currentRoles[userList.indexOf(rowData.data)]"
          @update:value="(event) => updateCurrentRole(event, rowData.data)"
        ></DropDownWrapper>
      </template>
      <template v-else #body="rowData">
        {{ rowData.data[column] }}
      </template>
      <template
        v-if="showFilters && column === roleColumn"
        #filter="{ filterModel, filterCallback }"
      >
        <DropDownWrapper
          v-model:value="filterModel.value"
          @change="filterCallback()"
          :options="roleOptions"
          placeholder="Select One"
          class="p-column-filter"
        />
      </template>
      <template
        v-else-if="showFilters"
        #filter="{ filterModel, filterCallback }"
      >
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          class="p-column-filter"
          placeholder="Search Column"
        />
      </template>
    </Column>
    <Column v-if="showPermissions">
      <template #body="rowData">
        <Button
          label="Change Permissions"
          @click="editPermissions(rowData)"
        ></Button>
      </template>
    </Column>
    <Column v-if="showPermissions">
      <template #body="rowData">
        <DropDownWrapper
          :options="roleOptions"
          :value="currentRoles[userList.indexOf(rowData.data)]"
          @update:value="(event) => updateCurrentRole(event, rowData.data)"
        ></DropDownWrapper>
        <Button label="Change Role" @click="updateRole(rowData.data)"></Button>
      </template>
    </Column>

    <Column v-if="showDetails">
      <template #body="rowData">
        <Button label="Show Details" @click="editPermissions(rowData)"></Button>
      </template>
    </Column>
    <Column>
      <template #body="rowData">
        <Button label="Delete" @click="deleteUser(rowData)"></Button>
      </template>
    </Column>
  </DataTable>

  <div v-if="showPermissions && showPermissionDialog">
    <PermissionDialog
      v-model:visible="showPermissionDialog"
      :user="selectedUser"
    >
    </PermissionDialog>
  </div>

  <div v-if="showCreate && showUserDialog">
    <!-- Placeholder for the Permission settings dialog-->
    <NewUserDialog
      v-model:visible="showUserDialog"
      @createUser="createUser"
    ></NewUserDialog>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Column from "primevue/column";

import PermissionDialog from "@/components/dialogs/PermissionDialog.vue";
import DropDownWrapper from "@/components/utils/DropDownWrapper.vue";
import NewUserDialog from "@/components/user/NewUserDialog.vue";

import { useUserStore } from "@/stores";
import { FilterMatchMode } from "primevue/api";
import { ref, computed, reactive, defineProps, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Users",
  },
  userList: {
    type: Array,
    required: true,
  },
  roleOptions: {
    type: Array,
    required: true,
  },
  roleColumn: {
    type: String,
    required: true,
  },
  columnHeaders: {
    type: Array,
  },
  showPermissions: {
    type: Boolean,
    default: false,
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
  showFilters: {
    type: Boolean,
    default: false,
  },
  deletionLabel: {
    type: String,
    default: "Delete User",
  },
  showCreate: {
    type: Boolean,
    default: false,
  },
  createLabel: {
    type: String,
    default: "Create New User",
  },
});

const showPermissionDialog = ref(false);
const selectedUser = ref(null);
const emit = defineEmits(["updateRole", "deleteUser", "updateUsers"]);
const userSettings = ref(null);
const showUserDialog = ref(false);
const currentRoles = ref(null);
const userStore = useUserStore();

currentRoles.value = reactive(props.userList.map((x) => x[props.roleColumn]));
console.log(props.userList);
watch(
  () => props.userList,
  async (newList) => {
    console.log(newList);
    currentRoles.value = reactive(newList.map((x) => x[props.roleColumn]));
  }
);

function updateCurrentRole(newValue, element) {
  console.log(newValue);
  console.log(element);
  currentRoles.value[props.userList.indexOf(element)] = newValue;
}

const columns = computed(() => {
  if (props.columnHeaders) {
    console.log(props.columnHeaders.map((x) => x.name));
    return props.columnHeaders.map((x) => x.name);
  } else {
    return props.userList.length > 0 ? Object.keys(props.userList[0]) : [];
  }
});

function createFilterObject() {
  const res = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
  for (const column of columns.value) {
    res[column] = { value: null, matchMode: FilterMatchMode.CONTAINS };
  }
  return res;
}

const filters = ref(createFilterObject());

function updateRole(element) {
  const newRole = currentRoles.value[props.userList.indexOf(element)];
  if (newRole != element[props.roleColumn]) {
    emit("updateRole", { element, newRole });
  }
}

function deleteUser(user) {
  // Delete the user
  const index = props.userList.indexOf(user);
  if (index !== -1) {
    // Perform additional actions on user deletion
    console.log(index);
    emit("deleteUser", index);
  }
}
function editPermissions(rowData) {
  selectedUser.value = rowData.data.username;
  showPermissionDialog.value = true;
  console.log(rowData);
}

function getHeader(columnName) {
  if (props.columnHeaders != null) {
    return props.columnHeaders.find((column) => column.name === columnName)
      .header;
  } else {
    return columnName;
  }
}

function createUser(userData) {
  showUserDialog.value = false;
  userStore.createUser(userData, false);
}
</script>

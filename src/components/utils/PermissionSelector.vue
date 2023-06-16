<template>
  <ProgressSpinner
    v-if="availableElements == null || availableElements.length < 1"
  ></ProgressSpinner>
  <PickList
    v-else
    class="permissionDisplay"
    :showSourceControls="false"
    :showTargetControls="false"
    v-model="permissions"
    listStyle="height:80vh; width:40vw;"
    dataKey="id"
    @moveToTarget="elementRemovedFromPermissions"
    @moveToSource="elementPermissionAdded"
    @moveAllToTarget="allRemovedFromPermissions"
    @moveAllToSource="allElementsAdded"
  >
    <template #sourceheader> Current Permissions </template>
    <template #targetheader> Available Elements </template>
    <template #item="slotProps">
      <PermissionElement
        :key="slotProps.index"
        :permissionOptions="availablePermissions"
        :originalPermission="slotProps.item.permission"
        :elementName="slotProps.item.name"
        @setPermission="(event) => permissionsSet(slotProps.item, event)"
        @removePermission="permissionRemoved(slotProps.item)"
      />
    </template>
    <template #source-controls> </template>
    <template #target-controls> </template>
  </PickList>
  <Button
    class="mt-3"
    label="Save Permissions"
    :disabled="!changed"
    @click="$emit('savePermissions', permissions[0])"
  >
  </Button>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import PickList from "primevue/picklist";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";

import PermissionElement from "./PermissionElement.vue";

const props = defineProps({
  availablePermissions: {
    type: Array,
    required: true,
  },
  currentPermissions: {
    type: Array,
    required: true,
  },
  availableElements: {
    type: Array,
    required: true,
  },
  displayField: {
    type: String,
    default: "name",
  },
  idField: {
    type: String,
    default: "uuid",
  },
  defaultPermission: {
    type: String,
    default: "READ",
  },
});

const permissions = ref(null);

function permissionRemoved(item) {
  const elementIndex = permissions.value[0].indexOf(item);
  item.permission = null;
  if (elementIndex >= 0) {
    permissions.value[1].push(item);
    permissions.value[0].splice(elementIndex, 1);
  }
  changed.value = true;
}

function permissionsSet(item, newValue) {
  const elementIndex = permissions.value[1].indexOf(item);
  console.log(newValue);
  item.permission = newValue;
  if (elementIndex >= 0) {
    permissions.value[0].push(item);

    permissions.value[1].splice(elementIndex, 1);
  }
  changed.value = true;
}

function createPermissions() {
  const possiblePermissions = JSON.parse(
    JSON.stringify(props.availableElements)
  );
  const available = [];
  const current = [];
  for (const element of possiblePermissions) {
    const existing = props.currentPermissions.find(
      (x) => x.target === element[props.idField]
    );
    if (existing && existing.type != "EXECUTE") {
      current.push({
        id: element[props.idField],
        name: element[props.displayField],
        permission: existing.type,
      });
    } else {
      available.push({
        id: element[props.idField],
        name: element[props.displayField],
        permission: null,
      });
    }
  }
  return reactive([reactive(current), reactive(available)]);
}
function elementRemovedFromPermissions(event) {
  for (const element of event.items) {
    element.permission = null;
  }
  changed.value = true;
}

function elementPermissionAdded(event) {
  for (const element of event.items) {
    element.permission = props.defaultPermission;
  }
  changed.value = true;
}

function allRemovedFromPermissions(event) {
  for (const element of event.items) {
    element.permission = null;
  }
  changed.value = true;
}

function allElementsAdded(event) {
  for (const element of event.items) {
    element.permission = props.defaultPermission;
  }
  changed.value = true;
}

const changed = ref(false);
watch(
  () => props.availableElements,
  (newList) => {
    permissions.value = createPermissions();
  }
);

onMounted(() => {
  console.log(props.availableElements);
  permissions.value = createPermissions();
  changed.value = false;
});
</script>
<style scoped>
.permissionDisplay {
}
</style>

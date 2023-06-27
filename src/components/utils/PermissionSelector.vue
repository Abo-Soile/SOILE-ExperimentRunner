<template>
  <PickList
    class="permissionDisplay"
    :showSourceControls="false"
    :showTargetControls="false"
    v-model="permissions"
    :listStyle="listStyle"
    dataKey="id"
    v-model:selection="selection"
    @moveToTarget="elementRemovedFromPermissions"
    @moveToSource="elementPermissionAdded"
    @moveAllToTarget="allRemovedFromPermissions"
    @moveAllToSource="allElementsAdded"
  >
    <template #sourceheader> {{ currentLabel }} </template>
    <template #targetheader> {{ availableLabel }} </template>
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
    :label="saveLabel"
    :disabled="!changed"
    @click="
      $emit('savePermissions', permissions[0]);
      changed = false;
    "
  >
  </Button>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from "vue";
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
    default: "UUID",
  },
  permissionField: {
    type: String,
    default: "type",
  },
  defaultPermission: {
    type: String,
    default: "READ",
  },
  currentLabel: {
    type: String,
    default: "Current Permissions",
  },
  availableLabel: {
    type: String,
    default: "Available Permissions",
  },
  saveLabel: {
    type: String,
    default: "Save Permissions",
  },
  listStyle: {
    type: String,
    default: "height:80vh; width:40vw;",
  },
});

const permissions = ref(null);

const selection = ref([reactive([]), reactive([])]);
const emit = defineEmits(["savePermissions"]);

/**
 * Handle the removal of a permission item.
 * @param {{id : string, permission: string, name: string}} item
 */
function permissionRemoved(item) {
  const elementIndex = permissions.value[0].indexOf(item);
  item.permission = null;
  if (elementIndex >= 0) {
    permissions.value[1].push(item);
    permissions.value[0].splice(elementIndex, 1);
  }
  const selectionIndex = selection.value[0].indexOf(item);
  if (selectionIndex >= 0) {
    selection.value[0].splice(selectionIndex, 1);
  }
  console.log("Permissions Removed");
  changed.value = true;
}
/**
 * Handle settig a permission value
 * @param {{id : string, permission: string, name: string}} item
 * @param {string} newValue
 */
function permissionsSet(item, newValue) {
  if (newValue != item.permission) {
    const elementIndex = permissions.value[1].indexOf(item);
    item.permission = newValue;
    if (elementIndex >= 0) {
      permissions.value[0].push(item);
      permissions.value[1].splice(elementIndex, 1);
    }
    const selectionIndex = selection.value[1].indexOf(item);
    if (selectionIndex >= 0) {
      selection.value[1].splice(selectionIndex, 1);
    }
    changed.value = true;
  }
}
/**
 * PErmissions Removed from an element (move ti to the
 * @param {*} event
 */
function elementRemovedFromPermissions(event) {
  for (const element of event.items) {
    element.permission = null;
  }
  console.log("Permissions Removed from element");
  changed.value = true;
}
/**
 * Permissions Added to Element (move over)
 * @param {*} event
 */
function elementPermissionAdded(event) {
  for (const element of event.items) {
    element.permission = props.defaultPermission;
  }
  console.log("Permissions Added to Element");
  changed.value = true;
}

/**
 * All Elements removed
 * @param {*} event
 */
function allRemovedFromPermissions(event) {
  for (const element of event.items) {
    element.permission = null;
  }
  changed.value = true;
}
/**
 * All Elements added
 * @param {*} event
 */
function allElementsAdded(event) {
  for (const element of event.items) {
    element.permission = props.defaultPermission;
  }
  changed.value = true;
}

/**
 * Create the permissions arrays.
 */
function createPermissions() {
  console.log(props.availableElements);
  const possiblePermissions = JSON.parse(
    JSON.stringify(props.availableElements)
  );
  const available = [];
  const current = [];
  for (const element of possiblePermissions) {
    const existing = props.currentPermissions.find(
      (x) => x[props.idField] === element[props.idField]
    );
    console.log(existing);
    if (existing && existing[props.permissionField] != "EXECUTE") {
      current.push({
        id: element[props.idField],
        name: element[props.displayField],
        permission: existing[props.permissionField],
      });
    } else {
      available.push({
        id: element[props.idField],
        name: element[props.displayField],
        permission: null,
      });
    }
  }
  console.log([reactive(current), reactive(available)]);
  return reactive([reactive(current), reactive(available)]);
}

const changed = ref(false);
watch(
  () => props.availableElements,
  (newList) => {
    permissions.value = createPermissions();
  }
);

onMounted(() => {
  console.log("Selector Mounted");
  permissions.value = createPermissions();
  changed.value = false;
});
</script>
<style scoped>
.permissionDisplay {
}
</style>

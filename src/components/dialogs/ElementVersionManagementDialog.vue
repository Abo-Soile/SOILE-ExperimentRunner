<template>
  <Dialog v-model:visible="dialogVisible" header="Version Management" modal>
    <TabView>
      <TabPanel header="Remove Versions">
        <VersionManager
          :UUID="UUID"
          :type="type"
          :elementVersionList="elementVersionList"
          @refreshData="updateData"
        ></VersionManager>
      </TabPanel>
      <TabPanel header="Recover Versions">
        <VersionManager
          :UUID="UUID"
          :type="type"
          :removeVersions="false"
          :elementVersionList="elementVersionList"
          @refreshData="updateData"
        ></VersionManager>
      </TabPanel>
    </TabView>
    <template #footer>
      <Button
        label="Close"
        icon="pi pi-times"
        @click="$emit('update:isVisible', false)"
        text
      />
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import VersionManager from "@/components/utils/VersionManager.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useElementStore } from "@/stores";

export default {
  name: "ElementVersionDialog",
  components: {
    Dialog,
    Button,
    VersionManager,
    TabPanel,
    TabView,
  },
  emits: ["update:isVisible"],
  props: {
    UUID: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      elementVersionList: [],
    };
  },
  setup() {
    const elementStore = useElementStore();
    return { elementStore };
  },
  methods: {
    async updateData() {
      this.elementVersionList = await this.elementStore.getOptionsForElement(
        this.UUID,
        this.type
      );
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.isVisible;
      },
      set(value) {
        this.$emit("update:isVisible", value);
      },
    },
  },
  async mounted() {
    this.updateData();
  },
};
</script>

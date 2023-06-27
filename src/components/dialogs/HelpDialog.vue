<template>
  <Dialog v-model:visible="dialogVisible" class="w-9">
    <HelpPage class="w-full"></HelpPage>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import HelpPage from "@/components/helppages/HelpPage.vue";

export default {
  components: { Dialog, HelpPage },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>

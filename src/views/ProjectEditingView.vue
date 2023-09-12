<template>
  <div class="main-container">
    <ElementEditingMenu />
    <div class="content">
      <EditorWrapper></EditorWrapper>
    </div>
  </div>
</template>

<script setup>
import ElementEditingMenu from "@/components/componentediting/ElementEditingMenu.vue";
import EditorWrapper from "@/components/componentediting/EditorWrapper.vue";
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
}

.content {
  flex: 1;
  padding: 20px;
  padding-bottom: 0px;
}
</style>

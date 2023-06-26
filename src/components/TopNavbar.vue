<template>
  <Menubar :model="menuItems">
    <template #start>
      <div class="p-mr-2">
        <router-link to="/">
          Soile
          <!--<img src="path/to/your/logo.png" alt="Logo" />-->
        </router-link>
      </div>
    </template>
    <template #end>
      <Button icon="pi pi-question-circle" @click="showHelp = true"></Button>
    </template>
  </Menubar>
  <StudyCreationDialog
    v-if="creationDialogVisible"
    v-model:visible="creationDialogVisible"
    @selected="(event) => handleCreation(event)"
  ></StudyCreationDialog>
  <StudyLoadDialog
    v-if="loadDialogVisible"
    v-model:visible="loadDialogVisible"
    :researchStudies="studyStore.researchStudies"
    @selected="(event) => handleLoad(event)"
  ></StudyLoadDialog>
  <HelpDialog v-if="showHelp" v-model:visible="showHelp"></HelpDialog>
</template>

<script>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import { computed, ref } from "vue";
import Login from "./LoginForm.vue";
import { useAuthStore, useStudyStore } from "@/stores";
import StudyCreationDialog from "@/components/study/StudyCreationDialog.vue";
import StudyLoadDialog from "@/components/study/StudyLoadDialog.vue";
import HelpDialog from "@/components/dialogs/HelpDialog.vue";

export default {
  name: "TopNavbar",
  components: {
    Login,
    Menubar,
    Button,
    Menu,
    Dialog,
    StudyCreationDialog,
    StudyLoadDialog,
    HelpDialog,
  },
  data() {
    return {
      creationDialogVisible: false,
      loadDialogVisible: false,
      showHelp: false,
    };
  },
  computed: {
    editingMenu() {
      return {
        label: "Project Editing",
        icon: "pi pi-wrench",
        to: "/editing",
      };
    },
    studyMenu() {
      return {
        label: "Study Management",
        icon: "pi pi-file-edit",
        to:
          !this.isInManagement && this.studyStore.editingActive()
            ? "/management"
            : null,
        items: [
          {
            label: "Create Study",
            icon: "pi pi-plus",
            command: () => (this.creationDialogVisible = true),
            to: "/management",
          },
          {
            label: "Load Study",
            icon: "pi pi-wrench",
            command: () => (this.loadDialogVisible = true),
            to: "/management",
          },
        ],
      };
    },
    userMenu() {
      return {
        label: this.isLoggedIn ? "User" : "Login",
        icon: this.isLoggedIn ? "pi pi-user" : "pi pi-sign-in",
        items: this.isLoggedIn
          ? [
              {
                label: "Profile",
                icon: "pi pi-user",
                to: "/profile",
              },
              {
                label: "Logout",
                icon: "pi pi-fw pi-power-off",
                command: async () => await this.authStore.logout(),
              },
            ]
          : undefined,
        to: this.isLoggedIn ? undefined : "/login",
      };
    },
    userManagementMenu() {
      return {
        label: "User Management",
        icon: "pi pi-user-edit",
        to: "/usermanagement",
      };
    },

    menuItems() {
      const menus = [];
      if (this.isResearcher) {
        menus.push(this.editingMenu);
        menus.push(this.studyMenu);
      }
      if (this.isAdmin) {
        menus.push(this.userManagementMenu);
      }
      menus.push(this.userMenu);
      return menus;
    },
    isInManagement() {
      return this.$route.name === "Study Management";
    },
  },
  methods: {
    async handleCreation(event) {
      this.creationDialogVisible = false;
      console.log(event);
      if (event) {
        const studyID = await this.studyStore.createStudy(event);
        await this.studyStore.selectCurrentStudy(studyID);
      }
    },
    async handleLoad(event) {
      this.loadDialogVisible = false;
      if (event) {
        await this.studyStore.selectCurrentStudy(event.UUID);
      }
    },
  },
  setup() {
    const authStore = useAuthStore();
    const showLoginDialog = ref(false);
    const isLoggedIn = computed(() => authStore.authed);
    const isAdmin = computed(() => authStore.isAdmin());
    const isResearcher = computed(() => authStore.isResearcher());
    const studyStore = useStudyStore();
    return {
      showLoginDialog,
      isLoggedIn,
      authStore,
      isResearcher,
      isAdmin,
      studyStore,
    };
  },
};
</script>

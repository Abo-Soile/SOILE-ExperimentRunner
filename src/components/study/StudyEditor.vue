<template>
  <h2>{{ currentStudy.name }}</h2>
  <div class="grid studydisplay">
    <div class="displaypart col-4 h-full">
      <h3>Project Properties</h3>
      <ObjectAndVersionSelectorWithProps
        :dropDownClasses="isStudyEditable ? '' : 'p-disabled'"
        v-model:element="sourceProject"
        v-model:version="sourceVersion"
        objectType="project"
        versionTitle="at Version"
        elementTitle="Project Name"
      />
      <StudyProperties
        v-model:name="currentStudy.name"
        v-model:descriptionShort="currentStudy.shortDescription"
        v-model:descriptionLong="currentStudy.description"
        v-model:shortCut="currentStudy.shortcut"
        v-model:private="currentStudy.private"
        @update:valid="(event) => (dataValid = event)"
      />
    </div>
    <div class="displaypart col-4">
      <StudyActivity
        v-model:active="currentStudy.active"
        :accessTokens="accessTokens"
        :permanentToken="permanentAccessToken"
        :usedTokens="usedTokens"
        @createTokens="(event) => createAccessTokens(event)"
        @createMasterToken="createMasterToken"
      ></StudyActivity>
      <!--<UserEditor
        v-if="isStudyEditable"
        :showPermissions="false"
        @updateUsers="updateCollaborators"
        @deleteUser="(event) => removeUser(event)"
        @updateRole="(event) => updateRole(event.role, event.username)"
        :showDetails="false"
        :userList="collaborators"
        title="Collaborators"
        :roleOptions="['READ', 'READ_WRITE', 'FULL']"
        roleColumn="access"
      >
      </UserEditor>-->
      <CollaboratorManager
        :availablePermissions="['READ', 'READ_WRITE', 'FULL']"
        :currentCollaborators="collaborators"
        :userList="userStore.users"
        listStyle=""
      ></CollaboratorManager>
    </div>
    <div class="displaypart col-4">
      Available Data
      <StudyDataSelector
        :studyID="selectedStudy.UUID"
        :availableData="availableData"
      ></StudyDataSelector>
    </div>
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import ObjectAndVersionSelectorWithProps from "@/components/utils/ObjectAndVersionSelectorWithProps.vue";
import { useStudyStore, useUserStore, useElementStore } from "@/stores";
import { reactive } from "vue";

import StudyProperties from "./StudyProperties.vue";
import StudyActivity from "./StudyActivity.vue";
import CollaboratorManager from "./CollaboratorManager.vue";
import StudyDataSelector from "./StudyDataSelector.vue";
import UserEditor from "@/components/user/UserEditor.vue";

export default {
  components: {
    StudyDataSelector,
    ObjectAndVersionSelectorWithProps,
    Dropdown,
    StudyProperties,
    StudyActivity,
    UserEditor,
    Button,
    CollaboratorManager,
  },
  props: {
    editableStudies: {
      type: Array,
      required: true,
    },
    selectedStudy: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dataValid: true,
      accessTokens: [],
      permanentAccessToken: null,
      usedTokens: [],
      availableData: {},
      collaborators: [],
      showUserDialog: false,
    };
  },
  setup(props) {
    console.log("Setting up StudyEditor");
    const currentStudy = reactive(
      JSON.parse(JSON.stringify(props.selectedStudy))
    );
    const studyStore = useStudyStore();
    const userStore = useUserStore();
    const elementStore = useElementStore();
    return { currentStudy, elementStore, studyStore, userStore };
  },
  computed: {
    isStudyEditable() {
      return (
        this.selectedStudy.UUID == null ||
        this.editableStudies
          .map((x) => x.UUID)
          .includes(this.selectedStudy.UUID)
      );
    },
    sourceProject: {
      get() {
        return this.elementStore.availableProjects.find(
          (x) => x.UUID === this.selectedStudy.sourceUUID
        );
      },
      set(newValue) {
        this.selectedStudy.sourceUUID = newValue.UUID;
      },
    },
    sourceVersion: {
      get() {
        return this.selectedStudy.version;
      },
      set(newValue) {
        if (newValue) {
          this.selectedStudy.version = newValue.version;
        } else {
          this.selectedStudy.version = undefined;
        }
      },
      additionalUsersExist: {},
    },
    currentStudyID() {
      if (this.currentStudy != null && this.currentStudy.UUID) {
        return this.currentStudy.UUID;
      } else {
        return null;
      }
    },
  },
  watch: {
    // on an updated project, we reparse it.
    selectedStudy(newValue) {
      console.log("Selected Project Changed");
      this.currentStudy = reactive(
        JSON.parse(JSON.stringify(this.selectedStudy))
      );
      this.updateData();
    },
    async "currentStudy.active"(newValue) {
      console.log("Activity of current project changed");
      if (newValue) {
        this.studyStore.activate(this.currentStudy.UUID);
      } else {
        this.studyStore.deactivate(this.currentStudy.UUID);
      }
    },
  },
  methods: {
    updateRole(newRole, username) {
      const user = this.collaborators.find((x) => x.user === username);
      if (this.currentStudyID) {
        userStore
          .updateRoleInStudy(user, newRole, this.currentStudyID)
          .then((res) => {
            if (res) {
              this.collaborators[index].role = newRole;
            }
          });
      }
    },
    updateData() {
      console.log("Updating Data for Study in Editor");
      this.updateTokenData();
      this.updateAvailableDLData();
      if (this.isStudyEditable) {
        this.updateCollaborators();
      }
      this.userStore.fetchUserData();
    },
    async updateTokenData() {
      console.log("Updating token data");
      const tokenInformation = await this.studyStore.getTokenInformation(
        this.currentStudy.UUID
      );
      this.usedTokens = tokenInformation.usedTokens || [];
      this.accessTokens = tokenInformation.signupTokens || [];
      this.permanentAccessToken = tokenInformation.permanentAccessToken || "";
    },
    async updateAvailableDLData() {
      this.availableData = await this.studyStore.getDownloadableData(
        this.currentStudy.UUID
      );
    },
    async updateCollaborators() {
      if (this.currentStudyID) {
        const collabs = await this.studyStore.getCollaboratorsForStudy(
          this.currentStudyID
        );
        if (collabs) {
          this.collaborators = collabs;
        } else {
          this.collaborators = [];
        }
      }
    },
    async createAccessTokens(count) {
      await this.studyStore.generateTokens(this.currentStudy.UUID, count);
      await this.updateTokenData();
    },
    async createMasterToken() {
      await this.studyStore.generateMasterToken(currentStudy);
      await this.updateTokenData();
    },
  },
  mounted() {
    if (this.currentStudy && this.currentStudy.UUID) {
      console.log("StudyEditor Mounted");
      this.updateData();
    }
  },
};
</script>

<style scoped>
.displaypart {
  margin: 2px auto;
  border: 1px solid;
}
.studydisplay {
  min-height: 50vh;
  height: 100%;
}
</style>

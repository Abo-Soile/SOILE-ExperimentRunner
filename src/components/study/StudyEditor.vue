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
      <div class="grid">
        <div
          class="col-4 flex justify-content-start"
          v-tooltip="
            'You can only change the project if it is not active and there are no Participants yet'
          "
        >
          <Button @click="updateStudy" :disabled="!isStudyEditable"
            >Save Changes</Button
          >
        </div>
        <div
          class="col-4 flex justify-content-start"
          v-tooltip="
            'Pilot the study, without actually generating any data (only temporary data will be created)'
          "
        >
          <Button @click="pilotStudy" :disabled="!isStudyEditable"
            >Pilot</Button
          >
        </div>
        <div class="col-4 flex justify-content-end">
          <Button @click="showResetDialog = true" :disabled="isActive"
            >Reset Study</Button
          >
        </div>
      </div>
    </div>
    <div class="displaypart col-4">
      <StudyActivity
        v-model:active="currentStudy.active"
        :accessTokens="accessTokens"
        :permanentToken="permanentAccessToken"
        :usedTokens="usedTokens"
        :studyID="currentStudy.UUID"
        :shortCut="currentStudy.shortCut ? currentStudy.shortCut : null"
        @createTokens="(event) => createAccessTokens(event)"
        @createMasterToken="createMasterToken"
      ></StudyActivity>

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
  <ConfirmDialog
    v-if="showResetDialog"
    v-model:isVisible="showResetDialog"
    @confirm="resetStudy"
    title="Reset Study"
    message="This will irreversibly delete all participant data from this study! Are you sure you want to do this?"
  ></ConfirmDialog>
</template>

<script>
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import ObjectAndVersionSelectorWithProps from "@/components/utils/ObjectAndVersionSelectorWithProps.vue";
import {
  useStudyStore,
  useUserStore,
  useElementStore,
  usePilotStore,
} from "@/stores";
import { reactive } from "vue";

import { ConfirmDialog } from "@/components/dialogs";
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
    ConfirmDialog,
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
      showResetDialog: false,
    };
  },
  setup(props) {
    console.log("Setting up StudyEditor");
    const currentStudy = reactive(
      JSON.parse(JSON.stringify(props.selectedStudy))
    );
    const studyStore = useStudyStore();
    const pilotStore = usePilotStore();
    const userStore = useUserStore();
    const elementStore = useElementStore();
    return { currentStudy, elementStore, studyStore, userStore, pilotStore };
  },
  computed: {
    isStudyEditable() {
      return (
        (this.selectedStudy.UUID == null || this.hasWriteAccess) &&
        (!this.availableData.participants ||
          this.availableData.participants.length == 0) && // This study cannot have any participants, if it does, the settings cannot be changed.
        !this.isActive
      );
    },
    isActive() {
      return this.currentStudy.active;
    },
    hasWriteAccess() {
      return this.editableStudies
        .map((x) => x.UUID)
        .includes(this.selectedStudy.UUID);
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
    pilotStudy() {
      this.elementStore
        .getElement(
          this.currentStudy.sourceUUID,
          this.currentStudy.version,
          "project"
        )
        .then((element) => {
          this.pilotStore.setCurrentObject(element);
          this.$router.push("/pilot/");
        });
    },
    async updateData() {
      console.log("Updating Data for Study in Editor");
      await this.studyStore.updateEditableStudies();
      this.updateTokenData();
      this.updateAvailableDLData();
      if (this.hasWriteAccess) {
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
      await this.studyStore.generateMasterToken(this.currentStudy.UUID);
      await this.updateTokenData();
    },
    async updateStudy() {
      await this.studyStore.updateStudy(this.currentStudy);
    },
    async resetStudy() {
      await this.studyStore.resetStudy(this.currentStudy.UUID);
      this.updateData();
      this.showResetDialog = false;
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

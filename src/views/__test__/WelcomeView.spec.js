import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { mount } from "@vue/test-utils";
import PrimeVue from "primevue/config";

import { setActivePinia, createPinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import WelcomeView from "@/views/WelcomeView.vue";
import { ProjectList } from "../../components";
import { setupAxios } from "@/axios";
import axios from "axios";
import { useProjectStore, useAuthStore } from "../../stores";
import { router } from "@/helpers/router";
import i18n from "@/i18n";

//TODO: Do proper test...
beforeEach(async () => {
  // creates a fresh pinia and make it active so it's automatically picked
  // up by any useStore() call without having to pass it to it:
  // `useStore(pinia)`
  setActivePinia(createPinia());
  // set up the storeswith testing data....
  const SERVER_URL = `${import.meta.env.VITE_BACKENDDOMAIN}${
    import.meta.env.VITE_BACKENDPORT != ""
      ? ":" + import.meta.env.VITE_BACKENDPORT
      : ""
  }`;
  console.log(SERVER_URL);
  console.log("Set up");
  console.log(axios.defaults);
  setupAxios(import.meta.env);
  console.log(axios.defaults);
  const authStore = useAuthStore();
  const projectStore = useProjectStore();
  await authStore.refreshSession();
  await projectStore.updateAvailableStudies();
  await projectStore.fetchSignedUpStudies();
});

describe("WelcomeView", () => {
  it("renders correctly", async () => {
    console.log("Trying to mount it.");
    const wrapper = mount(WelcomeView, {
      global: {
        plugins: [createTestingPinia(), PrimeVue, router, i18n],
      },
    });
    expect(wrapper.findComponent(ProjectList).exists()).toBe(true);
  });
});

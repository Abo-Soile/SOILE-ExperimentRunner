import { defineStore } from "pinia";
import { i18n, supportedLocales } from "@/i18n";

export const useLanguageStore = defineStore({
  id: "language",
  state: () => ({
    // initialize the state. We don't update from the local storage, because this could contain privilegded data
    defautlLanguage: "en",
    supportedLocales: supportedLocales,
  }),
  actions: {
    /**
     * Se the current locale
     * @param {*} locale
     */
    setLocale(locale) {
      i18n.locale = locale;
    },
    /**
     * Get the current locale
     */
    getLocale() {
      return i18n.locale;
    },
    /**
     * Set the default locale
     */
    setDefaultLocale(locale) {
      this.defautlLanguage = locale;
    },
    /**
     * Restore default locale
     */
    restoreDefault() {
      i18n.locale = this.defautlLanguage;
    },
  },
});

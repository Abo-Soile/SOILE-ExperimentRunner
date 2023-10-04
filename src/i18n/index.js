import { createI18n } from "vue-i18n";

import * as en from "./english.json";
import * as fi from "./finnish.json";

const instance = createI18n({
  messages: {
    en,
    fi,
  },
  locale: "en",
});

export const supportedLocales = [
  { id: "en", name: "English" },
  { id: "fi", name: "Suomi (Finnish)" },
];

export default instance;

export const i18n = instance.global;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import enNav from "./locales/en/nav.json";
import enHeader from "./locales/en/header.json";
import enMarketplace from "./locales/en/marketplace.json";
import enOrders from "./locales/en/orders.json";
import amCommon from "./locales/am/common.json";
import amNav from "./locales/am/nav.json";
import amHeader from "./locales/am/header.json";
import amMarketplace from "./locales/am/marketplace.json";
import amOrders from "./locales/am/orders.json";

const languageStorageKey = "cargo.language";
const supportedLanguages = ["en", "am"] as const;

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(languageStorageKey);
  return saved && supportedLanguages.includes(saved as (typeof supportedLanguages)[number])
    ? saved
    : "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      nav: enNav,
      header: enHeader,
      marketplace: enMarketplace,
      orders: enOrders,
    },
    am: {
      common: amCommon,
      nav: amNav,
      header: amHeader,
      marketplace: amMarketplace,
      orders: amOrders,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "nav", "header", "marketplace", "orders"],
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (language: string) => {
  if (!supportedLanguages.includes(language as (typeof supportedLanguages)[number])) {
    return;
  }
  i18n.changeLanguage(language);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(languageStorageKey, language);
  }
};

export const languageOptions = [
  { code: "en", labelKey: "header:english" },
  { code: "am", labelKey: "header:amharic" },
];

export default i18n;

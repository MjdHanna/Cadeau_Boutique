import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: "ar",
    fallbackLng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/translation.json?v=1",
    },
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    ns: ["common"],
    defaultNS: "common",
    backend: {
      // Alt yol deploy’larında (GitHub Pages vb.) doğru dosya yolu:
       loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    load: "currentOnly", // en-US → en
    debug: import.meta.env.DEV === true,
    // Suspense kullanmıyorsan aç:
    // react: { useSuspense: false },
  });

export default i18n;

// (Opsiyonel) App.jsx içinde bir defa:
/// useEffect(() => {
///   const setHtmlLang = (lng) =>
///     document.documentElement.setAttribute("lang", lng || "tr");
///   setHtmlLang(i18n.resolvedLanguage);
///   i18n.on("languageChanged", setHtmlLang);
///   return () => i18n.off("languageChanged", setHtmlLang);
/// }, []);

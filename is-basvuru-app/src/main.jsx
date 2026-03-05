// src/main.jsx
import "./i18n";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// date-fns yerelleri
import { tr as trLocale, enUS } from "date-fns/locale";

// i18n ile köprü için hook
import { useTranslation } from "react-i18next";

const theme = createTheme({
  components: {
    MuiTextField: { defaultProps: { color: "inherit" } },
  },
});

// i18n ↔ date-fns ↔ <html lang> köprüsü
// eslint-disable-next-line react-refresh/only-export-components
function I18nBridge({ children }) {
  const { i18n } = useTranslation();
  const [dfLocale, setDfLocale] = useState(
    i18n.resolvedLanguage === "tr" ? trLocale : enUS
  );

  useEffect(() => {
    // <html lang="...">
    document.documentElement.setAttribute(
      "lang",
      i18n.resolvedLanguage || "tr"
    );
    // date-fns yereli
    setDfLocale(i18n.resolvedLanguage === "tr" ? trLocale : enUS);
  }, [i18n.resolvedLanguage]);

  // MUI DatePicker placeholder’ları (isteğe göre genişletebilirsin)
  const localeText = useMemo(() => {
    if (i18n.resolvedLanguage === "tr") {
      return {
        fieldYearPlaceholder: () => "YYYY",
        fieldMonthPlaceholder: () => "AA",
        fieldDayPlaceholder: () => "GG",
      };
    }
    return {
      fieldYearPlaceholder: () => "YYYY",
      fieldMonthPlaceholder: () => "MM",
      fieldDayPlaceholder: () => "DD",
    };
  }, [i18n.resolvedLanguage]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={dfLocale}
      localeText={localeText}
    >
      {children}
    </LocalizationProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <I18nBridge>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </I18nBridge>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);

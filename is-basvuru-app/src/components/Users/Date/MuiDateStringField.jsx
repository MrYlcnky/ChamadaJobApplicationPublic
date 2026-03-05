// components/Fields/MuiDateStringField.jsx
import * as React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import trLocale from "date-fns/locale/tr";

function strToDate(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}
function dateToStr(d) {
  if (!d || Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MuiDateStringField({
  label = "Tarih",
  name = "tarih",
  value,
  onChange,
  required = false,
  error, // sadece helperText olarak gösterilecek
  min,
  max,
  disabled = false,
  readOnly = false,
  displayFormat = "yyyy.MM.dd",
}) {
  const dateVal = strToDate(value);

  const handleMuiChange = (d) => {
    if (!d || Number.isNaN(d.getTime())) {
      onChange?.({ target: { name, value: "" } });
      return;
    }
    onChange?.({ target: { name, value: dateToStr(d) } });
  };

  return (
    <div className="mt-1">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={trLocale}
      >
        <DatePicker
          value={dateVal}
          onChange={handleMuiChange}
          format={displayFormat}
          minDate={strToDate(min)}
          maxDate={strToDate(max)}
          disabled={disabled}
          disableOpenPicker={disabled}
          reduceAnimations
          disableHighlightToday
          // MUI'nin iç validasyonundan gelen error sınıfının etkisini kır
          onError={() => {}}
          slotProps={{
            textField: {
              color: "inherit",
              id: name,
              name,
              variant: "outlined",
              fullWidth: true,
              size: "small",
              required,
              // KRİTİK: kırmızı border'ı tetikleme
              error: false,
              // Hata metnini yine göster
              helperText: error || "",
              FormHelperTextProps: {
                sx: { color: "#DC2626", fontWeight: 500, ml: 0 },
              },
              disabled,
              inputProps: { placeholder: "GG.AA.YYYY", readOnly },
              className: "no-red-border",
              sx: {
                // Kutu yüksekliği/zemin
                "& .MuiOutlinedInput-root, & .MuiInputBase-root , & .MuiPickersInputBase-root":
                  {
                    height: 43,
                    borderRadius: "0.5rem",
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    boxShadow: "none !important",
                    outline: "none !important",
                  },

                /* --- Varsayılan: gri-300 --- */
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "#D1D5DB !important",
                },

                /* --- Hover: siyah --- */
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "#000000 !important",
                },

                /* --- Focus: siyah --- */
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#000000 !important",
                },

                /* --- Focus+Hover: yine siyah --- */
                "& .MuiOutlinedInput-root.Mui-focused:hover fieldset": {
                  borderColor: "#000000 !important",
                },

                /* --- MUI .Mui-error atarsa bile override et (spesifiklik artırmak için &&) --- */
                "&& .MuiOutlinedInput-root.Mui-error fieldset": {
                  borderColor: "#D1D5DB !important",
                },
                "&& .MuiOutlinedInput-root.Mui-error:hover fieldset": {
                  borderColor: "#000000 !important",
                },
                "&& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset": {
                  borderColor: "#000000 !important",
                },

                // Görsel süsleri kapalı tut
                "& .MuiOutlinedInput-root:hover": { boxShadow: "none" },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  boxShadow: "none !important",
                  outline: "none !important",
                  border: "none",
                },
                "& .MuiOutlinedInput-root:focus-within": {
                  boxShadow: "none !important",
                  outline: "none !important",
                },

                // input metin/placeholder
                "& .MuiInputBase-input": {
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 12,
                  paddingRight: 36,
                  fontSize: "0.875rem",
                  color: "#111827",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#9CA3AF",
                  opacity: 1,
                },

                // ikon
                "& .MuiSvgIcon-root": { color: "#6B7280" },
              },
            },
            popper: { placement: "bottom-start" },
            desktopPaper: {
              sx: {
                backgroundColor: "#FFFFFF",
                borderRadius: "0.75rem",
                boxShadow: "none",
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}

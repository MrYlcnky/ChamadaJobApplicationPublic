import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";
import { useTranslation } from "react-i18next";
import { createLanguageSchema } from "../../../schemas/languageSchema";

const BASE_SELECT =
  "w-full h-[43px] border rounded-lg px-3 py-2 focus:outline-none transition border-gray-300 hover:border-black cursor-pointer bg-white";
const BASE_INPUT =
  "w-full h-[43px] border rounded-lg px-3 py-2 focus:outline-none transition border-gray-300 hover:border-black";

// Backend Enumları (Dil Seviyesi)
const Levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LanguageAddModal({
  open,
  mode = "create",
  initialData = null,
  definitions = {}, // ✅ JobApplicationForm -> Table -> Buraya gelecek
  onClose,
  onSave,
  onUpdate,
}) {
  const { t } = useTranslation();
  const schema = useMemo(() => createLanguageSchema(t), [t]);
  const dialogRef = useRef(null);
  const otherRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    dilSelect: "", // Backend ID'si (string olarak) veya "other"
    dilOther: "", // Manuel girilen isim
    konusma: "",
    yazma: "",
    okuma: "",
    dinleme: "",
    ogrenilenKurum: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  // ✅ INITIAL DATA LOAD
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      // Backend'den gelen veri:
      // initialData.dilId (int) -> Varsa Select'e set et
      // initialData.digerDilAdi (string) -> Varsa dilSelect="other", dilOther=value

      let initialSelect = "";
      let initialOther = "";

      if (initialData.dilId) {
        initialSelect = String(initialData.dilId);
      } else if (initialData.digerDilAdi) {
        initialSelect = "other";
        initialOther = initialData.digerDilAdi;
      }

      setFormData({
        dilSelect: initialSelect,
        dilOther: initialOther,
        // Enum int değerlerini stringe çeviriyoruz ("1" -> "1")
        konusma: initialData.konusma ? String(initialData.konusma) : "",
        yazma: initialData.yazma ? String(initialData.yazma) : "",
        okuma: initialData.okuma ? String(initialData.okuma) : "",
        dinleme: initialData.dinleme ? String(initialData.dinleme) : "",
        ogrenilenKurum: initialData.ogrenilenKurum ?? "",
      });
    } else {
      // Create Mode
      setFormData({
        dilSelect: "",
        dilOther: "",
        konusma: "",
        yazma: "",
        okuma: "",
        dinleme: "",
        ogrenilenKurum: "",
      });
    }
    setErrors({});
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  const handleChange = (key, value) => {
    const next = { ...formData, [key]: value };

    // "Diğer" seçilirse inputu temizle veya focusla mantığı
    if (key === "dilSelect") {
      if (value !== "other") next.dilOther = "";
      else setTimeout(() => otherRef.current?.focus(), 50);
    }

    setFormData(next);

    // Anlık Validasyon
    const result = schema.safeParse(next);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === key);
      setErrors((prev) => ({ ...prev, [key]: issue ? issue.message : "" }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrs = {};
      result.error.issues.forEach((i) => {
        newErrs[i.path[0]] = i.message;
      });
      setErrors(newErrs);
      return;
    }

    // ✅ PAYLOAD HAZIRLIĞI
    // JobApplicationForm içinde işlenecek format
    const payload = {
      // Eğer "other" seçildiyse ID null, yoksa ID
      dilId: formData.dilSelect === "other" ? null : Number(formData.dilSelect),
      // Eğer "other" seçildiyse string, yoksa null
      digerDilAdi:
        formData.dilSelect === "other" ? formData.dilOther.trim() : null,

      // Select box'ta ID'si seçili olan dilin Adını bulalım (Tabloda göstermek için)
      dilAdiGosterim:
        formData.dilSelect === "other"
          ? formData.dilOther
          : definitions.diller?.find((d) => String(d.id) === formData.dilSelect)
              ?.dilAdi,

      konusma: Number(formData.konusma), // 1-6 arası int
      yazma: Number(formData.yazma),
      okuma: Number(formData.okuma),
      dinleme: Number(formData.dinleme),
      ogrenilenKurum: formData.ogrenilenKurum,
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);
    handleClose();
  };

  const isValid = schema.safeParse(formData).success;
  const disabledTip = !isValid ? t("common.fillAllProperly") : "";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit"
              ? t("languages.modal.titleEdit")
              : t("languages.modal.titleCreate")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 focus:outline-none"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* DİL SEÇİMİ + DİĞER */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("languages.form.language")} *
                </label>
                <select
                  value={formData.dilSelect}
                  onChange={(e) => handleChange("dilSelect", e.target.value)}
                  className={BASE_SELECT}
                >
                  <option value="">{t("languages.select.choose")}</option>
                  {/* Backend'den gelen diller */}
                  {definitions.diller?.map((dil) => (
                    <option key={dil.id} value={dil.id}>
                      {dil.dilAdi}
                    </option>
                  ))}
                  <option value="other">{t("languages.options.other")}</option>
                </select>
                {errors.dilSelect && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dilSelect}
                  </p>
                )}
              </div>

              {/* Diğer Dil Input (Sadece "other" seçilince aktif) */}
              <div className="sm:col-span-2 relative">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("languages.form.otherLanguage")}
                </label>
                <input
                  ref={otherRef}
                  type="text"
                  value={formData.dilOther}
                  onChange={(e) => handleChange("dilOther", e.target.value)}
                  disabled={formData.dilSelect !== "other"}
                  className={`${BASE_INPUT} ${formData.dilSelect !== "other" ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}`}
                  placeholder={
                    formData.dilSelect === "other"
                      ? t("languages.placeholders.otherLanguage")
                      : ""
                  }
                  maxLength={40}
                />
                {errors.dilOther && (
                  <p className="mt-1 text-xs text-red-600">{errors.dilOther}</p>
                )}
              </div>
            </div>

            {/* SEVİYELER (Okuma, Yazma, Konuşma, Dinleme) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "konusma", label: t("languages.form.speaking") },
                { key: "dinleme", label: t("languages.form.listening") },
                { key: "okuma", label: t("languages.form.reading") },
                { key: "yazma", label: t("languages.form.writing") },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-600 mb-1">
                    {field.label} *
                  </label>
                  <select
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={BASE_SELECT}
                  >
                    <option value="">{t("languages.select.choose")}</option>
                    {Levels.map((lvl, idx) => (
                      <option key={lvl} value={idx + 1}>
                        {lvl}
                      </option> // 1=A1, 2=A2 ...
                    ))}
                  </select>
                  {errors[field.key] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Nasıl Öğrenildi */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("languages.form.learnedHow")} *
              </label>
              <input
                type="text"
                value={formData.ogrenilenKurum}
                onChange={(e) => handleChange("ogrenilenKurum", e.target.value)}
                className={BASE_INPUT}
                maxLength={80}
                placeholder={t("languages.placeholders.learnedHow")}
              />
              {errors.ogrenilenKurum && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.ogrenilenKurum}
                </p>
              )}
            </div>
          </div>

          <div className="border-t bg-white px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
              >
                {t("actions.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid}
                title={disabledTip}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${isValid ? (mode === "edit" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700") + " active:scale-95 cursor-pointer" : "bg-blue-300 opacity-90 cursor-not-allowed"}`}
              >
                {mode === "edit" ? t("actions.update") : t("actions.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

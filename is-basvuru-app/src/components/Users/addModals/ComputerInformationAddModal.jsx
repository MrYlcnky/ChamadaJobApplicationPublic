import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";
import { useTranslation } from "react-i18next";
import { createComputerSchema } from "../../../schemas/computerSchema";

// Backend Enum ID'leri
const YetkinlikEnum = {
  CokZayif: 1,
  Zayif: 2,
  Orta: 3,
  Iyi: 4,
  CokIyi: 5,
};

const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black focus:border-black";

export default function ComputerInformationAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const { t } = useTranslation();
  const schema = useMemo(() => createComputerSchema(t), [t]);
  const dialogRef = useRef(null);

  // Başlangıç değerleri boş string (Uncontrolled hatasını önlemek için)
  const [formData, setFormData] = useState({ programAdi: "", yetkinlik: "" });
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

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        programAdi: initialData.programAdi ?? "",
        // Backend'den gelen ID'yi stringe çevir (Select box için)
        yetkinlik: initialData.yetkinlik ? String(initialData.yetkinlik) : "",
      });
    } else {
      setFormData({ programAdi: "", yetkinlik: "" });
    }
    setErrors({});
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  // Anlık Validasyonlu HandleChange
  const handleChange = (key, value) => {
    const updatedFormData = { ...formData, [key]: value };
    setFormData(updatedFormData);

    const result = schema.safeParse(updatedFormData);

    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === key);
      setErrors((prev) => ({ ...prev, [key]: issue ? issue.message : "" }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Buton aktiflik kontrolü
  const isValid = schema.safeParse(formData).success;
  const disabledTip = !isValid ? t("common.fillAllProperly") : "";

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const next = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0];
        if (key) next[key] = i.message;
      });
      setErrors(next);
      return;
    }

    // Backend formatına hazırla (String ID -> Number ID)
    const payload = {
      programAdi: parsed.data.programAdi,
      yetkinlik: Number(parsed.data.yetkinlik), // String "1" -> Number 1
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);

    handleClose();
  };

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
        {/* Başlık */}
        <div className="flex items-center justify-between bg-linear-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit"
              ? t("computer.modal.titleEdit")
              : t("computer.modal.titleCreate")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Form Alanı */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Program Adı */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("computer.form.program")} *
                </label>
                <input
                  type="text"
                  value={formData.programAdi}
                  onChange={(e) => handleChange("programAdi", e.target.value)}
                  className={FIELD_BASE}
                  placeholder={t("computer.placeholders.program")}
                  maxLength={60}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.programAdi ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.programAdi}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${formData.programAdi.length >= 54 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {formData.programAdi.length}/60
                  </p>
                </div>
              </div>

              {/* Yetkinlik (Seviye) */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("computer.form.level")} *
                </label>
                <select
                  value={formData.yetkinlik}
                  onChange={(e) => handleChange("yetkinlik", e.target.value)}
                  className={`${FIELD_BASE} h-10.5 cursor-pointer`}
                >
                  <option value="">{t("computer.select.choose")}</option>
                  <option value={YetkinlikEnum.CokZayif}>
                    {t("computer.levels.veryPoor")}
                  </option>
                  <option value={YetkinlikEnum.Zayif}>
                    {t("computer.levels.poor")}
                  </option>
                  <option value={YetkinlikEnum.Orta}>
                    {t("computer.levels.medium")}
                  </option>
                  <option value={YetkinlikEnum.Iyi}>
                    {t("computer.levels.good")}
                  </option>
                  <option value={YetkinlikEnum.CokIyi}>
                    {t("computer.levels.veryGood")}
                  </option>
                </select>
                {errors.yetkinlik && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.yetkinlik}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Alt Butonlar */}
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
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                  isValid
                    ? (mode === "edit"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700") +
                      " active:scale-95 cursor-pointer"
                    : "bg-blue-300 opacity-90 cursor-not-allowed"
                }`}
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

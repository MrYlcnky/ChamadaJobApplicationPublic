import { useEffect, useRef, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";
import { useTranslation } from "react-i18next";
import { createReferenceSchema } from "../../../schemas/referenceSchema";

/* -------------------- Ortak Alan Stili -------------------- */
const FIELD_BASE =
  "w-full border rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none border-gray-300 hover:border-black focus:border-black transition h-[42px]";

// Sadece numara ve boşluk/parantez girişine izin ver
const onlyNumbersAndSymbols = (val) => val.replace(/[^0-9+\s()-]/g, "");

export default function ReferenceAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const { t } = useTranslation();
  const schema = useMemo(() => createReferenceSchema(t), [t]);
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    calistigiKurum: "", // "1" veya "2" (String olarak tutuyoruz, formda number'a çevireceğiz)
    referansAdi: "",
    referansSoyadi: "",
    referansIsYeri: "",
    referansGorevi: "",
    referansTelefon: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ---------- SCROLL LOCK ---------- */
  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  // Modal Açılış: Verileri Doldur
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setFormData({
        calistigiKurum: initialData.calistigiKurum
          ? String(initialData.calistigiKurum)
          : "",
        referansAdi: initialData.referansAdi ?? "",
        referansSoyadi: initialData.referansSoyadi ?? "",
        referansIsYeri: initialData.referansIsYeri ?? "",
        referansGorevi: initialData.referansGorevi ?? "",
        referansTelefon: initialData.referansTelefon ?? "",
      });
    } else {
      setFormData({
        calistigiKurum: "",
        referansAdi: "",
        referansSoyadi: "",
        referansIsYeri: "",
        referansGorevi: "",
        referansTelefon: "",
      });
    }
    setErrors({});
    setTouched({});
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  /* -------------------- Change Handler -------------------- */
  const validateField = (name, nextData) => {
    const parsed = schema.safeParse(nextData);
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === name);
      setErrors((p) => ({ ...p, [name]: issue ? issue.message : "" }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "referansTelefon") {
      val = onlyNumbersAndSymbols(value);
    }

    const next = { ...formData, [name]: val };
    setFormData(next);

    if (touched[name]) {
      validateField(name, next);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    validateField(name, formData);
  };

  // Tüm form geçerli mi?
  const isValid = useMemo(
    () => schema.safeParse(formData).success,
    [formData, schema],
  );
  const disabledTip = !isValid ? t("common.fillAllProperly") : "";

  /* -------------------- Submit -------------------- */
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Tüm alanları touch et
    const allKeys = Object.keys(formData);
    setTouched(allKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const next = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) next[i.path[0]] = i.message;
      });
      setErrors(next);
      return;
    }

    const d = parsed.data;
    const payload = {
      calistigiKurum: d.calistigiKurum, // String "1" veya "2"
      referansAdi: d.referansAdi.trim(),
      referansSoyadi: d.referansSoyadi.trim(),
      referansIsYeri: d.referansIsYeri.trim(),
      referansGorevi: d.referansGorevi.trim(),
      referansTelefon: d.referansTelefon.trim(),
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
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-6 py-4">
          <h2 className="text-lg font-semibold truncate">
            {mode === "edit"
              ? t("references.modal.titleEdit")
              : t("references.modal.titleCreate")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/15 active:bg-white/25 cursor-pointer focus:outline-none"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 1. Satır: Kurum Tipi ve Telefon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.orgType")} *
                </label>
                <select
                  name="calistigiKurum"
                  value={formData.calistigiKurum}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={FIELD_BASE}
                >
                  <option value="">{t("common.pleaseSelect")}</option>
                  <option value="1">
                    {t("references.options.inHouse")}
                  </option>{" "}
                  {/* 1: Bünyemizde */}
                  <option value="2">
                    {t("references.options.external")}
                  </option>{" "}
                  {/* 2: Harici */}
                </select>
                {touched.calistigiKurum && errors.calistigiKurum && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.calistigiKurum}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.phone")} *
                </label>
                <input
                  type="text"
                  name="referansTelefon"
                  value={formData.referansTelefon}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  className={FIELD_BASE}
                  placeholder={t("references.placeholders.phone")}
                />
                {touched.referansTelefon && errors.referansTelefon && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.referansTelefon}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Satır: Ad ve Soyad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.firstName")} *
                </label>
                <input
                  type="text"
                  name="referansAdi"
                  value={formData.referansAdi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  className={FIELD_BASE}
                  placeholder={t("references.placeholders.firstName")}
                />
                {touched.referansAdi && errors.referansAdi && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.referansAdi}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.lastName")} *
                </label>
                <input
                  type="text"
                  name="referansSoyadi"
                  value={formData.referansSoyadi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={50}
                  className={FIELD_BASE}
                  placeholder={t("references.placeholders.lastName")}
                />
                {touched.referansSoyadi && errors.referansSoyadi && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.referansSoyadi}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Satır: İş Yeri ve Görev */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.workplace")} *
                </label>
                <input
                  type="text"
                  name="referansIsYeri"
                  value={formData.referansIsYeri}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  className={FIELD_BASE}
                  placeholder={t("references.placeholders.workplace")}
                />
                {touched.referansIsYeri && errors.referansIsYeri && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.referansIsYeri}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("references.form.role")} *
                </label>
                <input
                  type="text"
                  name="referansGorevi"
                  value={formData.referansGorevi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  className={FIELD_BASE}
                  placeholder={t("references.placeholders.role")}
                />
                {touched.referansGorevi && errors.referansGorevi && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.referansGorevi}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-white px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid}
                title={disabledTip}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${isValid ? (mode === "edit" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700") + " active:scale-95 cursor-pointer" : (mode === "edit" ? "bg-green-300" : "bg-blue-300") + " opacity-90 cursor-not-allowed"}`}
              >
                {mode === "edit" ? t("common.update") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { createEducationSchema } from "../../../schemas/educationSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import MuiDateStringField from "../Date/MuiDateStringField";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";
import { useTranslation } from "react-i18next";

import {
  toDateSafe,
  toISODate,
  fromISODateString,
  todayISO,
} from "../modalHooks/dateUtils";

/* -------------------- Enum Sabitleri -------------------- */
const EgitimSeviyeEnum = {
  Lise: 1,
  OnLisans: 2,
  Lisans: 3,
  YuksekLisans: 4,
  Doktora: 5,
  Diger: 6,
};
const DiplomaDurumEnum = { Mezun: 1, Devam: 2, AraVerdi: 3, Terk: 4 };
const NotSistemiEnum = { YuzlukSistem: 1, DortlukSistem: 2 };

const BASE_FIELD =
  "w-full rounded-lg border px-3 py-2 transition border-gray-300 hover:border-black focus:outline-none";
const BASE_SELECT =
  "w-full h-[43px] rounded-lg border px-3 py-2 transition border-gray-300 hover:border-black focus:outline-none cursor-pointer";

export default function EducationAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
}) {
  const { t } = useTranslation();
  const eduSchema = useMemo(() => createEducationSchema(t), [t]);
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    seviye: "",
    okul: "",
    bolum: "",
    notSistemi: "2",
    gano: "",
    baslangic: "",
    bitis: "",
    diplomaDurum: "",
  });
  const [errors, setErrors] = useState({});

  const todayStr = todayISO(); // utils'den geliyor

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
        ...initialData,
        seviye: initialData.seviye ? String(initialData.seviye) : "",
        diplomaDurum: initialData.diplomaDurum
          ? String(initialData.diplomaDurum)
          : "",
        notSistemi: initialData.notSistemi
          ? String(initialData.notSistemi)
          : "2",
        gano: initialData.gano ? String(initialData.gano) : "",
        baslangic: initialData.baslangic
          ? toISODate(toDateSafe(initialData.baslangic))
          : "",
        bitis: initialData.bitis
          ? toISODate(toDateSafe(initialData.bitis))
          : "",
      });
      setErrors({});
    } else {
      setFormData({
        seviye: "",
        okul: "",
        bolum: "",
        notSistemi: "2",
        gano: "",
        baslangic: "",
        bitis: "",
        diplomaDurum: "",
      });
      setErrors({});
    }
  }, [open, mode, initialData]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...formData, [name]: value };

    if (name === "diplomaDurum") {
      const val = Number(value);
      if (val === DiplomaDurumEnum.Devam || val === DiplomaDurumEnum.Terk) {
        next.bitis = "";
        setErrors((p) => ({ ...p, bitis: "" }));
      }
    }
    setFormData(next);

    const parsed = eduSchema.safeParse(next);
    if (!parsed.success) {
      const issue =
        parsed.error.issues.find((i) => i.path[0] === name) ||
        (name === "diplomaDurum" &&
          parsed.error.issues.find((i) => i.path[0] === "bitis"));
      setErrors((p) => ({
        ...p,
        [issue?.path?.[0] || name]: issue ? issue.message : "",
      }));
    } else {
      setErrors((p) => ({ ...p, [name]: "" }));
      if (name === "diplomaDurum") setErrors((p) => ({ ...p, bitis: "" }));
    }
  };

  const isValid = eduSchema.safeParse(formData).success;
  const disabledTip = !isValid ? t("education.validations.formInvalid") : "";

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const parsed = eduSchema.safeParse(formData);

    if (!parsed.success) {
      const newErrs = {};
      parsed.error.issues.forEach((i) => {
        newErrs[i.path[0]] = i.message;
      });
      setErrors(newErrs);
      return;
    }

    const payload = {
      ...parsed.data,
      seviye: Number(parsed.data.seviye),
      diplomaDurum: Number(parsed.data.diplomaDurum),
      notSistemi: Number(parsed.data.notSistemi),
      baslangic: fromISODateString(parsed.data.baslangic),
      bitis:
        parsed.data.bitis && parsed.data.bitis !== ""
          ? fromISODateString(parsed.data.bitis)
          : null,
      gano:
        parsed.data.gano === "" || parsed.data.gano == null
          ? null
          : Number(parsed.data.gano),
    };

    if (mode === "edit") onUpdate?.(payload);
    else onSave?.(payload);
    handleClose();
  };

  if (!open) return null;

  const isEndDisabled =
    Number(formData.diplomaDurum) === DiplomaDurumEnum.Devam ||
    Number(formData.diplomaDurum) === DiplomaDurumEnum.Terk;
  const isHundredSystem =
    Number(formData.notSistemi) === NotSistemiEnum.YuzlukSistem;

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
        <div className="flex items-center justify-between bg-linear-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit"
              ? t("education.modal.titleEdit")
              : t("education.modal.titleCreate")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.level")} *
                </label>
                <select
                  name="seviye"
                  value={formData.seviye}
                  onChange={handleChange}
                  className={BASE_SELECT}
                >
                  <option value="">{t("education.select.choose")}</option>
                  <option value={EgitimSeviyeEnum.Lise}>
                    {t("education.levels.highschool")}
                  </option>
                  <option value={EgitimSeviyeEnum.OnLisans}>
                    {t("education.levels.associate")}
                  </option>
                  <option value={EgitimSeviyeEnum.Lisans}>
                    {t("education.levels.bachelor")}
                  </option>
                  <option value={EgitimSeviyeEnum.YuksekLisans}>
                    {t("education.levels.master")}
                  </option>
                  <option value={EgitimSeviyeEnum.Doktora}>
                    {t("education.levels.phd")}
                  </option>
                  <option value={EgitimSeviyeEnum.Diger}>
                    {t("education.levels.other")}
                  </option>
                </select>
                {errors.seviye && (
                  <p className="mt-1 text-xs text-red-600">{errors.seviye}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.school")} *
                </label>
                <input
                  type="text"
                  name="okul"
                  maxLength={100}
                  value={formData.okul}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder={t("education.placeholders.school")}
                />
                <div className="flex justify-between mt-1">
                  {errors.okul ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.okul}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${formData.okul.length >= 90 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {formData.okul.length}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.department")} *
                </label>
                <input
                  type="text"
                  name="bolum"
                  maxLength={100}
                  value={formData.bolum}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder={t("education.placeholders.department")}
                />
                <div className="flex justify-between mt-1">
                  {errors.bolum ? (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.bolum}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p
                    className={`text-xs ${formData.bolum.length >= 90 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {formData.bolum.length}/100
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.diplomaStatus")} *
                </label>
                <select
                  name="diplomaDurum"
                  value={formData.diplomaDurum}
                  onChange={handleChange}
                  className={BASE_SELECT}
                >
                  <option value="">{t("education.select.choose")}</option>
                  <option value={DiplomaDurumEnum.Mezun}>
                    {t("education.diploma.graduated")}
                  </option>
                  <option value={DiplomaDurumEnum.Devam}>
                    {t("education.diploma.continuing")}
                  </option>
                  <option value={DiplomaDurumEnum.AraVerdi}>
                    {t("education.diploma.paused")}
                  </option>
                  <option value={DiplomaDurumEnum.Terk}>
                    {t("education.diploma.dropped")}
                  </option>
                </select>
                {errors.diplomaDurum && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.diplomaDurum}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.gradeSystem")} *
                </label>
                <select
                  name="notSistemi"
                  value={formData.notSistemi}
                  onChange={handleChange}
                  className={BASE_SELECT}
                >
                  <option value={NotSistemiEnum.DortlukSistem}>
                    {t("education.gradeSystem.fourShort")}
                  </option>
                  <option value={NotSistemiEnum.YuzlukSistem}>
                    {t("education.gradeSystem.hundredShort")}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("education.form.gpa")}
                </label>
                <input
                  type="number"
                  name="gano"
                  value={formData.gano}
                  onChange={handleChange}
                  className={BASE_FIELD}
                  placeholder={
                    isHundredSystem
                      ? t("education.placeholders.gpaHundred")
                      : t("education.placeholders.gpaFour")
                  }
                />
                {errors.gano && (
                  <p className="mt-1 text-xs text-red-600">{errors.gano}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="shadow-none outline-none">
                <MuiDateStringField
                  label={t("education.form.startDate")}
                  name="baslangic"
                  value={formData.baslangic}
                  onChange={handleChange}
                  required
                  error={errors.baslangic}
                  min="1950-01-01"
                  max={todayStr}
                />
              </div>
              <div className="shadow-none outline-none">
                <MuiDateStringField
                  label={t("education.form.endDate")}
                  name="bitis"
                  value={formData.bitis}
                  onChange={handleChange}
                  required={false}
                  error={errors.bitis}
                  min={formData.baslangic || "1950-01-01"}
                  max={todayStr}
                  disabled={isEndDisabled}
                />
                {isEndDisabled && (
                  <p className="mt-1 text-xs text-gray-500">
                    {t("education.hints.noEndWhenContinuing")}
                  </p>
                )}
              </div>
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
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${isValid ? (mode === "edit" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700") + " active:scale-95 cursor-pointer" : (mode === "edit" ? "bg-green-300" : "bg-blue-300") + " opacity-90 cursor-not-allowed"}`}
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

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import useModalDismiss from "../modalHooks/useModalDismiss";
import { createJobExpSchema } from "../../../schemas/jobExperienceSchema";
import MuiDateStringField from "../Date/MuiDateStringField";
import { lockScroll, unlockScroll } from "../modalHooks/scrollLock";
import {
  toISODate,
  fromISODateString,
  todayISO,
  yesterdayISO,
} from "../modalHooks/dateUtils";
import { useTranslation } from "react-i18next";

/* -------------------- ORTAK SINIFLAR -------------------- */
// Temel stil
const FIELD_BASE_CLASSES =
  "w-full border rounded-lg px-3 py-2 focus:outline-none border-gray-300 hover:border-black focus:border-black transition h-[42px]";

// Aktif Input Stili (Beyaz)
const FIELD_ACTIVE = `${FIELD_BASE_CLASSES} bg-white text-gray-900`;

// Pasif Input Stili (Gri - Disable olduğu belli olsun)
const FIELD_DISABLED = `${FIELD_BASE_CLASSES} bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200`;

const onlyLettersTR = (s) => s.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");

export default function JobExperiencesAddModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSave,
  onUpdate,
  anotherActiveExists = false,
  definitions = {},
}) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  const countryOtherRef = useRef(null);
  const cityOtherRef = useRef(null);

  const schema = useMemo(
    () => createJobExpSchema(t, anotherActiveExists),
    [t, anotherActiveExists],
  );

  const [formData, setFormData] = useState({
    isAdi: "",
    departman: "",
    pozisyon: "",
    gorev: "",
    ucret: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    ayrilisSebebi: "",
    halenCalisiyor: false,

    // Seçim State'leri
    ulkeSelect: "",
    ulkeOther: "",
    sehirSelect: "",
    sehirOther: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [activeCities, setActiveCities] = useState([]);
  const [isCitySelectMode, setIsCitySelectMode] = useState(false);

  const todayStr = useMemo(() => todayISO(), []);
  const yesterdayStr = useMemo(() => yesterdayISO(), []);

  /* --------- SCROLL & INIT --------- */
  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  const handleClose = () => {
    unlockScroll();
    onClose?.();
  };

  // 1. ŞEHİR MODUNU BELİRLEME (DB'de şehir var mı?)
  useEffect(() => {
    // Ülke seçilmediyse veya "Diğer" ise Select modu kapalı
    if (!formData.ulkeSelect || formData.ulkeSelect === "other") {
      setActiveCities([]);
      setIsCitySelectMode(false);
      return;
    }

    // Seçilen ülkenin şehirlerini bul
    // Dikkat: String/Number uyuşmazlığı olmaması için String'e çevirerek karşılaştırıyoruz
    const cities =
      definitions.sehirler?.filter(
        (c) => String(c.ulkeId) === String(formData.ulkeSelect),
      ) || [];

    if (cities.length > 0) {
      setActiveCities(cities);
      setIsCitySelectMode(true);
    } else {
      setActiveCities([]);
      setIsCitySelectMode(false);
    }
  }, [formData.ulkeSelect, definitions.sehirler]);

  // 2. MODAL AÇILIŞ / EDIT MODE
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      let uSelect = "";
      let uOther = "";
      let cSelect = "";
      let cOther = "";

      // Ülke Çözümleme
      if (initialData.ulkeId) {
        uSelect = String(initialData.ulkeId);
      } else if (initialData.ulkeAdi) {
        uSelect = "other";
        uOther = initialData.ulkeAdi;
      }

      // Şehir Çözümleme
      if (initialData.sehirId) {
        cSelect = String(initialData.sehirId);
      } else if (initialData.sehirAdi) {
        // Eğer ülkenin şehirleri varsa ve ID yoksa -> "Diğer" seçeneğidir
        const citiesForCountry =
          definitions.sehirler?.filter((c) => String(c.ulkeId) === uSelect) ||
          [];
        if (citiesForCountry.length > 0) {
          cSelect = "other";
        } else {
          cSelect = ""; // Şehir listesi yoksa select boştur
        }
        cOther = initialData.sehirAdi;
      }

      setFormData({
        isAdi: initialData.isAdi ?? "",
        departman: initialData.departman ?? "",
        pozisyon: initialData.pozisyon ?? "",
        gorev: initialData.gorev ?? "",
        ucret: initialData.ucret ? String(initialData.ucret) : "",
        baslangicTarihi: initialData.baslangicTarihi
          ? toISODate(fromISODateString(initialData.baslangicTarihi))
          : "",
        bitisTarihi: initialData.bitisTarihi
          ? toISODate(fromISODateString(initialData.bitisTarihi))
          : "",
        ayrilisSebebi: initialData.ayrilisSebebi ?? "",
        halenCalisiyor:
          initialData.halenCalisiyor === true || !initialData.bitisTarihi,

        ulkeSelect: uSelect,
        ulkeOther: uOther,
        sehirSelect: cSelect,
        sehirOther: cOther,
      });
    } else {
      setFormData({
        isAdi: "",
        departman: "",
        pozisyon: "",
        gorev: "",
        ucret: "",
        baslangicTarihi: "",
        bitisTarihi: "",
        ayrilisSebebi: "",
        halenCalisiyor: false,
        ulkeSelect: "",
        ulkeOther: "",
        sehirSelect: "",
        sehirOther: "",
      });
    }
    setErrors({});
    setTouched({});
  }, [open, mode, initialData, definitions.sehirler]);

  const onBackdropClick = useModalDismiss(open, handleClose, dialogRef);

  /* --------- HELPER: Form Verisini Şemaya Uygun Hale Getir --------- */
  const buildCandidate = (data = formData) => {
    // 1. Ülke Değerini Bul
    let finalUlke = "";
    if (data.ulkeSelect === "other") {
      finalUlke = data.ulkeOther.trim();
    } else if (data.ulkeSelect) {
      // ID seçildiyse validasyonun geçmesi için dolu bir string atıyoruz
      // (UI'da gösterim için ismi bulabiliriz ama validation için "1" bile yeterli)
      finalUlke =
        definitions.ulkeler?.find((u) => String(u.id) === data.ulkeSelect)
          ?.ulkeAdi || "Selected";
    }

    // 2. Şehir Değerini Bul
    let finalSehir = "";

    // Şehir modu (Select mi Input mu?)
    // Bu kontrolü useEffect'teki mantıkla senkron tutuyoruz
    const currentCities =
      definitions.sehirler?.filter(
        (c) => String(c.ulkeId) === String(data.ulkeSelect),
      ) || [];
    const isSelectMode = currentCities.length > 0;

    if (isSelectMode) {
      // Select Modu
      if (data.sehirSelect === "other") {
        finalSehir = data.sehirOther.trim();
      } else if (data.sehirSelect) {
        finalSehir =
          definitions.sehirler?.find((c) => String(c.id) === data.sehirSelect)
            ?.sehirAdi || "Selected";
      }
    } else {
      // Input Modu (Şehir yok veya Ülke 'Diğer')
      finalSehir = data.sehirOther.trim();
    }

    return {
      ...data,
      isUlke: finalUlke,
      isSehir: finalSehir,
    };
  };

  /* --------- HANDLERS --------- */
  const validateField = (name, nextData) => {
    const candidate = buildCandidate(nextData);
    const result = schema.safeParse(candidate);

    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);

      // isUlke veya isSehir hatası gelirse, ilgili UI elemanına yansıt
      if (name === "ulkeSelect" || name === "ulkeOther") {
        const err = result.error.issues.find((i) => i.path[0] === "isUlke");
        setErrors((prev) => ({ ...prev, [name]: err ? err.message : "" }));
        return;
      }
      if (name === "sehirSelect" || name === "sehirOther") {
        const err = result.error.issues.find((i) => i.path[0] === "isSehir");
        setErrors((prev) => ({ ...prev, [name]: err ? err.message : "" }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: issue ? issue.message : "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      // Bağlantılı hataları temizle
      if (name === "ulkeSelect") setErrors((p) => ({ ...p, ulkeOther: "" }));
      if (name === "sehirSelect") setErrors((p) => ({ ...p, sehirOther: "" }));
    }
  };

  const normalizeSalaryInput = (raw) =>
    raw
      .replace(/[^\d.,]/g, "")
      .replace(/,+/g, (m) => (m.length > 1 ? "," : ","));

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = { ...formData, [name]: value };

    // Ülke değişince
    if (name === "ulkeSelect") {
      next.sehirSelect = "";
      next.sehirOther = "";

      if (value === "other") {
        setTimeout(() => countryOtherRef.current?.focus(), 50);
      } else {
        next.ulkeOther = "";
      }
    }

    // Şehir Select değişince
    if (name === "sehirSelect") {
      if (value === "other") {
        setTimeout(() => cityOtherRef.current?.focus(), 50);
      } else {
        next.sehirOther = "";
      }
    }

    if (name === "ulkeOther" || name === "sehirOther") {
      next[name] = onlyLettersTR(value);
    }

    if (name === "ucret") {
      next[name] = normalizeSalaryInput(value);
    }

    setFormData(next);
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, next);
  };

  const onDateChange = (name, value) => {
    const next = { ...formData, [name]: value || "" };
    setFormData(next);
    validateField(name, next);
  };

  const onDateBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData);
  };

  const toggleHalenCalisiyor = (checked) => {
    const next = {
      ...formData,
      halenCalisiyor: checked,
      bitisTarihi: checked ? "" : formData.bitisTarihi,
    };
    setFormData(next);
    if (!touched.halenCalisiyor)
      setTouched((p) => ({ ...p, halenCalisiyor: true }));
    validateField("halenCalisiyor", next);

    if (checked) {
      setErrors((p) => ({ ...p, bitisTarihi: "", ayrilisSebebi: "" }));
    }
  };

  const isValid = useMemo(() => {
    const candidate = buildCandidate(formData);
    return schema.safeParse(candidate).success;
  }, [formData, schema, definitions]);

  const disabledTip = !isValid ? t("common.fillAllProperly") : "";

  /* --------- SUBMIT --------- */
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const allKeys = Object.keys(formData);
    setTouched(allKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    const candidate = buildCandidate(formData);
    const parsed = schema.safeParse(candidate);

    if (!parsed.success) {
      const newErrs = {};
      parsed.error.issues.forEach((i) => {
        newErrs[i.path[0]] = i.message;
      });
      setErrors(newErrs);
      return;
    }

    const d = parsed.data;

    // Payload Hazırlığı
    let finalUlkeId = null;
    let finalUlkeAdi = null;
    let finalSehirId = null;
    let finalSehirAdi = null;

    // Ülke
    if (formData.ulkeSelect === "other") {
      finalUlkeAdi = formData.ulkeOther.trim();
    } else {
      finalUlkeId = Number(formData.ulkeSelect);
      finalUlkeAdi = definitions.ulkeler?.find(
        (u) => String(u.id) === formData.ulkeSelect,
      )?.ulkeAdi;
    }

    // Şehir
    if (isCitySelectMode) {
      if (formData.sehirSelect === "other") {
        finalSehirAdi = formData.sehirOther.trim();
      } else {
        finalSehirId = Number(formData.sehirSelect);
        finalSehirAdi = definitions.sehirler?.find(
          (c) => String(c.id) === formData.sehirSelect,
        )?.sehirAdi;
      }
    } else {
      // Input modu
      finalSehirAdi = formData.sehirOther ? formData.sehirOther.trim() : null;
    }

    const payload = {
      isAdi: d.isAdi,
      departman: d.departman,
      pozisyon: d.pozisyon,
      gorev: d.gorev,
      ucret: Number(d.ucret.replace(",", ".")),
      baslangicTarihi: d.baslangicTarihi,
      bitisTarihi: d.halenCalisiyor ? null : d.bitisTarihi,
      ayrilisSebebi: d.ayrilisSebebi,
      halenCalisiyor: d.halenCalisiyor,
      ulkeId: finalUlkeId,
      ulkeAdi: finalUlkeAdi,
      sehirId: finalSehirId,
      sehirAdi: finalSehirAdi,
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
        <div className="flex items-center justify-between bg-linear-to-r from-gray-700 via-gray-600 to-gray-500 text-white px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            {mode === "edit" ? t("jobExp.title.edit") : t("jobExp.title.add")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/15 active:bg-white/25 focus:outline-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 1. Şirket / Departman */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.company")} *
                </label>
                <input
                  type="text"
                  name="isAdi"
                  value={formData.isAdi}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                  placeholder={t("jobExp.placeholders.company")}
                  maxLength={100}
                />
                {touched.isAdi && errors.isAdi && (
                  <p className="text-xs text-red-600 mt-1">{errors.isAdi}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.department")} *
                </label>
                <input
                  type="text"
                  name="departman"
                  value={formData.departman}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                  placeholder={t("jobExp.placeholders.department")}
                  maxLength={100}
                />
                {touched.departman && errors.departman && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.departman}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Pozisyon / Görev */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.position")} *
                </label>
                <input
                  type="text"
                  name="pozisyon"
                  value={formData.pozisyon}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                  placeholder={t("jobExp.placeholders.position")}
                  maxLength={100}
                />
                {touched.pozisyon && errors.pozisyon && (
                  <p className="text-xs text-red-600 mt-1">{errors.pozisyon}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.duty")} *
                </label>
                <input
                  type="text"
                  name="gorev"
                  value={formData.gorev}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                  placeholder={t("jobExp.placeholders.duty")}
                  maxLength={120}
                />
                {touched.gorev && errors.gorev && (
                  <p className="text-xs text-red-600 mt-1">{errors.gorev}</p>
                )}
              </div>
            </div>

            {/* 3. Ücret / Ülke / Diğer Ülke */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ücret */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.salary")} *
                </label>
                <input
                  type="text"
                  name="ucret"
                  value={formData.ucret}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                  placeholder={t("jobExp.placeholders.salary")}
                />
                {touched.ucret && errors.ucret && (
                  <p className="text-xs text-red-600 mt-1">{errors.ucret}</p>
                )}
              </div>

              {/* Ülke Select */}
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">
                  {t("jobExp.labels.country")} *
                </label>
                <select
                  name="ulkeSelect"
                  value={formData.ulkeSelect}
                  onChange={handleChange}
                  className={FIELD_ACTIVE}
                >
                  <option value="">{t("common.pleaseSelect")}</option>
                  {definitions.ulkeler?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.ulkeAdi}
                    </option>
                  ))}
                  <option value="other">{t("common.other")}</option>
                </select>
                {touched.ulkeSelect && errors.ulkeSelect && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.ulkeSelect}
                  </p>
                )}
              </div>

              {/* Diğer Ülke Inputu (Yan yana) */}
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">
                  {formData.ulkeSelect === "other" ? (
                    t("jobExp.placeholders.countryOther")
                  ) : (
                    <>&nbsp;</>
                  )}
                </label>
                <input
                  ref={countryOtherRef}
                  type="text"
                  name="ulkeOther"
                  value={formData.ulkeOther}
                  onChange={handleChange}
                  disabled={formData.ulkeSelect !== "other"}
                  className={
                    formData.ulkeSelect !== "other"
                      ? FIELD_DISABLED
                      : FIELD_ACTIVE
                  }
                  placeholder={t("jobExp.placeholders.countryOther")}
                  maxLength={50}
                />
                {touched.ulkeOther && errors.ulkeOther && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.ulkeOther}
                  </p>
                )}
              </div>
            </div>

            {/* 3.5. Şehir Seçimi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Şehir Seçim / Input Mantığı */}
              {isCitySelectMode ? (
                // Eğer Şehir Listesi Varsa: Select Göster, Yanına "Diğer" seçilince aktif olan Input koy
                <>
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      {t("jobExp.labels.city")} *
                    </label>
                    <select
                      name="sehirSelect"
                      value={formData.sehirSelect}
                      onChange={handleChange}
                      className={FIELD_ACTIVE}
                    >
                      <option value="">{t("common.pleaseSelect")}</option>
                      {activeCities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.sehirAdi}
                        </option>
                      ))}
                      <option value="other">{t("common.other")}</option>
                    </select>
                    {touched.sehirSelect && errors.sehirSelect && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.sehirSelect}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      {formData.sehirSelect === "other" ? (
                        t("jobExp.placeholders.cityOther")
                      ) : (
                        <>&nbsp;</>
                      )}
                    </label>
                    <input
                      ref={cityOtherRef}
                      type="text"
                      name="sehirOther"
                      value={formData.sehirOther}
                      onChange={handleChange}
                      disabled={formData.sehirSelect !== "other"}
                      className={
                        formData.sehirSelect !== "other"
                          ? FIELD_DISABLED
                          : FIELD_ACTIVE
                      }
                      placeholder={t("jobExp.placeholders.cityOther")}
                      maxLength={50}
                    />
                    {touched.sehirOther && errors.sehirOther && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.sehirOther}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // Eğer Şehir Listesi Yoksa: Sadece Input Göster (Select'in kapladığı alan yok)
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    {t("jobExp.labels.city")} *
                  </label>
                  <input
                    type="text"
                    name="sehirOther"
                    value={formData.sehirOther}
                    onChange={handleChange}
                    disabled={!formData.ulkeSelect} // Ülke seçilmemişse pasif
                    className={
                      !formData.ulkeSelect ? FIELD_DISABLED : FIELD_ACTIVE
                    }
                    placeholder={t("jobExp.placeholders.cityOther")}
                    maxLength={50}
                  />
                  {touched.sehirOther && errors.sehirOther && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.sehirOther}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Tarihler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="shadow-none">
                <MuiDateStringField
                  label={t("jobExp.labels.startDate")}
                  name="baslangicTarihi"
                  value={formData.baslangicTarihi}
                  onChange={(e) =>
                    onDateChange("baslangicTarihi", e.target.value)
                  }
                  onBlur={() => onDateBlur("baslangicTarihi")}
                  required
                  min="1950-01-01"
                  max={yesterdayStr}
                  size="small"
                  error={touched.baslangicTarihi ? errors.baslangicTarihi : ""}
                />
              </div>
              <div className="shadow-none">
                <MuiDateStringField
                  label={`${t("jobExp.labels.endDate")} ${formData.halenCalisiyor ? `(${t("jobExp.badges.ongoing")})` : "*"}`}
                  name="bitisTarihi"
                  value={formData.bitisTarihi}
                  onChange={(e) => onDateChange("bitisTarihi", e.target.value)}
                  onBlur={() => onDateBlur("bitisTarihi")}
                  disabled={formData.halenCalisiyor}
                  min={formData.baslangicTarihi || "1950-01-01"}
                  max={todayStr}
                  size="small"
                  error={touched.bitisTarihi ? errors.bitisTarihi : ""}
                />
              </div>
            </div>

            {/* Halen Çalışıyorum */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="halenCalisiyorum"
                checked={formData.halenCalisiyor}
                onChange={(e) => toggleHalenCalisiyor(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor="halenCalisiyorum"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                {t("jobExp.labels.ongoing")}
              </label>
              {touched.halenCalisiyor && errors.halenCalisiyor && (
                <span className="text-xs text-red-600 font-medium ml-2">
                  {errors.halenCalisiyor}
                </span>
              )}
            </div>

            {/* Ayrılış Sebebi */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("jobExp.labels.leaveReason")}{" "}
                {formData.halenCalisiyor ? "" : "*"}
              </label>
              <input
                type="text"
                name="ayrilisSebebi"
                value={formData.ayrilisSebebi}
                onChange={handleChange}
                onBlur={(e) => validateField(e.target.name, formData)}
                className={FIELD_ACTIVE}
                placeholder={t("jobExp.placeholders.leaveReason")}
                maxLength={150}
              />
              {touched.ayrilisSebebi && errors.ayrilisSebebi && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.ayrilisSebebi}
                </p>
              )}
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

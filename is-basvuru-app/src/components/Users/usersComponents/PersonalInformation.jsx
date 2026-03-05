import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import MuiDateStringField from "../Date/MuiDateStringField";
import SearchSelect from "../Selected/SearchSelect";

// Merkezi formUtils
import { toNumberOrNull, toStr } from "../modalHooks/formUtils";

// ---------------- AYARLAR (PRODUCTION READY) ----------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_UPLOAD_PATH = "/uploads/personel-fotograflari";
// -------------------------------------------------------------

const OTHER_VALUE = "__OTHER__";

const onlyLettersTR = (s) =>
  (s ?? "").toString().replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");

export default function PersonalInformation({ definitions }) {
  const { t } = useTranslation();

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  // --- DTO Watch ---
  const dogumUlkeId = useWatch({ name: "personal.DogumUlkeId" });
  const dogumUlkeAdi = useWatch({ name: "personal.DogumUlkeAdi" });
  const dogumSehirId = useWatch({ name: "personal.DogumSehirId" });
  const dogumSehirAdi = useWatch({ name: "personal.DogumSehirAdi" });
  const dogumIlceAdi = useWatch({ name: "personal.DogumIlceAdi" });

  const ikametUlkeId = useWatch({ name: "personal.IkametgahUlkeId" });
  const ikametUlkeAdi = useWatch({ name: "personal.IkametgahUlkeAdi" });
  const ikametSehirId = useWatch({ name: "personal.IkametgahSehirId" });
  const ikametSehirAdi = useWatch({ name: "personal.IkametgahSehirAdi" });
  const ikametIlceAdi = useWatch({ name: "personal.IkametgahIlceAdi" });

  const uyrukId = useWatch({ name: "personal.UyrukId" });
  const uyrukAdi = useWatch({ name: "personal.UyrukAdi" });

  // 1. Backend'den gelen URL
  const foto = useWatch({ name: "personal.foto" });
  // 2. Yeni seçilen dosya (File objesi)
  const yeniSecilenDosya = useWatch({ name: "personal.VesikalikDosyasi" });

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  // --- Definitions ---
  const ulkeler = useMemo(
    () => definitions?.ulkeler ?? [],
    [definitions?.ulkeler],
  );
  const sehirler = useMemo(
    () => definitions?.sehirler ?? [],
    [definitions?.sehirler],
  );
  const ilceler = useMemo(
    () => definitions?.ilceler ?? [],
    [definitions?.ilceler],
  );
  const uyruklar = useMemo(
    () => definitions?.uyruklar ?? [],
    [definitions?.uyruklar],
  );

  const ulkeOptionList = useMemo(() => {
    const list = (ulkeler || [])
      .map((u) => ({ value: toStr(u?.id), label: u?.ulkeAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return list.concat([{ value: OTHER_VALUE, label: t("common.other") }]);
  }, [ulkeler, t]);

  const uyrukOptionList = useMemo(() => {
    const list = (uyruklar || [])
      .map((u) => ({ value: toStr(u?.id), label: u?.uyrukAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return list.concat([{ value: OTHER_VALUE, label: t("common.other") }]);
  }, [uyruklar, t]);

  // --- Şehir Options ---
  const sehirOptionsDogum = useMemo(() => {
    const base = [{ value: "", label: t("personal.placeholders.select") }];
    if (!dogumUlkeId) return base;
    const list = (sehirler || [])
      .filter((s) => toStr(s?.ulkeId) === toStr(dogumUlkeId))
      .map((s) => ({ value: toStr(s?.id), label: s?.sehirAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return base.concat(list);
  }, [t, sehirler, dogumUlkeId]);

  const sehirOptionsIkamet = useMemo(() => {
    const base = [{ value: "", label: t("personal.placeholders.select") }];
    if (!ikametUlkeId) return base;
    const list = (sehirler || [])
      .filter((s) => toStr(s?.ulkeId) === toStr(ikametUlkeId))
      .map((s) => ({ value: toStr(s?.id), label: s?.sehirAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return base.concat(list);
  }, [t, sehirler, ikametUlkeId]);

  // --- İlçe Options ---
  const ilceOptionsDogum = useMemo(() => {
    const base = [{ value: "", label: t("personal.placeholders.select") }];
    if (!dogumSehirId) return base;
    const list = (ilceler || [])
      .filter((i) => toStr(i?.sehirId) === toStr(dogumSehirId))
      .map((i) => ({ value: toStr(i?.id), label: i?.ilceAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return base.concat(list);
  }, [t, ilceler, dogumSehirId]);

  const ilceOptionsIkamet = useMemo(() => {
    const base = [{ value: "", label: t("personal.placeholders.select") }];
    if (!ikametSehirId) return base;
    const list = (ilceler || [])
      .filter((i) => toStr(i?.sehirId) === toStr(ikametSehirId))
      .map((i) => ({ value: toStr(i?.id), label: i?.ilceAdi ?? "" }))
      .filter((x) => x.value !== "" && x.label);
    return base.concat(list);
  }, [t, ilceler, ikametSehirId]);

  const dogumSehirHasDb = dogumUlkeId != null && sehirOptionsDogum.length > 1;
  const dogumIlceHasDb = dogumSehirId != null && ilceOptionsDogum.length > 1;
  const ikametSehirHasDb =
    ikametUlkeId != null && sehirOptionsIkamet.length > 1;
  const ikametIlceHasDb = ikametSehirId != null && ilceOptionsIkamet.length > 1;

  // --- Static Options ---
  const genderOptions = useMemo(
    () => [
      { value: 1, label: t("personal.options.gender.female") },
      { value: 2, label: t("personal.options.gender.male") },
    ],
    [t],
  );
  const maritalOptions = useMemo(
    () => [
      { value: 1, label: t("personal.options.marital.single") },
      { value: 2, label: t("personal.options.marital.married") },
      { value: 3, label: t("personal.options.marital.divorced") },
      { value: 4, label: t("personal.options.marital.widowed") },
    ],
    [t],
  );
  const childOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i <= 6; i++)
      list.push({ value: String(i), label: String(i) });
    list.push({ value: "7+", label: t("personal.options.childrenMore") });
    return list;
  }, [t]);

  // --- Handlers ---
  const handleFotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isValidType =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type.startsWith("image/");
    const isValidSize = file.size <= 2 * 1024 * 1024;
    if (!isValidType || !isValidSize) {
      e.target.value = "";
      alert(t("personal.errors.photo.invalid"));
      return;
    }

    // React Hook Form state'ini güncelle
    setValue("personal.VesikalikDosyasi", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    // Base64 önizleme (Fallback)
    const reader = new FileReader();
    reader.onloadend = () => {
      // Sadece görsel amaçlı eski 'foto' alanını da güncelleyebiliriz ama
      // asıl önizleme 'displayFoto' üzerinden yürüyecek.
      // setValue("personal.foto", reader.result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);

    // Inputu temizle ki aynı dosyayı tekrar seçebilsin
    e.target.value = "";
  };

  // --- 📷 GÜNCEL RESİM GÖSTERİM MANTIĞI ---
  const [displayFoto, setDisplayFoto] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    if (yeniSecilenDosya instanceof File) {
      // 1. Kullanıcı yeni dosya seçtiyse -> KESİN ÖNCELİK BUNUN
      objectUrl = URL.createObjectURL(yeniSecilenDosya);
      setDisplayFoto(objectUrl);
    } else if (foto && typeof foto === "string") {
      // 2. Yeni dosya yoksa ama backend URL'i varsa
      if (foto.startsWith("data:image") || foto.startsWith("http")) {
        setDisplayFoto(foto);
      } else if (foto.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        // Dosya adı ise tam URL yap
        setDisplayFoto(`${API_BASE_URL}${IMAGE_UPLOAD_PATH}/${foto}`);
      } else {
        // Base64 ham veri ise
        setDisplayFoto(`data:image/jpeg;base64,${foto}`);
      }
    } else {
      // 3. Hiçbiri yoksa
      setDisplayFoto(null);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [yeniSecilenDosya, foto]);

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8 shadow-none overscroll-contain">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* --- FOTOĞRAF KISMI --- */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-300 bg-gray-100 shadow-md flex items-center justify-center">
            {/* 🔥🔥🔥 KEY ÖZELLİĞİ EKLENDİ 🔥🔥🔥 */}
            {displayFoto ? (
              <img
                key={displayFoto} // Resim kaynağı değişince DOM elementini yenile
                src={displayFoto}
                alt="Profil"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none"; // Resmi gizle
                  setDisplayFoto(null); // State'i boşa çek ki ikon görünsün
                }}
              />
            ) : null}

            {/* Resim yoksa veya yüklenemediyse Yazı Göster */}
            {!displayFoto && (
              <span className="text-gray-400 text-sm text-center px-2">
                {t("personal.placeholders.noPhoto")}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="foto"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              {t("personal.labels.photo")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="foto"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
              >
                📤{" "}
                {foto || yeniSecilenDosya
                  ? t("personal.placeholders.replace")
                  : t("personal.placeholders.upload")}
              </label>
              <input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handleFotoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* --- DİĞER INPUTLAR --- */}
        <InputField
          name="personal.ad"
          label={t("personal.labels.firstName")}
          placeholder={t("personal.placeholders.firstName")}
          max={30}
          register={register}
          error={errors.personal?.ad}
        />
        <InputField
          name="personal.soyad"
          label={t("personal.labels.lastName")}
          placeholder={t("personal.placeholders.lastName")}
          max={30}
          register={register}
          error={errors.personal?.soyad}
        />
        <InputField
          name="personal.eposta"
          label={t("personal.labels.email")}
          placeholder={t("personal.placeholders.email")}
          register={register}
          error={errors.personal?.eposta}
        />
        <InputField
          name="personal.telefon"
          label={t("personal.labels.phone")}
          placeholder={t("personal.placeholders.phone")}
          register={register}
          error={errors.personal?.telefon}
        />
        <InputField
          name="personal.whatsapp"
          label={t("personal.labels.whatsapp")}
          placeholder={t("personal.placeholders.whatsapp")}
          register={register}
          error={errors.personal?.whatsapp}
        />
        <InputField
          name="personal.adres"
          label={t("personal.labels.address")}
          placeholder={t("personal.placeholders.address")}
          max={90}
          register={register}
          error={errors.personal?.adres}
        />

        <div className="shadow-none outline-none">
          <Controller
            name="personal.dogumTarihi"
            control={control}
            render={({ field }) => (
              <MuiDateStringField
                label={t("personal.labels.birthDate")}
                value={field.value}
                onChange={field.onChange}
                required
                error={errors.personal?.dogumTarihi?.message}
                min="1950-01-01"
                max="2025-12-31"
                size="small"
              />
            )}
          />
        </div>

        <SelectController
          name="personal.cinsiyet"
          label={t("personal.labels.gender")}
          options={genderOptions}
          control={control}
          placeholder={t("personal.placeholders.select")}
          error={errors.personal?.cinsiyet}
        />
        <SelectController
          name="personal.medeniDurum"
          label={t("personal.labels.marital")}
          options={maritalOptions}
          control={control}
          placeholder={t("personal.placeholders.select")}
          error={errors.personal?.medeniDurum}
        />
        <SelectController
          name="personal.cocukSayisi"
          label={t("personal.labels.children")}
          options={childOptions}
          control={control}
          placeholder={t("personal.placeholders.select")}
          error={errors.personal?.cocukSayisi}
        />

        {/* UYRUK ve ADRESLER */}
        <TwoColSelectWithOther
          containerClassName="lg:col-span-1 mt-1"
          label={t("personal.labels.nationality")}
          required
          selectName="personal.UyrukId"
          textName="personal.UyrukAdi"
          selectValue={uyrukId}
          textValue={uyrukAdi}
          options={uyrukOptionList}
          selectPlaceholder={t("personal.placeholders.select")}
          textPlaceholder={t("personal.placeholders.countryOther")}
          control={control}
          setValue={setValue}
          errors={errors}
          menuPortalTarget={portalTarget}
        />
        <TwoColSelectWithOther
          label={t("personal.labels.birthCountry")}
          required
          selectName="personal.DogumUlkeId"
          textName="personal.DogumUlkeAdi"
          selectValue={dogumUlkeId}
          textValue={dogumUlkeAdi}
          options={ulkeOptionList}
          selectPlaceholder={t("personal.placeholders.countrySearch")}
          textPlaceholder={t("personal.placeholders.countryOther")}
          control={control}
          setValue={setValue}
          errors={errors}
          onSelected={() => {
            setValue("personal.DogumSehirId", null);
            setValue("personal.DogumSehirAdi", "");
            setValue("personal.DogumIlceId", null);
            setValue("personal.DogumIlceAdi", "");
          }}
          menuPortalTarget={portalTarget}
        />

        {/* DOĞUM ŞEHİR/İLÇE */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.birthCity")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dogumSehirHasDb ? (
              <Controller
                name="personal.DogumSehirId"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    name={field.name}
                    value={field.value != null ? toStr(field.value) : ""}
                    onChange={(opt) => {
                      const val = opt?.value;
                      if (!val) {
                        field.onChange(null);
                        setValue("personal.DogumSehirAdi", "");
                        setValue("personal.DogumIlceId", null);
                        setValue("personal.DogumIlceAdi", "");
                        return;
                      }
                      field.onChange(toNumberOrNull(val));
                      setValue("personal.DogumSehirAdi", opt?.label ?? "");
                      setValue("personal.DogumIlceId", null);
                      setValue("personal.DogumIlceAdi", "");
                    }}
                    options={sehirOptionsDogum}
                    placeholder={t("personal.placeholders.select")}
                    isDisabled={!dogumUlkeId}
                    menuPortalTarget={portalTarget}
                  />
                )}
              />
            ) : (
              <input
                type="text"
                placeholder={t("personal.placeholders.cityState")}
                className="block w-full h-10.75 rounded-lg border px-3 py-2 focus:outline-none bg-white border-gray-300"
                value={dogumSehirAdi || ""}
                onChange={(e) => {
                  setValue("personal.DogumSehirId", null);
                  setValue(
                    "personal.DogumSehirAdi",
                    onlyLettersTR(e.target.value),
                  );
                  setValue("personal.DogumIlceId", null);
                  setValue("personal.DogumIlceAdi", "");
                }}
              />
            )}
            {dogumIlceHasDb ? (
              <Controller
                name="personal.DogumIlceId"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    name={field.name}
                    value={field.value != null ? toStr(field.value) : ""}
                    onChange={(opt) => {
                      const val = opt?.value;
                      if (!val) {
                        field.onChange(null);
                        setValue("personal.DogumIlceAdi", "");
                        return;
                      }
                      field.onChange(toNumberOrNull(val));
                      setValue("personal.DogumIlceAdi", opt?.label ?? "");
                    }}
                    options={ilceOptionsDogum}
                    placeholder={t("personal.placeholders.select")}
                    isDisabled={!dogumSehirId}
                    menuPortalTarget={portalTarget}
                  />
                )}
              />
            ) : (
              <input
                type="text"
                placeholder={t("personal.placeholders.districtRegion")}
                className="block w-full h-10.75 rounded-lg border px-3 py-2 focus:outline-none bg-white border-gray-300"
                value={dogumIlceAdi || ""}
                onChange={(e) => {
                  setValue("personal.DogumIlceId", null);
                  setValue(
                    "personal.DogumIlceAdi",
                    onlyLettersTR(e.target.value),
                  );
                }}
              />
            )}
          </div>
          {(errors.personal?.DogumSehirId ||
            errors.personal?.DogumSehirAdi ||
            errors.personal?.DogumIlceId ||
            errors.personal?.DogumIlceAdi) && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.personal?.DogumSehirId?.message ||
                errors.personal?.DogumSehirAdi?.message ||
                errors.personal?.DogumIlceId?.message ||
                errors.personal?.DogumIlceAdi?.message}
            </p>
          )}
        </div>

        {/* İKAMET ÜLKE */}
        <TwoColSelectWithOther
          label={t("personal.labels.resCountry")}
          required
          selectName="personal.IkametgahUlkeId"
          textName="personal.IkametgahUlkeAdi"
          selectValue={ikametUlkeId}
          textValue={ikametUlkeAdi}
          options={ulkeOptionList}
          selectPlaceholder={t("personal.placeholders.countrySearch")}
          textPlaceholder={t("personal.placeholders.countryOther")}
          control={control}
          setValue={setValue}
          errors={errors}
          onSelected={() => {
            setValue("personal.IkametgahSehirId", null);
            setValue("personal.IkametgahSehirAdi", "");
            setValue("personal.IkametgahIlceId", null);
            setValue("personal.IkametgahIlceAdi", "");
          }}
          menuPortalTarget={portalTarget}
        />

        {/* İKAMET ŞEHİR/İLÇE */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("personal.labels.resCity")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ikametSehirHasDb ? (
              <Controller
                name="personal.IkametgahSehirId"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    name={field.name}
                    value={field.value != null ? toStr(field.value) : ""}
                    onChange={(opt) => {
                      const val = opt?.value;
                      if (!val) {
                        field.onChange(null);
                        setValue("personal.IkametgahSehirAdi", "");
                        setValue("personal.IkametgahIlceId", null);
                        setValue("personal.IkametgahIlceAdi", "");
                        return;
                      }
                      field.onChange(toNumberOrNull(val));
                      setValue("personal.IkametgahSehirAdi", opt?.label ?? "");
                      setValue("personal.IkametgahIlceId", null);
                      setValue("personal.IkametgahIlceAdi", "");
                    }}
                    options={sehirOptionsIkamet}
                    placeholder={t("personal.placeholders.select")}
                    isDisabled={!ikametUlkeId}
                    menuPortalTarget={portalTarget}
                  />
                )}
              />
            ) : (
              <input
                type="text"
                placeholder={t("personal.placeholders.cityState")}
                className="block w-full h-10.75 rounded-lg border px-3 py-2 focus:outline-none bg-white border-gray-300"
                value={ikametSehirAdi || ""}
                onChange={(e) => {
                  setValue("personal.IkametgahSehirId", null);
                  setValue(
                    "personal.IkametgahSehirAdi",
                    onlyLettersTR(e.target.value),
                  );
                  setValue("personal.IkametgahIlceId", null);
                  setValue("personal.IkametgahIlceAdi", "");
                }}
              />
            )}
            {ikametIlceHasDb ? (
              <Controller
                name="personal.IkametgahIlceId"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    name={field.name}
                    value={field.value != null ? toStr(field.value) : ""}
                    onChange={(opt) => {
                      const val = opt?.value;
                      if (!val) {
                        field.onChange(null);
                        setValue("personal.IkametgahIlceAdi", "");
                        return;
                      }
                      field.onChange(toNumberOrNull(val));
                      setValue("personal.IkametgahIlceAdi", opt?.label ?? "");
                    }}
                    options={ilceOptionsIkamet}
                    placeholder={t("personal.placeholders.select")}
                    isDisabled={!ikametSehirId}
                    menuPortalTarget={portalTarget}
                  />
                )}
              />
            ) : (
              <input
                type="text"
                placeholder={t("personal.placeholders.districtRegion")}
                className="block w-full h-10.75 rounded-lg border px-3 py-2 focus:outline-none bg-white border-gray-300"
                value={ikametIlceAdi || ""}
                onChange={(e) => {
                  setValue("personal.IkametgahIlceId", null);
                  setValue(
                    "personal.IkametgahIlceAdi",
                    onlyLettersTR(e.target.value),
                  );
                }}
              />
            )}
          </div>
          {(errors.personal?.IkametgahSehirId ||
            errors.personal?.IkametgahSehirAdi ||
            errors.personal?.IkametgahIlceId ||
            errors.personal?.IkametgahIlceAdi) && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {errors.personal?.IkametgahSehirId?.message ||
                errors.personal?.IkametgahSehirAdi?.message ||
                errors.personal?.IkametgahIlceId?.message ||
                errors.personal?.IkametgahIlceAdi?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function InputField({
  label,
  name,
  placeholder,
  type = "text",
  register,
  error,
  max,
}) {
  return (
    <div className="mt-0.5">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        maxLength={max}
        {...register(name)}
        className="block w-full h-10.75 rounded-lg border mt-0.5 px-3 py-2 bg-white text-gray-900 focus:outline-none transition border-gray-300 hover:border-black"
      />
      <div className="mt-1 flex justify-between min-h-4">
        {error && (
          <p className="text-xs text-red-600 font-medium">{error.message}</p>
        )}
        {max && <p className="text-xs text-gray-400">Max: {max}</p>}
      </div>
    </div>
  );
}

function SelectController({
  name,
  label,
  options,
  control,
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SearchSelect
            name={name}
            value={field.value ?? ""}
            options={options}
            onChange={(opt) => field.onChange(opt?.value ?? "")}
            placeholder={placeholder}
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
          />
        )}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">{error.message}</p>
      )}
    </div>
  );
}

function TwoColSelectWithOther({
  containerClassName = "lg:col-span-2",
  label,
  required,
  selectName,
  textName,
  selectValue,
  textValue,
  options,
  selectPlaceholder,
  textPlaceholder,
  control,
  setValue,
  errors,
  onSelected,
  menuPortalTarget,
}) {
  const [isOtherMode, setIsOtherMode] = useState(false);
  const prevTextValue = useRef(textValue);

  useEffect(() => {
    if (selectValue != null) {
      // 1. Veritabanından (veya seçimden) normal bir ID geldiyse modu kapat
      setIsOtherMode(false);
    } else if (textValue && textValue.trim() !== "") {
      // 2. ID boş ama metin doluysa (Profil Getir ile geldiyse) modu aç
      setIsOtherMode(true);
    } else if (selectValue == null && (!textValue || textValue.trim() === "")) {
      // 3. İkisi de boşaldıysa...
      // Eğer daha önce içi doluysa ve şimdi boşaldıysa bu bir "Form Reset" işlemidir, modu kapat.
      if (prevTextValue.current && prevTextValue.current.trim() !== "") {
        setIsOtherMode(false);
      }
      // Not: Eğer kullanıcı dropdown'dan az önce "Diğer" seçtiği için ikisi boşaldıysa,
      // isOtherMode'a dokunmuyoruz ki açık kalmaya devam etsin (Aşağıdaki onChange ilgileniyor).
    }

    // Referansı güncelle
    prevTextValue.current = textValue;
  }, [selectValue, textValue]);
  // ----------------------------------------

  const displayValue = useMemo(() => {
    if (selectValue != null) return String(selectValue);
    if (isOtherMode) return OTHER_VALUE;
    return "";
  }, [selectValue, isOtherMode]);

  const inputDisabled = !isOtherMode;

  return (
    <div className={containerClassName}>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Controller
          name={selectName}
          control={control}
          render={({ field }) => (
            <SearchSelect
              name={field.name}
              value={displayValue}
              onChange={(opt) => {
                const val = opt?.value;
                if (!val) {
                  field.onChange(null);
                  setIsOtherMode(false);
                  setValue(textName, "");
                  onSelected?.();
                  return;
                }
                if (val === OTHER_VALUE) {
                  field.onChange(null);
                  setIsOtherMode(true);
                  setValue(textName, "");
                  onSelected?.();
                  return;
                }
                field.onChange(toNumberOrNull(val));
                setIsOtherMode(false);
                setValue(textName, opt?.label ?? "");
                onSelected?.();
              }}
              options={options}
              placeholder={selectPlaceholder}
              menuPortalTarget={menuPortalTarget}
            />
          )}
        />
        <input
          type="text"
          placeholder={textPlaceholder}
          className={`block w-full h-10.75 rounded-lg border px-3 py-2 focus:outline-none transition ${
            inputDisabled
              ? "bg-gray-200 border-gray-300 cursor-not-allowed"
              : "bg-white border-gray-300"
          }`}
          disabled={inputDisabled}
          value={isOtherMode ? textValue || "" : ""}
          onChange={(e) => setValue(textName, onlyLettersTR(e.target.value))}
        />
      </div>
      {(() => {
        if (!errors || !errors.personal) return null;
        const selectKey = selectName.split(".").pop();
        const textKey = textName.split(".").pop();
        const msg =
          errors.personal[selectKey]?.message ||
          errors.personal[textKey]?.message;
        return msg ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{msg}</p>
        ) : null;
      })()}
    </div>
  );
}

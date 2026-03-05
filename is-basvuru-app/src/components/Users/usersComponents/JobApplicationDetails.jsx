import { useMemo, useEffect, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tanimlamalarService from "../../../services/tanimlamalarService";
import {
  faEye,
  faBuilding,
  faLayerGroup,
  faBriefcase,
  faComputer,
  faHouseUser,
  faClapperboard,
} from "@fortawesome/free-solid-svg-icons";

// React-Select Stilleri
const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "43px",
    borderRadius: "0.5rem",
    backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
    border: "1px solid #d1d5db",
    boxShadow: "none",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    "&:hover": { borderColor: "#000000" },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

// --- YARDIMCI FONKSİYONLAR ---

const safeGet = (item, ...keys) => {
  if (!item) return null;
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }
  return null;
};

// Benzersiz seçenekler oluşturmak için yardımcı fonksiyon (Label'a göre)
const getUniqueOptionsByLabel = (options) => {
  const seen = new Set();
  return options.filter((opt) => {
    if (!opt.label) return false;
    if (seen.has(opt.label)) return false;
    seen.add(opt.label);
    return true;
  });
};

// Hidrasyon Fonksiyonu: Formdaki ID'yi (Value) alıp, Label'ı (İsim) bulur.
const getValueObjects = (
  formValue,
  options,
  allRawData,
  labelKey = "Label",
) => {
  if (!formValue) return [];
  const valueArray = Array.isArray(formValue) ? formValue : [formValue];

  return valueArray
    .map((item) => {
      const valStr = String(item.value || item);

      // 1. Önce filtrelenmiş options listesinde ara
      let found = options.find((opt) => String(opt.value) === valStr);

      // 2. Bulamazsan, API ham verisi (allRawData) içinde ara
      if (!found && allRawData) {
        const rawFound = allRawData.find(
          (d) => String(safeGet(d, "id", "Id")) === valStr,
        );
        if (rawFound) {
          found = {
            value: valStr,
            label: safeGet(rawFound, labelKey, labelKey.toLowerCase()),
          };
        }
      }

      return found || null;
    })
    .filter((v) => v !== null);
};

export default function JobApplicationDetails({ definitions }) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const [departmanPozisyonApi, setDepartmanPozisyonApi] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await tanimlamalarService.getDepartmanPozisyonlar();
        if (!alive) return;
        setDepartmanPozisyonApi(res?.data ?? []);
      } catch (e) {
        console.error("DepartmanPozisyon verisi yüklenirken hata:", e);
        setDepartmanPozisyonApi([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // --- API Verileri (Memoized) ---
  const apiSubeler = useMemo(() => definitions?.subeler ?? [], [definitions]);
  const apiSubeAlanlar = useMemo(
    () => definitions?.subeAlanlar ?? [],
    [definitions],
  );
  const apiDepartmanlar = useMemo(
    () => definitions?.departmanlar ?? [],
    [definitions],
  );
  const apiPozisyonlar = useMemo(
    () => departmanPozisyonApi ?? [],
    [departmanPozisyonApi],
  );
  const apiProgramlar = useMemo(
    () => definitions?.programlar ?? [],
    [definitions],
  );
  const apiOyunlar = useMemo(
    () => definitions?.kagitOyunlari ?? [],
    [definitions],
  );

  // --- Form Verileri (Watch) ---
  const rawSubeler = useWatch({ name: "jobDetails.subeler" });
  const subeler = useMemo(() => rawSubeler || [], [rawSubeler]);

  const rawAlanlar = useWatch({ name: "jobDetails.alanlar" });
  const alanlar = useMemo(() => rawAlanlar || [], [rawAlanlar]);

  const rawDepartmanlar = useWatch({ name: "jobDetails.departmanlar" });
  const departmanlar = useMemo(() => rawDepartmanlar || [], [rawDepartmanlar]);

  const rawProgramlar = useWatch({ name: "jobDetails.programlar" });
  const programlar = useMemo(() => rawProgramlar || [], [rawProgramlar]);

  const rawDepartmanPozisyonlari = useWatch({
    name: "jobDetails.departmanPozisyonlari",
  });
  const departmanPozisyonlari = useMemo(
    () => rawDepartmanPozisyonlari || [],
    [rawDepartmanPozisyonlari],
  );

  const rawKagitOyunlari = useWatch({ name: "jobDetails.kagitOyunlari" });
  const kagitOyunlari = useMemo(
    () => rawKagitOyunlari || [],
    [rawKagitOyunlari],
  );

  const lojman = useWatch({ name: "jobDetails.lojman" });
  const rawTercihNedeni = useWatch({ name: "jobDetails.tercihNedeni" });
  const tercihNedeni = useMemo(() => rawTercihNedeni || "", [rawTercihNedeni]);

  // =========================================================
  // OPTIONS OLUŞTURMA (Dropdown Listeleri)
  // =========================================================

  const subeOptions = useMemo(() => {
    const opts = apiSubeler.map((s) => ({
      value: String(safeGet(s, "id", "Id")),
      label: safeGet(s, "subeAdi", "SubeAdi"),
    }));
    return getUniqueOptionsByLabel(opts);
  }, [apiSubeler]);

  const alanOptions = useMemo(() => {
    if (!subeler || subeler.length === 0) return [];
    const selectedSubeIds = subeler.map((s) => String(s.value));

    const opts = apiSubeAlanlar
      .filter((a) => {
        const sId = String(safeGet(a, "subeId", "SubeId"));
        return selectedSubeIds.includes(sId);
      })
      .map((a) => ({
        value: String(safeGet(a, "id", "Id")),
        label: safeGet(a, "alanAdi", "AlanAdi"),
      }));
    return getUniqueOptionsByLabel(opts);
  }, [apiSubeAlanlar, subeler]);

  const departmanOptions = useMemo(() => {
    if (!alanlar || alanlar.length === 0) return [];
    const selectedAlanLabels = alanlar
      .map((a) => a.label || "")
      .filter(Boolean);

    if (selectedAlanLabels.length === 0 && alanlar.length > 0) {
      alanlar.forEach((a) => {
        const raw = apiSubeAlanlar.find(
          (r) => String(safeGet(r, "id", "Id")) === String(a.value),
        );
        if (raw) selectedAlanLabels.push(safeGet(raw, "alanAdi", "AlanAdi"));
      });
    }

    const opts = apiDepartmanlar
      .filter((d) => {
        const relatedAlan = apiSubeAlanlar.find(
          (a) =>
            String(safeGet(a, "id", "Id")) ===
            String(safeGet(d, "subeAlanId", "SubeAlanId", "alanId")),
        );
        const alanName = safeGet(relatedAlan, "alanAdi", "AlanAdi");
        return selectedAlanLabels.includes(alanName);
      })
      .map((d) => ({
        value: String(safeGet(d, "id", "Id")),
        label: safeGet(d, "departmanAdi", "DepartmanAdi"),
      }));
    return getUniqueOptionsByLabel(opts);
  }, [apiDepartmanlar, alanlar, apiSubeAlanlar]);

  const pozisyonOptions = useMemo(() => {
    if (!departmanlar || departmanlar.length === 0) return [];
    const selectedDeptIds = departmanlar.map((d) => String(d.value));

    const opts = apiPozisyonlar
      .filter((dp) => {
        const deptId = safeGet(dp, "departmanId", "DepartmanId");
        return deptId && selectedDeptIds.includes(String(deptId));
      })
      .map((dp) => {
        const nestedPos = dp.pozisyon || dp.Pozisyon;

        const value = String(
          safeGet(dp, "pozisyonId", "PozisyonId") ??
            safeGet(nestedPos, "id", "Id") ??
            safeGet(dp, "id", "Id"),
        );

        const label =
          safeGet(nestedPos, "pozisyonAdi", "PozisyonAdi") ??
          safeGet(dp, "pozisyonAdi", "PozisyonAdi");

        return { value, label };
      })
      .filter((x) => x.value && x.label);

    return getUniqueOptionsByLabel(opts);
  }, [apiPozisyonlar, departmanlar]);

  const programOptions = useMemo(() => {
    if (!departmanlar || departmanlar.length === 0) return [];
    const selectedDepartmanLabels = departmanlar
      .map((d) => d.label || "")
      .filter(Boolean);

    if (selectedDepartmanLabels.length === 0 && departmanlar.length > 0) {
      departmanlar.forEach((d) => {
        const raw = apiDepartmanlar.find(
          (r) => String(safeGet(r, "id", "Id")) === String(d.value),
        );
        if (raw)
          selectedDepartmanLabels.push(
            safeGet(raw, "departmanAdi", "DepartmanAdi"),
          );
      });
    }

    const opts = apiProgramlar
      .filter((pr) => {
        const relatedDept = apiDepartmanlar.find(
          (d) =>
            String(safeGet(d, "id", "Id")) ===
            String(safeGet(pr, "departmanId", "DepartmanId")),
        );
        const deptName = safeGet(relatedDept, "departmanAdi", "DepartmanAdi");
        return selectedDepartmanLabels.includes(deptName);
      })
      .map((pr) => ({
        value: String(safeGet(pr, "id", "Id")),
        label: safeGet(pr, "programAdi", "ProgramAdi"),
      }));
    return getUniqueOptionsByLabel(opts);
  }, [apiProgramlar, departmanlar, apiDepartmanlar]);

  const oyunOptions = useMemo(() => {
    const opts = apiOyunlar.map((o) => ({
      value: String(safeGet(o, "id", "Id")),
      label: safeGet(o, "oyunAdi", "OyunAdi"),
    }));
    return getUniqueOptionsByLabel(opts);
  }, [apiOyunlar]);

  const selectedSubelerHydrated = useMemo(() => {
    const raw = getValueObjects(subeler, subeOptions, apiSubeler, "subeAdi");
    return getUniqueOptionsByLabel(raw);
  }, [subeler, subeOptions, apiSubeler]);

  const selectedAlanlarHydrated = useMemo(() => {
    const raw = getValueObjects(
      alanlar,
      alanOptions,
      apiSubeAlanlar,
      "alanAdi",
    );
    return getUniqueOptionsByLabel(raw);
  }, [alanlar, alanOptions, apiSubeAlanlar]);

  const selectedDepartmanlarHydrated = useMemo(() => {
    const raw = getValueObjects(
      departmanlar,
      departmanOptions,
      apiDepartmanlar,
      "departmanAdi",
    );
    return getUniqueOptionsByLabel(raw);
  }, [departmanlar, departmanOptions, apiDepartmanlar]);

  const selectedPozisyonlarHydrated = useMemo(() => {
    const raw = getValueObjects(
      departmanPozisyonlari,
      pozisyonOptions,
      apiPozisyonlar,
      "pozisyonAdi",
    );
    return getUniqueOptionsByLabel(raw);
  }, [departmanPozisyonlari, pozisyonOptions, apiPozisyonlar]);

  const selectedProgramlarHydrated = useMemo(() => {
    const raw = getValueObjects(
      programlar,
      programOptions,
      apiProgramlar,
      "programAdi",
    );
    return getUniqueOptionsByLabel(raw);
  }, [programlar, programOptions, apiProgramlar]);

  const selectedOyunlarHydrated = useMemo(() => {
    const raw = getValueObjects(
      kagitOyunlari,
      oyunOptions,
      apiOyunlar,
      "oyunAdi",
    );
    return getUniqueOptionsByLabel(raw);
  }, [kagitOyunlari, oyunOptions, apiOyunlar]);

  // Casino Kontrolü
  const isLiveGameSelected = useMemo(() => {
    return selectedDepartmanlarHydrated.some((d) => {
      const label = d?.label || "";
      return /canl[ıi]|live|casino/i.test(label);
    });
  }, [selectedDepartmanlarHydrated]);

  const lojmanOptions = [
    { value: "2", label: t("jobDetails.housing.yes") || "Evet" },
    { value: "1", label: t("jobDetails.housing.no") || "Hayır" },
  ];

  // --- HANDLERS ---
  const handleSubeChange = (val, field) => {
    field.onChange(val);
    setValue("jobDetails.alanlar", []);
    setValue("jobDetails.departmanlar", []);
    setValue("jobDetails.departmanPozisyonlari", []);
    setValue("jobDetails.programlar", []);
  };

  const handleAlanChange = (val, field) => {
    field.onChange(val);
    setValue("jobDetails.departmanlar", []);
    setValue("jobDetails.departmanPozisyonlari", []);
    setValue("jobDetails.programlar", []);
  };

  const handleDepartmanChange = (val, field) => {
    field.onChange(val);
    setValue("jobDetails.departmanPozisyonlari", []);
    setValue("jobDetails.programlar", []);

    const hasLive = (val || []).some((v) => {
      const opt = departmanOptions.find((o) => o.value === v.value);
      return opt?.label && /canl[ıi]|live|casino/i.test(opt.label);
    });
    if (!hasLive) setValue("jobDetails.kagitOyunlari", []);
  };

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8">
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md shadow-sm">
        <p className="text-sm sm:text-base leading-relaxed">
          <strong>📋 {t("jobDetails.info.title")}</strong>{" "}
          {t("jobDetails.info.bodyBase")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <Controller
          name="jobDetails.subeler"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.branches")}
              options={subeOptions}
              {...field}
              value={selectedSubelerHydrated}
              onChange={(val) => handleSubeChange(val, field)}
              placeholder={t("jobDetails.placeholders.selectBranch")}
              error={errors.jobDetails?.subeler}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />

        <Controller
          name="jobDetails.alanlar"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.areas")}
              options={alanOptions}
              {...field}
              value={selectedAlanlarHydrated}
              onChange={(val) => handleAlanChange(val, field)}
              placeholder={t("jobDetails.placeholders.selectArea")}
              error={errors.jobDetails?.alanlar}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />

        <Controller
          name="jobDetails.departmanlar"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.departments")}
              options={departmanOptions}
              {...field}
              value={selectedDepartmanlarHydrated}
              onChange={(val) => handleDepartmanChange(val, field)}
              placeholder={t("jobDetails.placeholders.selectDepartment")}
              error={errors.jobDetails?.departmanlar}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />

        <Controller
          name="jobDetails.departmanPozisyonlari"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.roles")}
              options={pozisyonOptions}
              {...field}
              value={selectedPozisyonlarHydrated}
              placeholder={t("jobDetails.placeholders.selectRoles")}
              error={errors.jobDetails?.departmanPozisyonlari}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />

        <Controller
          name="jobDetails.programlar"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.programs")}
              options={programOptions}
              {...field}
              value={selectedProgramlarHydrated}
              placeholder={t("jobDetails.placeholders.selectProgram")}
              error={errors.jobDetails?.programlar}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />

        <Controller
          name="jobDetails.kagitOyunlari"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t("jobDetails.labels.cardGames")}
              options={oyunOptions}
              {...field}
              value={selectedOyunlarHydrated}
              placeholder={t("jobDetails.placeholders.selectCardGame")}
              isDisabled={!isLiveGameSelected}
              error={errors.jobDetails?.kagitOyunlari}
              isMulti
              menuPortalTarget={portalTarget}
            />
          )}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <div className="lg:col-span-2">
          <Controller
            name="jobDetails.lojman"
            control={control}
            render={({ field }) => (
              <SelectField
                label={t("jobDetails.labels.housing")}
                options={lojmanOptions}
                {...field}
                value={lojmanOptions.find(
                  (o) => o.value === String(field.value),
                )}
                onChange={(opt) => field.onChange(opt ? opt.value : "")}
                placeholder={t("jobDetails.placeholders.selectHousing")}
                error={errors.jobDetails?.lojman}
                isMulti={false}
                menuPortalTarget={portalTarget}
              />
            )}
          />
        </div>

        <div className="lg:col-span-10">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {t("jobDetails.labels.whyUs")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            maxLength={500}
            placeholder={t("jobDetails.placeholders.whyUs")}
            {...register("jobDetails.tercihNedeni")}
            className={`w-full rounded-lg px-4 py-2 border ${
              errors.jobDetails?.tercihNedeni
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:border-black resize-none`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-red-600">
              {errors.jobDetails?.tercihNedeni?.message}
            </span>
            <span className="text-gray-400">{tercihNedeni.length}/500</span>
          </div>
        </div>
      </div>

      <PreviewSection
        t={t}
        data={{
          subeler: selectedSubelerHydrated,
          alanlar: selectedAlanlarHydrated,
          departmanlar: selectedDepartmanlarHydrated,
          departmanPozisyonlari: selectedPozisyonlarHydrated,
          programlar: selectedProgramlarHydrated,
          kagitOyunlari: selectedOyunlarHydrated,
          lojman,
        }}
      />
    </div>
  );
}

function SelectField({ label, error, ...props }) {
  let errorMessage = null;
  if (error) {
    if (typeof error === "string") errorMessage = error;
    else if (typeof error === "object" && error.message)
      errorMessage = error.message;
    else errorMessage = "Geçersiz seçim.";
  }
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-[15px] font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Select
        styles={customStyles}
        menuPosition="fixed"
        noOptionsMessage={() => "Seçenek bulunamadı"}
        {...props}
      />
      {errorMessage && (
        <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

function PreviewSection({ t, data }) {
  const items = [
    {
      icon: faBuilding,
      label: t("jobDetails.preview.branches"),
      val: data.subeler,
    },
    {
      icon: faLayerGroup,
      label: t("jobDetails.preview.areas"),
      val: data.alanlar,
    },
    {
      icon: faBriefcase,
      label: t("jobDetails.preview.departments"),
      val: data.departmanlar,
    },
    {
      icon: faBriefcase,
      label: t("jobDetails.preview.roles"),
      val: data.departmanPozisyonlari,
    },
    {
      icon: faComputer,
      label: t("jobDetails.preview.programs"),
      val: data.programlar,
    },
    {
      icon: faClapperboard,
      label: t("jobDetails.preview.cardGames"),
      val: data.kagitOyunlari,
    },
  ];
  return (
    <div className="mt-10 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faEye} className="text-red-600" />{" "}
        {t("jobDetails.preview.title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 p-2 hover:bg-gray-50 rounded-md">
            <FontAwesomeIcon icon={item.icon} className="text-gray-400 mt-1" />
            <div>
              <strong>{item.label}:</strong>
              <div className="text-gray-900">
                {Array.isArray(item.val) && item.val.length > 0
                  ? item.val.map((v) => v.label).join(", ")
                  : "—"}
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-2 p-2 hover:bg-gray-50 rounded-md">
          <FontAwesomeIcon icon={faHouseUser} className="text-gray-400 mt-1" />
          <div>
            <strong>{t("jobDetails.preview.housing")}:</strong>
            <div className="text-gray-900">
              {data.lojman === "2"
                ? t("jobDetails.housing.yes")
                : data.lojman === "1"
                  ? t("jobDetails.housing.no")
                  : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

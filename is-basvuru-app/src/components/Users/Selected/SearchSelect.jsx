import Select from "react-select";

export default function SearchSelect({
  label,
  name,
  value,
  options = [],
  onChange,
  placeholder = "Ara veya seç…",
  error,
  maxVisible = 4,
  itemHeight = 40,
  isDisabled = false,
  isClearable = false,
  className = "",
  menuPortalTarget,
  zIndex = 99999,
}) {
  // --- DÜZELTİLEN KISIM ---
  // Eğer gelen 'value' zaten bir nesne ise (örn: {value:1, label:'Türkiye'}), onu direkt kullan.
  // Eğer sadece ID geldiyse (örn: 1), options listesinde arayıp bul.
  const rsValue =
    value && typeof value === "object" && "value" in value
      ? value
      : options.find((o) => String(o.value) === String(value)) || null;
  // -------------------------

  const handleChange = (opt) => {
    // Seçim yapıldığında üst bileşene (PersonalInformation) tüm objeyi gönderiyoruz.
    onChange?.(opt);
  };

  const styles = {
    control: (base, state) => ({
      ...base,
      minHeight: 43,
      height: 43,
      borderRadius: 8,
      borderColor: "#d1d5db",
      boxShadow: "none",
      backgroundColor: state.isDisabled ? "#e5e7eb" : "white",
      cursor: state.isDisabled ? "not-allowed" : "text",
      ":hover": { borderColor: "#000" },
    }),
    valueContainer: (b) => ({
      ...b,
      height: 39,
      padding: "0 8px",
      overflowY: "auto",
    }),
    indicatorsContainer: (b) => ({ ...b, height: 39 }),
    dropdownIndicator: (b) => ({ ...b, padding: 8 }),
    clearIndicator: (b) => ({ ...b, padding: 8 }),
    placeholder: (b) => ({ ...b, color: "#9ca3af" }),
    menuPortal: (base) => ({ ...base, zIndex }),
    menu: (b) => ({ ...b, zIndex }),
    menuList: (b) => ({
      ...b,
      maxHeight: maxVisible * itemHeight,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    option: (base, state) => ({
      ...base,
      minHeight: itemHeight,
      lineHeight: `${itemHeight - 12}px`,
      paddingTop: 6,
      paddingBottom: 6,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#e5f2ff"
        : state.isFocused
          ? "#f3f4f6"
          : "white",
      color: "#111827",
    }),
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <Select
        inputId={name}
        name={name}
        value={rsValue}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isSearchable
        openMenuOnFocus
        openMenuOnClick
        menuShouldScrollIntoView
        maxMenuHeight={maxVisible * itemHeight}
        menuPlacement="auto"
        menuPortalTarget={
          menuPortalTarget ??
          (typeof document !== "undefined" ? document.body : null)
        }
        menuPosition="fixed"
        styles={styles}
        autoComplete="off"
        classNamePrefix="rs"
      />

      {error && (
        <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}

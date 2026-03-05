import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { EGITIM_SEVIYELERI } from "./TableUtils";

export function FilterInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  children,
  ...props
}) {
  const commonClasses =
    "w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none transition-all hover:border-black focus:border-black focus:ring-0 uppercase placeholder:text-gray-300";
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1"
      >
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={commonClasses + " cursor-pointer"}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={commonClasses}
          {...props}
        />
      )}
    </div>
  );
}
export default function AdvancedFilters({
  filters,
  lookups,
  onFilterChange,
  onApply,
  onClear,
}) {
  return (
    <div className="absolute top-full right-0 mt-2 w-75 sm:w-150 lg:w-175 z-9999 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-black text-gray-800 uppercase">
          Detaylı Filtreleme
        </h3>
        <button
          onClick={onClear}
          className="text-[10px] font-bold text-red-500 hover:underline"
        >
          <FontAwesomeIcon icon={faEraser} /> TEMİZLE
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 pb-1">
            Pozisyon Bilgileri
          </h4>
          <FilterInput
            label="Şube"
            name="branch"
            value={filters.branch}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            {lookups.subeler.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FilterInput>
          <FilterInput
            label="Alan"
            name="area"
            value={filters.area}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            {lookups.alanlar.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </FilterInput>
          <FilterInput
            label="Departman"
            name="department"
            value={filters.department}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            {lookups.departmanlar.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </FilterInput>
          <FilterInput
            label="Pozisyon"
            name="role"
            value={filters.role}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            {lookups.pozisyonlar.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </FilterInput>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 pb-1">
            Aday Bilgileri
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <FilterInput
              label="Min Yaş"
              name="ageMin"
              value={filters.ageMin}
              onChange={onFilterChange}
              type="number"
              placeholder="18"
            />
            <FilterInput
              label="Maks Yaş"
              name="ageMax"
              value={filters.ageMax}
              onChange={onFilterChange}
              type="number"
              placeholder="45"
            />
          </div>
          <FilterInput
            label="Cinsiyet"
            name="gender"
            value={filters.gender}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
          </FilterInput>
          <FilterInput
            label="Eğitim Seviyesi"
            name="education"
            value={filters.education}
            onChange={onFilterChange}
            type="select"
          >
            <option value="all">TÜMÜ</option>
            {Object.values(EGITIM_SEVIYELERI).map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </FilterInput>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Başvuru Tarihi
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <FilterInput
            label="Başlangıç"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            type="date"
          />
          <FilterInput
            label="Bitiş"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            type="date"
          />
        </div>
      </div>
      <button
        onClick={onApply}
        className="w-full mt-5 bg-blue-600 text-white py-2.5 rounded-lg text-xs font-black uppercase hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
      >
        <FontAwesomeIcon icon={faSearch} /> Sonuçları Getir
      </button>
    </div>
  );
}

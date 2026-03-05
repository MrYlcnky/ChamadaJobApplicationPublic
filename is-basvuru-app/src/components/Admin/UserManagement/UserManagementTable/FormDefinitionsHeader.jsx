import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function FormDefinitionsHeader({
  // Başlık ve Filtre Propları
  filterDropdown,
  searchTerm,
  setSearchTerm,
  handleAdd,
  isAddDisabled,
  currentTabSingleName,

  // Sekme (Tabs) Propları
  tabs,
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Üst Bölüm: Başlık, Arama ve Ekleme */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-6 border-b-4 border-b-emerald-600 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sm:gap-6">
        {/* Sol Taraf - Geri Butonu ve Başlık */}
        <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
          <button
            onClick={() => navigate("/admin/panel")}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-50 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all border shadow-sm shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-black text-gray-800 uppercase tracking-tighter truncate">
              Form <span className="text-emerald-600">Tanımları</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
              Coğrafi & İdari Veriler
            </p>
          </div>
        </div>

        {/* Sağ Taraf - Filtre, Arama, Ekleme */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Dropdown Filtre */}
          <div className="w-full sm:w-auto">{filterDropdown}</div>

          {/* Arama Kutusu */}
          <div className="relative group w-full sm:w-auto xl:w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors text-sm"
            />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-bold placeholder:text-gray-400"
            />
          </div>

          {/* Ekle Butonu */}
          <button
            onClick={handleAdd}
            disabled={isAddDisabled}
            className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] sm:text-[11px] uppercase shadow-lg active:scale-95 transition-all shrink-0 ${
              isAddDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
            }`}
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            <span>{currentTabSingleName} Ekle</span>
          </button>
        </div>
      </div>

      {/* Alt Bölüm: Sekmeler (Tabs) - Yatay Kaydırılabilir */}
      <div className="bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-xs sm:text-sm" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

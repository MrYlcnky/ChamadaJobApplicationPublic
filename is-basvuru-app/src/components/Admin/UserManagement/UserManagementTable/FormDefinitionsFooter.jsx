import React from "react";

export default function FormDefinitionsFooter({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
  totalPages,
}) {
  return (
    <div className="p-4 sm:p-6 bg-gray-50/50 border-t flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Sol Kısım: Sayfa Başına Kayıt Seçimi */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">
            Göster:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
          Toplam <span className="text-emerald-600">{totalItems}</span> Kayıt
        </span>
      </div>

      {/* Sağ Kısım: Navigasyon Butonları */}
      <div className="flex items-center justify-center gap-2 w-full md:w-auto">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="flex-1 md:flex-none px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-[9px] sm:text-[10px] font-black disabled:opacity-30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
        >
          GERİ
        </button>

        <div className="flex items-center px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black text-emerald-600 bg-emerald-50 rounded-xl shadow-inner min-w-17.5 justify-center whitespace-nowrap">
          {currentPage} / {totalPages || 1}
        </div>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex-1 md:flex-none px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-[9px] sm:text-[10px] font-black disabled:opacity-30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
        >
          İLERİ
        </button>
      </div>
    </div>
  );
}

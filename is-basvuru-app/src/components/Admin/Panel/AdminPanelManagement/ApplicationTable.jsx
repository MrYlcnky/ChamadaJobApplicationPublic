import React, { useState, useRef } from "react";
import { flexRender } from "@tanstack/react-table";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// --- PORTAL TOOLTIP ---
// Tablo hücreleri içindeki kısıtlı alandan taşan listeleri sayfanın en üst katmanında göstermek için.
const PortalTooltip = ({ children, coords, visible }) => {
  if (!visible) return null;
  return createPortal(
    <div
      className="fixed z-9999 bg-white border border-gray-200 shadow-2xl rounded-lg p-3 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: coords.top + 10,
        left: coords.left - 10,
        minWidth: "200px",
        maxWidth: "300px",
      }}
    >
      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
      {children}
    </div>,
    document.body,
  );
};

// --- TRUNCATED LIST (Şubeler, Alanlar vb. için) ---
export const TruncatedList = ({ items, colorClass, maxVisible = 1 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const badgeRef = useRef(null);

  if (!items || items.length === 0)
    return <span className="text-gray-300 text-[10px]">-</span>;

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
      setShowTooltip(true);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {items.slice(0, maxVisible).map((item, idx) => (
        <span
          key={idx}
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase whitespace-nowrap ${colorClass}`}
        >
          {item}
        </span>
      ))}
      {items.length > maxVisible && (
        <>
          <span
            ref={badgeRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-[9px] font-black px-1.5 py-0.5 rounded border bg-gray-100 text-gray-600 cursor-help hover:bg-gray-200 transition-colors"
          >
            +{items.length - maxVisible}
          </span>
          <PortalTooltip coords={coords} visible={showTooltip}>
            <div className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-wider border-b border-gray-100 pb-1">
              Tüm Liste ({items.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${colorClass}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </PortalTooltip>
        </>
      )}
    </div>
  );
};

// --- STATUS BADGE (Durum Rozeti) ---
export function StatusBadge({ status, statusId }) {
  const map = {
    1: "bg-blue-100 text-blue-800 border-blue-300", // Yeni Başvuru
    2: "bg-amber-100 text-amber-800 border-amber-300", // Devam Ediyor
    3: "bg-emerald-100 text-emerald-800 border-emerald-300", // Onaylandı
    4: "bg-rose-100 text-rose-800 border-rose-300", // Reddedildi
    5: "bg-purple-100 text-purple-800 border-purple-300", // Revize Talebi
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${map[statusId] || "bg-gray-100 text-gray-800 border-gray-300"}`}
    >
      {status}
    </span>
  );
}

// --- ANA TABLO BİLEŞENİ ---
export default function ApplicationTable({
  table,
  pageInput,
  setPageInput,
  handleGoToPage,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className={`px-4 py-3 text-[9px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors ${["profile", "status", "stage", "actions"].includes(h.id) ? "text-center" : "text-left"}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${["profile", "status", "stage", "actions"].includes(h.id) ? "justify-center" : ""}`}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        <span className="text-gray-300">
                          {h.column.getIsSorted() === "asc" ? (
                            <FontAwesomeIcon
                              icon={faSortUp}
                              className="text-blue-500"
                            />
                          ) : h.column.getIsSorted() === "desc" ? (
                            <FontAwesomeIcon
                              icon={faSortDown}
                              className="text-blue-500"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faSort} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/20 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 text-[11px] text-gray-600 align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="px-6 py-12 text-center text-gray-400 font-bold text-xs uppercase"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SAYFALAMA (PAGINATION) */}
      {table.getRowModel().rows.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              Satır Sayısı:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-700 text-[10px] font-bold rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {[5, 10, 20, 50, 100].map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="xs" />
            </button>
            <div className="flex items-center gap-1 px-2 border-x border-gray-100">
              <span className="text-[10px] font-bold text-gray-400">Sayfa</span>
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={handleGoToPage}
                className="w-8 text-center text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded outline-none focus:border-blue-500 transition-all"
              />
              <span className="text-[10px] font-bold text-gray-400">
                / {table.getPageCount()}
              </span>
            </div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </button>
          </div>

          <div className="text-[10px] font-bold text-gray-400 uppercase">
            Toplam{" "}
            <span className="text-gray-800">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            Kayıt
          </div>
        </div>
      )}
    </div>
  );
}

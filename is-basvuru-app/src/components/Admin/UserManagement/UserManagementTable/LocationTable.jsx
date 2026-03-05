import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function LocationTable({
  list,
  loading,
  currentTabKey,
  renderButtons,
}) {
  // Veri çekme yardımcısı
  const getValue = (item, key) => {
    if (!item) return "-";
    if (item[key] !== undefined) return item[key];
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    return item[camelKey] !== undefined ? item[camelKey] : "-";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/80 border-b">
            <th className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase w-24">
              ID
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              Tanım Bilgisi
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              <FontAwesomeIcon icon={faGlobe} className="mr-1" /> Bağlı Ülke
            </th>
            <th className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan="4" className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-20 text-center text-xs font-black text-gray-300 uppercase tracking-widest"
              >
                Kayıt Bulunamadı
              </td>
            </tr>
          ) : (
            list.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-emerald-50/30 transition-all group"
              >
                {/* ID Hücresi */}
                <td className="py-5 px-10">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-full border border-emerald-100 font-mono">
                    #{item.id}
                  </span>
                </td>

                {/* Tanım Hücresi (Uyruk veya Şehir Adı) */}
                <td className="py-5 px-6 text-sm font-black text-gray-800 uppercase tracking-tight">
                  {getValue(item, currentTabKey)}
                </td>

                {/* Bağlı Ülke Hücresi */}
                <td className="py-5 px-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                    {item.UlkeAdi || item.ulkeAdi || "Belirsiz"}
                  </span>
                </td>

                {/* İşlemler Hücresi */}
                <td className="py-5 px-10 text-right">{renderButtons(item)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

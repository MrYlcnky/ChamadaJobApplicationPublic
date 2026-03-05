// src/components/Admin/UserManagement/UserManagementModals/KvkkTable.jsx (Yolu projene göre ayarla)
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faSort,
  faSortAmountUp,
  faSortAmountDown,
} from "@fortawesome/free-solid-svg-icons";

export default function KvkkTable({
  list,
  loading,
  handleEdit,
  handleDelete,
  sortConfig,
  requestSort,
}) {
  const truncateText = (text, maxLength = 30) =>
    !text
      ? "-"
      : text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;

  const getSortIcon = (key) =>
    sortConfig.key !== key ? (
      <FontAwesomeIcon
        icon={faSort}
        className="text-gray-300 opacity-50 ml-1"
      />
    ) : (
      <FontAwesomeIcon
        icon={
          sortConfig.direction === "asc" ? faSortAmountUp : faSortAmountDown
        }
        className="text-emerald-600 ml-1"
      />
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/80 border-b">
            <th
              onClick={() => requestSort("id")}
              className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase w-24 cursor-pointer hover:text-emerald-600 transition-colors"
            >
              ID {getSortIcon("id")}
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              Versiyon
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              Doğruluk ve Sorumluluk Beyanı Metni (TR)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase text-blue-600">
              Doğruluk ve Sorumluluk Beyanı Metni (EN)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              KVKK Aydınlatma Metni (TR)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase text-blue-600">
              KVKK Aydınlatma Metni (EN)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase">
              Referans Araştırma ve Doğrulama Onayı (TR)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase text-blue-600">
              Referans Araştırma ve Doğrulama Onayı (EN)
            </th>
            <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase text-center">
              Güncelleme
            </th>
            <th className="py-5 px-10 text-[10px] font-black text-gray-400 uppercase text-right">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan="8" className="p-20 text-center">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td
                colSpan="8"
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
                <td className="py-5 px-10">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-full border border-emerald-100 font-mono">
                    #{item.id}
                  </span>
                </td>
                <td className="py-5 px-6 text-sm font-black text-gray-800">
                  v{item.KvkkVersiyon || item.kvkkVersiyon}
                </td>

                {/* Türkçe Doğruluk ve Sorumluluk Beyanı */}
                <td
                  className="py-5 px-6 text-xs text-gray-600 max-w-[150px] font-semibold truncate"
                  title={item.DogrulukAciklamaTr || item.dogrulukAciklamaTr}
                >
                  {truncateText(
                    item.DogrulukAciklamaTr || item.dogrulukAciklamaTr,
                  )}
                </td>
                {/* İngilizce Doğruluk ve Sorumluluk Beyanı */}

                <td
                  className="py-5 px-6 text-xs text-blue-700/80 max-w-[150px ] font-sans truncate"
                  title={item.DogrulukAciklamaEn || item.dogrulukAciklamaEn}
                >
                  {truncateText(
                    item.DogrulukAciklamaEn || item.dogrulukAciklamaEn,
                  )}
                </td>

                {/* Türkçe KVKK Aydınlatma Metni ve Açık Rıza Onayı */}
                <td
                  className="py-5 px-6 text-xs text-gray-600 max-w-[150px] font-semibold truncate"
                  title={item.KvkkAciklamaTr || item.kvkkAciklamaTr}
                >
                  {truncateText(item.KvkkAciklamaTr || item.kvkkAciklamaTr)}
                </td>

                {/* İngilizce KVKK Aydınlatma Metni ve Açık Rıza Onayı */}
                <td
                  className="py-5 px-6 text-xs text-blue-700/80 max-w-[150px] font-sans truncate"
                  title={item.KvkkAciklamaEn || item.kvkkAciklamaEn}
                >
                  {truncateText(item.KvkkAciklamaEn || item.kvkkAciklamaEn)}
                </td>

                {/* Türkçe Referans Araştırma ve Doğrulama Onayı */}
                <td
                  className="py-5 px-6 text-xs text-gray-600 max-w-[150px] font-semibold truncate"
                  title={item.ReferansAciklamaTr || item.referansAciklamaTr}
                >
                  {truncateText(
                    item.ReferansAciklamaTr || item.referansAciklamaTr,
                  )}
                </td>

                {/* İngilizce Referans Araştırma ve Doğrulama Onayı */}
                <td
                  className="py-5 px-6 text-xs text-blue-700/80 max-w-[150px]  font-sans truncate"
                  title={item.ReferansAciklamaEn || item.referansAciklamaEn}
                >
                  {truncateText(
                    item.ReferansAciklamaEn || item.referansAciklamaEn,
                  )}
                </td>

                <td className="py-5 px-6 text-xs font-black text-gray-400 text-center">
                  {item.GuncellemeTarihi || item.guncellemeTarihi
                    ? new Date(
                        item.GuncellemeTarihi || item.guncellemeTarihi,
                      ).toLocaleDateString("tr-TR")
                    : "-"}
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      title="İncele / Düzenle"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                    >
                      <FontAwesomeIcon icon={faEye} className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Sil"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { basvuruService } from "../../../../services/basvuruService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faSortAmountDown,
  faSortAmountUp,
  faShieldAlt,
  faSort,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function IpLog() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "basvuruId", // Sıralama artık varsayılan olarak Başvuru No'ya göre
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await basvuruService.getBasvuruOnaylari();
      if (res && res.success) {
        setList(res.data || []);
      } else {
        setList([]);
      }
    } catch {
      toast.error("Log verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const requestSort = (key) =>
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });

  const processedList = useMemo(() => {
    let filtered = list.filter(
      (item) =>
        (item.personelAdSoyad || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.ipAdres || "").includes(searchTerm) ||
        (item.basvuruId || "").toString().includes(searchTerm), // 🔥 Başvuru No ile arama
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key] || 0;
        let valB = b[sortConfig.key] || 0;

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [list, searchTerm, sortConfig]);

  const paginatedList = processedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(processedList.length / itemsPerPage);

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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 animate-in fade-in duration-500">
      {/* Header - Mobilde dikey, tablette yatay dizilim */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-6 border-b-4 border-b-rose-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate("/admin/panel")}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-600 hover:text-white transition-all border shadow-sm active:scale-95 shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-black text-gray-800 uppercase tracking-tighter truncate">
              KVKK & <span className="text-rose-600">IP Logları</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Süper Admin Güvenlik Paneli
            </p>
          </div>
        </div>

        {/* Arama Barı - Mobilde tam genişlik */}
        <div className="relative group w-full md:w-64">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-rose-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-rose-50 transition-all font-bold"
          />
        </div>
      </div>

      {/* Tablo Kartı */}
      <div className="bg-white rounded-2xl sm:rounded-4xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b">
                <th
                  onClick={() => requestSort("basvuruId")}
                  className="py-4 px-4 sm:px-10 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase w-24 sm:w-36 cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  No {getSortIcon("basvuruId")}
                </th>
                <th
                  onClick={() => requestSort("personelAdSoyad")}
                  className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  Aday {getSortIcon("personelAdSoyad")}
                </th>
                <th className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">
                  IP
                </th>
                {/* Cihaz ve Versiyon sütunları mobilde gizlendi, orta boy ekranlarda açılır */}
                <th className=" lg:table-cell py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">
                  Cihaz
                </th>
                <th className=" md:table-cell py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">
                  Versiyon
                </th>
                <th
                  onClick={() => requestSort("onayTarihi")}
                  className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase text-center cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  Tarih {getSortIcon("onayTarihi")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center text-xs font-black text-gray-300 uppercase tracking-widest"
                  >
                    Kayıt Bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-rose-50/20 transition-all group border-l-4 border-l-transparent hover:border-l-rose-500"
                  >
                    <td className="py-4 px-4 sm:px-10">
                      <span className="text-[10px] sm:text-[11px] font-black text-emerald-600 bg-emerald-50/50 px-2 sm:px-3 py-1 rounded-full border border-emerald-100 font-mono">
                        #{item.basvuruId || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-tight truncate max-w-30 sm:max-w-none">
                          {item.personelAdSoyad}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-gray-400">
                          ID: #{item.personelId}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] sm:text-[10px] font-black font-mono border border-blue-100">
                        {item.ipAdres}
                      </span>
                    </td>
                    <td className=" lg:table-cell py-4 px-4 sm:px-6 max-w-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FontAwesomeIcon
                          icon={faLaptopCode}
                          className="text-[10px]"
                        />
                        <span className="text-[10px] font-medium leading-tight line-clamp-1 italic">
                          {item.kullaniciCihaz}
                        </span>
                      </div>
                    </td>
                    <td className=" md:table-cell py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-1.5 text-rose-600 font-black text-[10px] uppercase">
                        <FontAwesomeIcon icon={faShieldAlt} />
                        {item.kvkkVersiyon}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs font-black text-gray-700 whitespace-nowrap">
                          {new Date(item.onayTarihi).toLocaleDateString(
                            "tr-TR",
                          )}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-gray-400">
                          {new Date(item.onayTarihi).toLocaleTimeString(
                            "tr-TR",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Mobilde alt alta veya sıkıştırılmış düzen */}
        <div className="p-4 sm:p-6 bg-gray-50/50 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-[9px] sm:text-xs font-black text-gray-400 uppercase">
              Göster:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold shadow-sm outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">
              Toplam {processedList.length} İşlem
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border rounded-xl text-[9px] sm:text-[10px] font-black disabled:opacity-30 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              GERİ
            </button>
            <div className="flex items-center px-4 text-[10px] sm:text-xs font-black text-rose-600 bg-rose-50 rounded-xl whitespace-nowrap">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              disabled={currentPage * itemsPerPage >= processedList.length}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border rounded-xl text-[9px] sm:text-[10px] font-black disabled:opacity-30 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              İLERİ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

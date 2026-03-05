import React, { useState, useEffect, useCallback, useMemo } from "react";
import { basvuruService } from "../../../../services/basvuruService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faTrash,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function ManageApplications() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await basvuruService.getAll();
      if (res && res.success) {
        setList(res.data || []);
      }
    } catch {
      toast.error("Başvuru listesi yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDelete = async (masterId, name) => {
    const result = await Swal.fire({
      title: `<span class="text-rose-600 uppercase font-black">DİKKAT!</span>`,
      html: `<div class="text-sm font-bold text-gray-600">
              <b>${name.toUpperCase()}</b> isimli adayın başvurusu, eğitim/deneyim kayıtları, 
              KVKK logları ve fotoğrafı <span class="text-rose-600 underline">KALICI OLARAK</span> silinecektir.
             </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "SİL",
      cancelButtonText: "VAZGEÇ",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      customClass: { popup: "rounded-[2rem] sm:rounded-[2.5rem]" },
    });

    if (result.isConfirmed) {
      try {
        const res = await basvuruService.deleteMasterBasvuru(masterId);
        if (res.success) {
          toast.success("Kayıt sistemden tamamen silindi.");
          fetchList();
        } else {
          toast.error(res.message);
        }
      } catch {
        toast.error("İşlem başarısız.");
      }
    }
  };

  const processedList = useMemo(() => {
    return list.filter((item) => {
      const ad = item.personel?.ad || item.personel?.adi || "";
      const soyad = item.personel?.soyad || item.personel?.soyadi || "";
      const tamAd = `${ad} ${soyad}`.toLowerCase();

      return (
        tamAd.includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm) ||
        item.personelId?.toString().includes(searchTerm)
      );
    });
  }, [list, searchTerm]);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header - Mobilde dikey, tablette yatay dizilim */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-6 border-b-4 border-b-rose-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/admin/panel")}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-600 hover:text-white transition-all border shadow-sm active:scale-95 shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-black text-gray-800 uppercase tracking-tighter truncate">
              Kayıt <span className="text-rose-600">Yönetimi</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Başvuru & Arşiv Temizleme
            </p>
          </div>
        </div>

        {/* Arama Barı - Mobilde tam genişlik */}
        <div className="relative group w-full md:w-72">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-rose-500 transition-colors"
          />
          <input
            type="text"
            placeholder="İsim veya ID ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm outline-none focus:ring-4 focus:ring-rose-50 transition-all font-bold placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Tablo - Yatay kaydırma korundu, hiçbir sütun gizlenmedi */}
      <div className="bg-white rounded-2xl sm:rounded-4xl md:rounded-4xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th className="py-4 px-4 sm:py-5 sm:px-10 whitespace-nowrap">
                  Başvuru No
                </th>
                <th className="py-4 px-4 sm:py-5 sm:px-6">Aday Bilgileri</th>
                <th className="py-4 px-4 sm:py-5 sm:px-6 whitespace-nowrap">
                  Başvuru Tarihi
                </th>
                <th className="py-4 px-4 sm:py-5 sm:px-10 text-right">
                  Eylemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-16 sm:p-20 text-center animate-pulse text-rose-600 font-black text-xs sm:text-sm"
                  >
                    VERİLER SORGULANIYOR...
                  </td>
                </tr>
              ) : processedList.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-16 sm:p-20 text-center text-xs font-black text-gray-300 uppercase tracking-widest"
                  >
                    Kayıt Bulunamadı
                  </td>
                </tr>
              ) : (
                processedList.map((item) => {
                  const ad = item.personel?.ad || item.personel?.adi || "";
                  const soyad =
                    item.personel?.soyad || item.personel?.soyadi || "";
                  const tamAd = `${ad} ${soyad}`;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-rose-50/20 transition-all group border-l-4 border-l-transparent hover:border-l-rose-500"
                    >
                      <td className="py-3 px-4 sm:py-5 sm:px-10">
                        <span className="text-[10px] sm:text-[11px] font-black text-emerald-600 font-mono bg-emerald-50/50 px-2 sm:px-3 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                          #{item.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:py-5 sm:px-6">
                        <div className="flex flex-col min-w-35 sm:min-w-0">
                          <span className="text-xs sm:text-sm font-black text-gray-800 uppercase italic leading-tight">
                            {tamAd || "İSİMSİZ KAYIT"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 tracking-tight">
                            PERSONEL ID:{" "}
                            <span className="text-gray-500 font-mono">
                              #{item.personelId || item.personel?.id}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 sm:py-5 sm:px-6">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 whitespace-nowrap">
                          {new Date(item.basvuruTarihi).toLocaleDateString(
                            "tr-TR",
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:py-5 sm:px-10 text-right">
                        <button
                          onClick={() =>
                            handleDelete(item.id, tamAd || "İsimsiz")
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 border border-rose-100 shrink-0"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-xs sm:text-sm"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yasal Uyarı - Mobilde daha kompakt */}
      <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-row items-start gap-3 sm:gap-4 shadow-sm">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-base sm:text-lg"
          />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-amber-800 font-black text-[10px] sm:text-xs uppercase mb-0.5 sm:mb-1">
            Kritik Süper Admin Yetkisi
          </h4>
          <p className="text-[9px] sm:text-[11px] text-amber-900 font-bold uppercase leading-relaxed tracking-tight">
            Bu ekrandan yapılan silme işlemleri geri alınamaz. Kayıt
            silindiğinde adayın kişisel verileri, eğitim/deneyim dökümleri ve
            dijital izleri veritabanından fiziksel olarak temizlenir.
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { tanimlamalarService } from "../../../services/tanimlamalarService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faLayerGroup,
  faBuilding,
  faMapMarkerAlt,
  faArrowLeft,
  faBriefcase,
  faSearch,
  faEdit,
  faSortAmountDown,
  faSortAmountUp,
  faCheckCircle,
  faTimesCircle,
  faSitemap,
  faLaptopCode,
  faDice,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Definitions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subeler");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // --- SAYFALAMA STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Varsayılan 10

  // --- TAB YAPILANDIRMASI ---
  const tabs = [
    {
      id: "subeler",
      name: "Şubeler",
      single: "Şube",
      icon: faMapMarkerAlt,
      key: "SubeAdi",
      statusKey: "SubeAktifMi",
    },
    {
      id: "alanlar",
      name: "Sektörel Alanlar",
      single: "Alan",
      icon: faBuilding,
      key: "MasterAlanAdi",
    },
    {
      id: "departmanlar",
      name: "Departmanlar",
      single: "Departman",
      icon: faLayerGroup,
      key: "MasterDepartmanAdi",
    },
    {
      id: "pozisyonlar",
      name: "Pozisyonlar",
      single: "Pozisyon",
      icon: faBriefcase,
      key: "MasterPozisyonAdi",
    },
    {
      id: "programlar",
      name: "Programlar",
      single: "Program",
      icon: faLaptopCode,
      key: "MasterProgramAdi",
    },
    {
      id: "oyunlar",
      name: "Oyunlar",
      single: "Oyun",
      icon: faDice,
      key: "MasterOyunAdi",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  const getValue = (item, key) => {
    if (!item) return "-";
    const val =
      item[key] !== undefined
        ? item[key]
        : item[key.charAt(0).toLowerCase() + key.slice(1)];
    return val;
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "subeler") res = await tanimlamalarService.getSubeler();
      else if (activeTab === "alanlar")
        res = await tanimlamalarService.getMasterAlanlar();
      else if (activeTab === "departmanlar")
        res = await tanimlamalarService.getMasterDepartmanlar();
      else if (activeTab === "pozisyonlar")
        res = await tanimlamalarService.getMasterPozisyonlar();
      else if (activeTab === "programlar")
        res = await tanimlamalarService.getAllMasterPrograms();
      else if (activeTab === "oyunlar")
        res = await tanimlamalarService.getAllMasterOyuns();

      if (res && res.success) setList(res.data || []);
      else setList([]);
    } catch {
      toast.error("Veriler yüklenemedi.");
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // --- CRUD: EKLEME ---
  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      // Modal genel köşe yuvarlaması ve mobil genişlik ayarı
      customClass: { popup: "rounded-2xl sm:rounded-3xl w-[90%] max-w-md" },
      title: `<span class="text-lg sm:text-xl font-black uppercase text-gray-700">${currentTab.single} Ekle</span>`,
      html: `
        <div class="text-left space-y-3 sm:space-y-4 mt-2">
          <div>
              <label class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 block">İsim</label>
              <input id="swal-name" class="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-50 transition-all" placeholder="Adı yazınız...">
          </div>
          ${
            activeTab === "subeler"
              ? `
          <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 mt-2">
            <span class="text-[10px] sm:text-xs font-bold text-gray-600">Varsayılan Durum: Aktif</span>
            <input type="checkbox" id="swal-status" checked class="w-4 h-4 sm:w-5 sm:h-5 accent-blue-600 cursor-pointer">
          </div>`
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Kaydet",
      cancelButtonText: "Vazgeç",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
      focusConfirm: false,
      preConfirm: () => ({
        text: document.getElementById("swal-name").value,
        status: document.getElementById("swal-status")?.checked ?? true,
      }),
    });

    if (formValues?.text) {
      const payload = {
        [currentTab.key]: formValues.text,
        ...(activeTab === "subeler" && {
          [currentTab.statusKey]: formValues.status,
        }),
      };

      let res;
      if (activeTab === "subeler")
        res = await tanimlamalarService.createSube(payload);
      else if (activeTab === "alanlar")
        res = await tanimlamalarService.createMasterAlan(payload);
      else if (activeTab === "departmanlar")
        res = await tanimlamalarService.createMasterDepartman(payload);
      else if (activeTab === "pozisyonlar")
        res = await tanimlamalarService.createMasterPozisyon(payload);
      else if (activeTab === "programlar")
        res = await tanimlamalarService.createMasterProgram(payload);
      else if (activeTab === "oyunlar")
        res = await tanimlamalarService.createMasterOyun(payload);

      if (res?.success) {
        toast.success("Eklendi.");
        fetchList();
      } else {
        toast.error(res?.message || "Ekleme başarısız.");
      }
    }
  };

  // --- CRUD: DÜZENLEME ---
  const handleEdit = async (item) => {
    const currentVal = getValue(item, currentTab.key);
    const currentStatus =
      activeTab === "subeler" ? getValue(item, currentTab.statusKey) : true;

    const { value: formValues } = await Swal.fire({
      customClass: { popup: "rounded-2xl sm:rounded-3xl w-[90%] max-w-md" },
      title: `<span class="text-lg sm:text-xl font-black uppercase text-gray-700">Düzenle</span>`,
      html: `
        <div class="text-left space-y-3 sm:space-y-4 mt-2">
          <div>
            <label class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 block">İsim</label>
            <input id="swal-name" class="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold text-gray-700 focus:outline-none focus:border-amber-500 focus:ring-2 sm:focus:ring-4 focus:ring-amber-50 transition-all" value="${currentVal}">
          </div>
          ${
            activeTab === "subeler"
              ? `
          <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 mt-2">
            <span class="text-[10px] sm:text-xs font-bold text-gray-600">Şube Durumu (Aktif/Pasif)</span>
            <input type="checkbox" id="swal-status" ${currentStatus ? "checked" : ""} class="w-4 h-4 sm:w-5 sm:h-5 accent-amber-500 cursor-pointer">
          </div>`
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Güncelle",
      cancelButtonText: "Vazgeç",
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#9ca3af",
      focusConfirm: false,
      preConfirm: () => ({
        text: document.getElementById("swal-name").value,
        status: document.getElementById("swal-status")?.checked ?? true,
      }),
    });

    if (formValues?.text) {
      const payload = {
        id: item.id,
        [currentTab.key]: formValues.text,
        ...(activeTab === "subeler" && {
          [currentTab.statusKey]: formValues.status,
        }),
      };

      let res;
      if (activeTab === "subeler")
        res = await tanimlamalarService.updateSube(payload);
      else if (activeTab === "alanlar")
        res = await tanimlamalarService.updateMasterAlan(payload);
      else if (activeTab === "departmanlar")
        res = await tanimlamalarService.updateMasterDepartman(payload);
      else if (activeTab === "pozisyonlar")
        res = await tanimlamalarService.updateMasterPozisyon(payload);
      else if (activeTab === "programlar")
        res = await tanimlamalarService.updateMasterProgram(payload);
      else if (activeTab === "oyunlar")
        res = await tanimlamalarService.updateMasterOyun(payload);

      if (res?.success) {
        toast.success("Güncellendi.");
        fetchList();
      } else {
        toast.error(res?.message || "Güncelleme başarısız.");
      }
    }
  };

  // --- CRUD: SİLME ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      customClass: { popup: "rounded-2xl sm:rounded-3xl w-[90%] max-w-sm" },
      title: `<span class="text-lg sm:text-xl font-black">Emin misiniz?</span>`,
      html: `
        <div class="flex flex-col gap-2 mt-2">
            <span class="text-sm sm:text-base text-gray-600 font-medium">Bu kayıt silinecektir!</span>
            <div class="bg-rose-50 border border-rose-100 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-left">
                <p class="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase mb-0.5 sm:mb-1">⚠️ Dikkat:</p>
                <p class="text-[11px] sm:text-xs text-rose-500 font-medium leading-tight">Bu kayda bağlı alt veriler varsa işlem güvenlik nedeniyle engellenecektir.</p>
            </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "Vazgeç",
    });

    if (result.isConfirmed) {
      try {
        let res;
        if (activeTab === "subeler")
          res = await tanimlamalarService.deleteSube(id);
        else if (activeTab === "alanlar")
          res = await tanimlamalarService.deleteMasterAlan(id);
        else if (activeTab === "departmanlar")
          res = await tanimlamalarService.deleteMasterDepartman(id);
        else if (activeTab === "pozisyonlar")
          res = await tanimlamalarService.deleteMasterPozisyon(id);
        else if (activeTab === "programlar")
          res = await tanimlamalarService.deleteMasterProgram(id);
        else if (activeTab === "oyunlar")
          res = await tanimlamalarService.deleteMasterOyun(id);

        if (res && res.success) {
          toast.success(res.message || "Kayıt başarıyla silindi.");
          fetchList();
        } else {
          toast.error(res?.message || "Silme işlemi gerçekleştirilemedi.");
        }
      } catch (error) {
        const serverMsg = error.response?.data?.message || error.message;
        toast.error(serverMsg);
      }
    }
  };

  // --- SORT & FILTER & PAGINATION ---
  const requestSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey)
      return (
        <FontAwesomeIcon
          icon={faSort}
          className="text-gray-300 opacity-50 ml-1"
        />
      );
    return (
      <FontAwesomeIcon
        icon={
          sortConfig.direction === "asc" ? faSortAmountUp : faSortAmountDown
        }
        className="text-blue-600 ml-1"
      />
    );
  };

  const processedList = useMemo(() => {
    let filtered = list.filter((item) => {
      const name = (getValue(item, currentTab.key) || "")
        .toString()
        .toLowerCase();
      return (
        name.includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA =
          sortConfig.key === "name" ? getValue(a, currentTab.key) : a.id;
        let valB =
          sortConfig.key === "name" ? getValue(b, currentTab.key) : b.id;

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [list, searchTerm, sortConfig, currentTab]);

  const paginatedList = processedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(processedList.length / itemsPerPage);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 animate-in fade-in duration-500 min-h-screen bg-gray-50/30">
      {/* HEADER */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-6 border-b-4 border-b-blue-600 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        {/* Sol Kısım: Geri Butonu ve Başlık */}
        <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
          <button
            onClick={() => navigate("/admin/panel")}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all border shadow-sm shrink-0 active:scale-95"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-black text-gray-800 uppercase tracking-tighter truncate">
              Şirket <span className="text-blue-600">Tanımları</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
              Master Veri Yönetimi
            </p>
          </div>
        </div>

        {/* Sağ Kısım: Arama ve Ekle Butonu */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative group w-full sm:flex-1 xl:w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] sm:text-xs uppercase shadow-lg active:scale-95 transition-all shrink-0"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>{currentTab.single} Ekle</span>
          </button>
        </div>
      </div>

      {/* TABS (Sekmeler) */}
      <div className="bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.name}</span>
          </button>
        ))}
        {/* Ayırıcı ve Şirket Organizasyonu Butonu */}
        <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block shrink-0"></div>
        <button
          onClick={() => navigate("/admin/organization")}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 group whitespace-nowrap shrink-0"
        >
          <FontAwesomeIcon
            icon={faSitemap}
            className="text-rose-400 group-hover:rotate-90 transition-transform"
          />
          <span>Şirket Organizasyonu</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl sm:rounded-4xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-125">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th
                  onClick={() => requestSort("id")}
                  className="py-4 px-4 sm:px-10 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase cursor-pointer w-20 sm:w-24 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    ID {getSortIcon("id")}
                  </div>
                </th>
                <th
                  onClick={() => requestSort("name")}
                  className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Tanım Bilgisi {getSortIcon("name")}
                  </div>
                </th>
                {activeTab === "subeler" && (
                  <th className="py-4 px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase text-center w-24 sm:w-32 whitespace-nowrap">
                    Durum
                  </th>
                )}
                <th className="py-4 px-4 sm:px-10 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase text-right whitespace-nowrap">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && list.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedList.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-16 text-center text-xs font-black text-gray-300 uppercase tracking-widest"
                  >
                    Kayıt Bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-all group"
                  >
                    <td className="py-3 px-4 sm:py-5 sm:px-10">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-2 sm:px-3 py-1 rounded-full border border-blue-100 font-mono">
                        #{item.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-5 sm:px-6 text-xs sm:text-sm font-black text-gray-800 tracking-tight">
                      {getValue(item, currentTab.key)}
                    </td>
                    {activeTab === "subeler" && (
                      <td className="py-3 px-4 sm:py-5 sm:px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${
                            getValue(item, currentTab.statusKey)
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              getValue(item, currentTab.statusKey)
                                ? faCheckCircle
                                : faTimesCircle
                            }
                          />
                          {getValue(item, currentTab.statusKey)
                            ? "Aktif"
                            : "Pasif"}
                        </span>
                      </td>
                    )}
                    <td className="py-3 px-4 sm:py-5 sm:px-10 text-right">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-90 flex items-center justify-center shrink-0"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-[10px] sm:text-xs"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 flex items-center justify-center shrink-0"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-[10px] sm:text-xs"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 sm:p-6 bg-gray-50/50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
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
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold outline-none shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
              Toplam{" "}
              <span className="text-blue-600">{processedList.length}</span>{" "}
              Kayıt
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-[9px] sm:text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 shadow-sm active:scale-95"
            >
              GERİ
            </button>
            <div className="flex items-center px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black text-blue-600 bg-blue-50 rounded-xl shadow-inner min-w-15 justify-center whitespace-nowrap">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-[9px] sm:text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 shadow-sm active:scale-95"
            >
              İLERİ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

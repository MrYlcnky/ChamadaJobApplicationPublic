import React, { useState, useEffect, useCallback, useMemo } from "react";
import { tanimlamalarService } from "../../../services/tanimlamalarService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faGlobe,
  faCity,
  faMapSigns,
  faLanguage,
  faPassport,
  faIdCard,
  faShieldAlt,
  faFilter,
  faTimes,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import KvkkModal from "./UserManagementModals/KvkkModal";
import KvkkTable from "./UserManagementTable/KvkkTable";
import FormDefinitionsHeader from "./UserManagementTable/FormDefinitionsHeader";
import FormDefinitionsFooter from "./UserManagementTable/FormDefinitionsFooter";
import SimpleTable from "./UserManagementTable/SimpleTable";
import DistrictTable from "./UserManagementTable/DistrictTable";
import LocationTable from "./UserManagementTable/LocationTable";
import { useFormDefinitionsCRUD } from "./UserManagementTable/useFormDefinitionsCRUD";

export default function FormDefinitions() {
  const [activeTab, setActiveTab] = useState("uyruk");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //kvkk modal
  const [kvkkModalOpen, setKvkkModalOpen] = useState(false);
  const [selectedKvkk, setSelectedKvkk] = useState(null);

  // Filtreleme State'leri
  const [filterUlkeId, setFilterUlkeId] = useState(""); // Ülke filtresi
  const [filterSehirId, setFilterSehirId] = useState(""); // Şehir filtresi

  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lookups, setLookups] = useState({ ulkeler: [], sehirler: [] });

  const upperCaseTabs = [
    "uyruk",
    "ulke",
    "sehir",
    "ilce",
    "dil",
    "ehliyet",
    "kktc",
  ];

  const tabs = [
    {
      id: "uyruk",
      name: "Uyruklar",
      single: "Uyruk",
      icon: faPassport,
      key: "UyrukAdi",
    },
    {
      id: "ulke",
      name: "Ülkeler",
      single: "Ülke",
      icon: faGlobe,
      key: "UlkeAdi",
    },
    {
      id: "sehir",
      name: "Şehirler",
      single: "Şehir",
      icon: faCity,
      key: "SehirAdi",
    },
    {
      id: "ilce",
      name: "İlçeler",
      single: "İlçe",
      icon: faMapSigns,
      key: "IlceAdi",
    },
    {
      id: "dil",
      name: "Yabancı Diller",
      single: "Dil",
      icon: faLanguage,
      key: "DilAdi",
    },
    {
      id: "kktc",
      name: "KKTC Belgeleri",
      single: "Belge",
      icon: faIdCard,
      key: "BelgeAdi",
    },
    {
      id: "ehliyet",
      name: "Ehliyet Türleri",
      single: "Ehliyet",
      icon: faIdCard,
      key: "EhliyetTuruAdi",
    },
    {
      id: "kvkk",
      name: "KVKK Metinleri",
      single: "KVKK",
      icon: faShieldAlt,
      key: "KvkkVersiyon",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  const getValue = useCallback(
    (item, key) => {
      if (!item) return "-";
      if (item[key] !== undefined) return item[key];
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      if (item[camelKey] !== undefined) return item[camelKey];
      if (activeTab === "kktc" && item["belgeAdi"]) return item["belgeAdi"];
      return "-";
    },
    [activeTab],
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case "uyruk":
          res = await tanimlamalarService.getUyruklar();
          break;
        case "ulke":
          res = await tanimlamalarService.getUlkeler();
          break;
        case "sehir":
          res = await tanimlamalarService.getSehirler();
          break;
        case "ilce":
          res = await tanimlamalarService.getIlceler();
          break;
        case "dil":
          res = await tanimlamalarService.getDiller();
          break;
        case "kktc":
          res = await tanimlamalarService.getKktcBelgeler();
          break;
        case "ehliyet":
          res = await tanimlamalarService.getEhliyetTurleri();
          break;
        case "kvkk":
          res = await tanimlamalarService.getKvkkList();
          break;
        default:
          res = { success: false };
      }
      if (res && res.success) setList(res.data || []);
      else setList([]);
    } catch {
      toast.error("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchList();
    setFilterUlkeId("");
    setFilterSehirId("");
    setSearchTerm("");
    setCurrentPage(1);
  }, [fetchList, activeTab]);

  const fetchLookups = useCallback(async () => {
    try {
      const resUlke = await tanimlamalarService.getUlkeler();
      const resSehir = await tanimlamalarService.getSehirler();
      setLookups({
        ulkeler: resUlke.success ? resUlke.data || [] : [],
        sehirler: resSehir.success ? resSehir.data || [] : [],
      });
    } catch (err) {
      console.error("Lookups çekilemedi:", err);
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const { handleAdd, handleEdit, handleDelete } = useFormDefinitionsCRUD({
    activeTab,
    list,
    lookups,
    currentTab,
    upperCaseTabs,
    fetchList,
    fetchLookups,
    setKvkkModalOpen,
    setSelectedKvkk,
    getValue,
  });

  const requestSort = (key) =>
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });

  const processedList = useMemo(() => {
    let filtered = list.filter((item) =>
      (getValue(item, currentTab.key) || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    // Filtreleme Mantığı
    if (activeTab === "uyruk" || activeTab === "sehir") {
      if (filterUlkeId) {
        filtered = filtered.filter(
          (i) => (i.UlkeId || i.ulkeId) === parseInt(filterUlkeId),
        );
      }
    } else if (activeTab === "ilce") {
      // Önce seçili ülke varsa, o ülkeye ait tüm ilçeleri getir (Şehir filtresinden bağımsız)
      if (filterUlkeId) {
        // İlçe nesnesi içindeki Şehir bilgisini bulup onun UlkeId'sine bakıyoruz
        filtered = filtered.filter((i) => {
          const sehir = lookups.sehirler.find(
            (s) => s.id === (i.SehirId || i.sehirId),
          );
          return (
            sehir && (sehir.UlkeId || sehir.ulkeId) === parseInt(filterUlkeId)
          );
        });
      }
      // Eğer spesifik bir şehir de seçildiyse ona göre daralt
      if (filterSehirId) {
        filtered = filtered.filter(
          (i) => (i.SehirId || i.sehirId) === parseInt(filterSehirId),
        );
      }
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA =
          sortConfig.key === "name" ? getValue(a, currentTab.key) : a.id;
        let valB =
          sortConfig.key === "name" ? getValue(b, currentTab.key) : b.id;
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        return valA < valB
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : sortConfig.direction === "asc"
            ? 1
            : -1;
      });
    }
    return filtered;
  }, [
    list,
    searchTerm,
    sortConfig,
    currentTab,
    filterUlkeId,
    filterSehirId,
    activeTab,
    lookups.sehirler,
    getValue,
  ]);

  const paginatedList = processedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(processedList.length / itemsPerPage);

  // Filtre Alanı Componenti
  const filterDropdown = useMemo(() => {
    const commonSelectClass =
      "pl-9 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black uppercase text-gray-500 outline-none focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer appearance-none min-w-[180px]";

    if (activeTab === "ilce") {
      return (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {/* Ülke Filtresi */}
          <div className="relative flex items-center w-full sm:flex-1">
            <FontAwesomeIcon
              icon={faGlobe}
              className="absolute left-3 text-gray-400 z-10 text-[10px] sm:text-xs"
            />
            <select
              value={filterUlkeId}
              onChange={(e) => {
                setFilterUlkeId(e.target.value);
                setFilterSehirId("");
              }}
              className={`w-full pl-8 pr-8 py-2 text-[10px] sm:text-xs ${commonSelectClass}`}
            >
              <option value="">TÜM ÜLKELER</option>
              {lookups.ulkeler.map((u) => (
                <option key={u.id || u.Id} value={u.id || u.Id}>
                  {u.UlkeAdi || u.ulkeAdi}
                </option>
              ))}
            </select>
            {filterUlkeId && (
              <button
                onClick={() => {
                  setFilterUlkeId("");
                  setFilterSehirId("");
                }}
                className="absolute right-2 text-rose-500 bg-rose-50 hover:bg-rose-100 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
              </button>
            )}
          </div>

          {/* Bağımlı Şehir Filtresi */}
          <div className="relative flex items-center w-full sm:flex-1">
            <FontAwesomeIcon
              icon={faCity}
              className="absolute left-3 text-gray-400 z-10 text-[10px] sm:text-xs"
            />
            <select
              value={filterSehirId}
              onChange={(e) => setFilterSehirId(e.target.value)}
              className={`w-full pl-8 pr-8 py-2 text-[10px] sm:text-xs ${commonSelectClass}`}
            >
              <option value="">TÜM ŞEHİRLER</option>
              {lookups.sehirler
                .filter(
                  (s) =>
                    !filterUlkeId ||
                    (s.UlkeId || s.ulkeId) === parseInt(filterUlkeId),
                )
                .map((s) => (
                  <option key={s.id || s.Id} value={s.id || s.Id}>
                    {s.SehirAdi || s.sehirAdi}
                  </option>
                ))}
            </select>
            {filterSehirId && (
              <button
                onClick={() => setFilterSehirId("")}
                className="absolute right-2 text-rose-500 bg-rose-50 hover:bg-rose-100 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
              </button>
            )}
          </div>
        </div>
      );
    }

    if (["sehir", "uyruk"].includes(activeTab)) {
      return (
        <div className="relative flex items-center w-full min-w-30">
          <FontAwesomeIcon
            icon={faFilter}
            className="absolute left-3 text-gray-400 z-10 text-[10px] sm:text-xs"
          />
          <select
            value={filterUlkeId}
            onChange={(e) => setFilterUlkeId(e.target.value)}
            className={`w-full pl-8 pr-8 py-2 text-[10px] sm:text-xs ${commonSelectClass}`}
          >
            <option value="">TÜM ÜLKELER</option>
            {lookups.ulkeler.map((u) => (
              <option key={u.id || u.Id} value={u.id || u.Id}>
                {u.UlkeAdi || u.ulkeAdi}
              </option>
            ))}
          </select>
          {filterUlkeId && (
            <button
              onClick={() => setFilterUlkeId("")}
              className="absolute right-2 text-rose-500 bg-rose-50 hover:bg-rose-100 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
            </button>
          )}
        </div>
      );
    }
    return null;
  }, [activeTab, filterUlkeId, filterSehirId, lookups]);

  const isAddDisabled = activeTab === "kvkk" && list.length > 0;

  const renderActionButtons = (item) => (
    <div className="flex justify-end gap-1.5 sm:gap-2">
      {/* Düzenle / İncele Butonu */}
      <button
        onClick={() => handleEdit(item)}
        title={activeTab === "kvkk" ? "İncele / Düzenle" : "Düzenle"}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-90 shrink-0"
      >
        <FontAwesomeIcon
          icon={activeTab === "kvkk" ? faEye : faEdit}
          className="text-[10px] sm:text-xs"
        />
      </button>

      {/* Sil Butonu */}
      <button
        onClick={() => handleDelete(item.id)}
        title="Sil"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 shrink-0"
      >
        <FontAwesomeIcon icon={faTrash} className="text-[10px] sm:text-xs" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 animate-in fade-in duration-500 min-h-screen bg-gray-50/30">
      <FormDefinitionsHeader
        // Header Kısmı
        filterDropdown={filterDropdown}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleAdd={handleAdd}
        isAddDisabled={isAddDisabled}
        currentTabSingleName={currentTab?.single}
        // Sekmeler Kısmı
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tablo Kapsayıcısı - Mobilde köşeler daha yumuşak */}
      <div className="bg-white rounded-2xl sm:rounded-4xl lg:rounded-4xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Tabloların mobilde yatay kaydırılabilmesi için kapsayıcı alan */}
        <div className="overflow-x-auto no-scrollbar w-full">
          {activeTab === "kvkk" ? (
            <KvkkTable
              list={paginatedList}
              loading={loading}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          ) : activeTab === "ilce" ? (
            <DistrictTable
              list={paginatedList}
              loading={loading}
              currentTabKey={currentTab.key}
              lookups={lookups}
              renderButtons={renderActionButtons}
            />
          ) : ["uyruk", "sehir"].includes(activeTab) ? (
            <LocationTable
              list={paginatedList}
              loading={loading}
              currentTabKey={currentTab.key}
              renderButtons={renderActionButtons}
            />
          ) : (
            <SimpleTable
              list={paginatedList}
              loading={loading}
              currentTabKey={currentTab.key}
              renderButtons={renderActionButtons}
            />
          )}
        </div>

        <FormDefinitionsFooter
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={processedList.length}
          totalPages={totalPages}
        />
      </div>

      <KvkkModal
        isOpen={kvkkModalOpen}
        onClose={() => setKvkkModalOpen(false)}
        item={selectedKvkk}
        onSuccess={fetchList}
      />
    </div>
  );
}

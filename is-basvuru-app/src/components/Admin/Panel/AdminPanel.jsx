import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faSpinner,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import ApplicationModal from "./ApplicationModal";
import CVViewModal from "./AdminPanelManagement/CVViewModal";
import AdvancedFilters from "./AdminPanelManagement/AdvancedFilters";
import ApplicationTable, {
  StatusBadge,
  TruncatedList,
} from "./AdminPanelManagement/ApplicationTable";
import { basvuruService } from "../../../services/basvuruService";
import {
  resolveImageUrl,
  calculateAge,
  mapDtoToCvFormat,
  EGITIM_SEVIYELERI,
} from "./AdminPanelManagement/TableUtils";
import {
  TableActionsCell,
  CurrentStageBadge,
} from "./AdminPanelManagement/TableActions";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";

export default function AdminPanel() {
  const [applicationData, setApplicationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageInput, setPageInput] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPanelRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedCvData, setSelectedCvData] = useState(null);
  const initialFilters = {
    branch: "all",
    area: "all",
    department: "all",
    role: "all",
    startDate: "",
    endDate: "",
    ageMin: "",
    ageMax: "",
    gender: "all",
    education: "all",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  // Auth logic
  const auth = useMemo(
    () => JSON.parse(sessionStorage.getItem("authUser")) || null,
    [],
  );
  const roleId = useMemo(
    () =>
      auth?.rolId !== undefined
        ? Number(auth.rolId)
        : Number(auth?.roleId) || null,
    [auth],
  );
  const isIKGroup = useMemo(() => [1, 2, 3, 4].includes(roleId), [roleId]);
  const isGenelMudur = useMemo(() => roleId === 5, [roleId]);
  const isDepartmanMudur = useMemo(() => roleId === 6, [roleId]);
  const isMaliIslerMudur = useMemo(() => roleId === 7, [roleId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("openId");
  const view = searchParams.get("view");

  // Click outside for filter
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lookups = useMemo(() => {
    const extract = (key) =>
      [...new Set(applicationData.flatMap((d) => d[key] || []))]
        .filter(Boolean)
        .sort();
    return {
      subeler: extract("branches"),
      alanlar: extract("areas"),
      departmanlar: extract("departments"),
      pozisyonlar: extract("roles"),
    };
  }, [applicationData]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await basvuruService.getAll();
      const rawData = response?.data || response?.data?.data || response || [];
      const actualList = Array.isArray(rawData) ? rawData : rawData.data || [];
      const mappedData = actualList.map((item) => {
        const p = item.personel || item.Personel || {};
        const kisisel = p.kisiselBilgiler || p.KisiselBilgiler || {};
        const detay = p.isBasvuruDetay || p.IsBasvuruDetay || {};
        return {
          id: item.id || item.Id,
          personelId: item.personelId || p.id || p.Id,
          ad: kisisel.ad || kisisel.Ad || p.ad || p.Ad || "-",
          soyad: kisisel.soyad || kisisel.Soyad || p.soyad || p.Soyad || "-",
          statusId: Number(item.basvuruDurum ?? item.BasvuruDurum),
          approvalStage: Number(
            item.basvuruOnayAsamasi ?? item.BasvuruOnayAsamasi,
          ),
          personal: {
            foto: resolveImageUrl(kisisel.vesikalikFotograf || p.fotografYolu),
            birthDate: kisisel.dogumTarihi || kisisel.DogumTarihi,
            genderText:
              (kisisel.cinsiyet || kisisel.Cinsiyet) === 2
                ? "Erkek"
                : (kisisel.cinsiyet || kisisel.Cinsiyet) === 1
                  ? "Kadın"
                  : "Belirsiz",
          },
          date: item.basvuruTarihi || item.BasvuruTarihi,
          status: item.basvuruDurumAdi || item.BasvuruDurumAdi,
          branches:
            (detay.basvuruSubeler || detay.BasvuruSubeler)
              ?.map((s) => s.subeAdi || s.SubeAdi)
              .filter(Boolean) || [],
          areas:
            (detay.basvuruAlanlar || detay.BasvuruAlanlar)
              ?.map((a) => a.alanAdi || a.AlanAdi)
              .filter(Boolean) || [],
          departments:
            (detay.basvuruDepartmanlar || detay.BasvuruDepartmanlar)
              ?.map((d) => d.departmanAdi || d.DepartmanAdi)
              .filter(Boolean) || [],
          roles:
            (detay.basvuruPozisyonlar || detay.BasvuruPozisyonlar)
              ?.map((p) => p.pozisyonAdi || p.PozisyonAdi)
              .filter(Boolean) || [],
          educations: (p.egitimBilgileri || p.EgitimBilgileri || [])
            .map(
              (e) =>
                EGITIM_SEVIYELERI[e.egitimSeviyesi || e.EgitimSeviyesi] ||
                e.egitimSeviyesiAdi ||
                null,
            )
            .filter(Boolean),
          originalData: item,
        };
      });
      setApplicationData(mappedData);
    } catch {
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- BİLDİRİM YÖNLENDİRME MANTIĞI ---
  useEffect(() => {
    // 1. Durum: URL'de openId varsa ve veriler yüklendiyse
    if (openId && applicationData.length > 0) {
      const targetRow = applicationData.find(
        (item) => String(item.id) === String(openId),
      );

      if (targetRow) {
        setActiveRow(targetRow); // Satırı seç
        setOpenModal(true); // Modalı aç

        // İşlem bitince URL'i temizle (sayfa yenilenince tekrar açılmasın)
        const newParams = new URLSearchParams(searchParams); // Mevcut URL'in bir kopyasını al
        newParams.delete("openId");
        setSearchParams(newParams, { replace: true });
      }
    }

    // 2. Durum: URL'de view=pending varsa (Tümünü Gör'e tıklandığında)
    if (view === "pending") {
      setTab("pending"); // Otomatik olarak "SÜREÇTE" sekmesine geç

      // URL'i temizle
      searchParams.delete("view");
      setSearchParams(searchParams, { replace: true });
    }
  }, [openId, view, applicationData, setSearchParams, searchParams]);

  const handleSendToDepartment = useCallback(
    async (id) => {
      const row = applicationData.find((item) => item.id === id);

      // Güvenlik kontrolü: row bulunamazsa işlemi durdur
      if (!row) return;

      const result = await Swal.fire({
        title: "Sevk Et",
        text: "Departman onayına sevk edilsin mi?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
      });

      if (result.isConfirmed) {
        try {
          await basvuruService.updateStatus({
            id,
            personelId:
              row.originalData?.personelId || row.originalData?.personel?.id,
            basvuruDurum: 2,
            basvuruOnayAsamasi: 2,
            islemAciklama: "İK Ön Değerlendirme sonucu sevk edildi.",
          });
          toast.success("Sevk edildi.");
          fetchData(); // fetchData zaten useCallback ile sarmalanmış olmalı
        } catch {
          toast.error("Hata oluştu.");
        }
      }
    },
    [applicationData, fetchData],
  ); // Fonksiyon sadece veri veya çekme fonksiyonu değişirse güncellenir

  const filteredData = useMemo(() => {
    let data = [...applicationData];

    // --- MÜDÜR YETKİ FİLTRESİ (Takip Mekanizması) ---
    if (roleId !== null && !isIKGroup) {
      if (isDepartmanMudur) {
        data = data.filter((app) => {
          const isFollowableStage = Number(app.approvalStage) >= 2;
          const userSubeId = auth?.subeId ? Number(auth.subeId) : null;
          const userMasterDeptId = auth?.masterDepartmanId
            ? Number(auth.masterDepartmanId)
            : null;

          if (userSubeId === null || userMasterDeptId === null) return false;

          // ✅ DM Veri Okuma (Sağlamlaştırıldı)
          const p = app.originalData?.personel || app.originalData?.Personel;
          const detay = p?.isBasvuruDetay || p?.IsBasvuruDetay;

          const appSubeler =
            detay?.basvuruSubeler || detay?.BasvuruSubeler || [];
          const isMyBranch = appSubeler.some(
            (s) => Number(s.subeId || s.SubeId || s.id || s.Id) === userSubeId,
          );

          const appDepartmanlar =
            detay?.basvuruDepartmanlar || detay?.BasvuruDepartmanlar || [];
          const isMyDept = appDepartmanlar.some(
            (d) =>
              Number(d.masterDepartmanId || d.MasterDepartmanId) ===
              userMasterDeptId,
          );

          return isFollowableStage && isMyBranch && isMyDept;
        });
      } else if (isGenelMudur) {
        data = data.filter((app) => {
          const isFollowableStage = Number(app.approvalStage) >= 4;
          const userSubeId = auth?.subeId ? Number(auth.subeId) : null;
          if (userSubeId === null) return false;

          const p = app.originalData?.personel || app.originalData?.Personel;
          const detay = p?.isBasvuruDetay || p?.IsBasvuruDetay;

          const appSubeler =
            detay?.basvuruSubeler || detay?.BasvuruSubeler || [];
          const isMyBranch = appSubeler.some(
            (s) => Number(s.subeId || s.SubeId || s.id || s.Id) === userSubeId,
          );

          return isFollowableStage && isMyBranch;
        });
      } else if (isMaliIslerMudur) {
        // MALİ İŞLER MÜDÜRÜ)
        data = data.filter((app) => {
          // Mali İşler Müdürü sadece 5 (Kendi Bekleyen) ve 6 (Tamamlandı) aşamalarını görür
          const isFollowableStage = Number(app.approvalStage) >= 5;

          const userSubeId = auth?.subeId ? Number(auth.subeId) : null;
          if (userSubeId === null) return false;

          const p = app.originalData?.personel || app.originalData?.Personel;
          const detay = p?.isBasvuruDetay || p?.IsBasvuruDetay;

          const appSubeler =
            detay?.basvuruSubeler || detay?.BasvuruSubeler || [];
          const isMyBranch = appSubeler.some(
            (s) => Number(s.subeId || s.SubeId || s.id || s.Id) === userSubeId,
          );

          return isFollowableStage && isMyBranch;
        });
      }
    }

    // --- TAB (SEKME) FİLTRESİ ---
    if (tab !== "all") {
      const statusMap = {
        new: [1],
        pending: [2, 5],
        approved: [3],
        rejected: [4],
        revision: [5],
      };
      data = data.filter((row) => statusMap[tab]?.includes(row.statusId));
    }

    // --- GELİŞMİŞ FİLTRELEME ---
    const {
      branch,
      area,
      department,
      role,
      startDate,
      endDate,
      ageMin,
      ageMax,
      gender,
      education,
    } = activeFilters;

    if (branch !== "all")
      data = data.filter((r) => r.branches.includes(branch));
    if (area !== "all") data = data.filter((r) => r.areas.includes(area));
    if (department !== "all")
      data = data.filter((r) => r.departments.includes(department));
    if (role !== "all") data = data.filter((r) => r.roles.includes(role));
    if (startDate)
      data = data.filter((r) => new Date(r.date) >= new Date(startDate));
    if (endDate)
      data = data.filter((r) => new Date(r.date) <= new Date(endDate));
    if (gender !== "all")
      data = data.filter((r) => r.personal.genderText === gender);

    if (education !== "all")
      data = data.filter((r) =>
        r.educations.some(
          (e) => String(e).toLowerCase() === String(education).toLowerCase(),
        ),
      );

    if (ageMin || ageMax) {
      data = data.filter((r) => {
        const age = calculateAge(r.personal.birthDate);
        return (
          (!ageMin || age >= Number(ageMin)) &&
          (!ageMax || age <= Number(ageMax))
        );
      });
    }

    return data;
  }, [
    applicationData,
    tab,
    activeFilters,
    isIKGroup,
    isDepartmanMudur,
    isGenelMudur,
    isMaliIslerMudur,
    roleId,
    auth,
  ]);

  const columns = useMemo(
    () => [
      {
        // accessorKey olarak 'id' bırakıyoruz ki sıralama (sorting) Başvuru No'ya göre çalışmaya devam etsin
        accessorKey: "id",
        header: "NO / ID",
        size: 60,
        cell: ({ row }) => (
          <div className="flex flex-col items-start gap-1">
            {/* Üstte Başvuru No */}
            <div className="font-black text-gray-900 text-[11px] leading-none">
              #{row.original.id}
            </div>

            {/* Altta Personel ID - Daha küçük ve rozet tarzında */}
            <div className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 flex items-center gap-1">
              <span className="opacity-50">P-ID:</span>
              <span>{row.original.personelId}</span>
            </div>
          </div>
        ),
      },
      {
        id: "profile",
        header: "PROFİL",
        size: 70,
        cell: ({ row }) => {
          const imgUrl = row.original.personal?.foto;
          return (
            <div className="flex justify-center">
              <div
                className={`w-9 h-9 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center relative ${imgUrl ? "cursor-zoom-in" : ""}`}
                onClick={() => imgUrl && setLightboxImage(imgUrl)}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="text-gray-300 bg-gray-50 flex w-full h-full items-center justify-center">
                    <FontAwesomeIcon icon={faUser} size="sm" />
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "ad",
        header: "AD",
        cell: (i) => (
          <div className="font-bold text-gray-700 text-[11px] uppercase">
            {i.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "soyad",
        header: "SOYAD",
        cell: (i) => (
          <div className="font-bold text-gray-700 text-[11px] uppercase">
            {i.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "branches",
        header: "ŞUBELER",
        cell: (i) => (
          <TruncatedList
            items={i.getValue()}
            colorClass="bg-blue-50 text-blue-700 border-blue-100"
          />
        ),
      },
      {
        accessorKey: "areas",
        header: "ALANLAR",
        cell: (i) => (
          <TruncatedList
            items={i.getValue()}
            colorClass="bg-indigo-50 text-indigo-700 border-indigo-100"
          />
        ),
      },
      {
        accessorKey: "departments",
        header: "DEPARTMANLAR",
        cell: (i) => (
          <TruncatedList
            items={i.getValue()}
            colorClass="bg-purple-50 text-purple-700 border-purple-100"
          />
        ),
      },
      {
        accessorKey: "roles",
        header: "POZİSYONLAR",
        cell: (i) => (
          <TruncatedList
            items={i.getValue()}
            colorClass="bg-amber-50 text-amber-700 border-amber-100"
          />
        ),
      },
      {
        accessorKey: "date",
        header: "TARİH",
        cell: (i) => (
          <div className="text-[10px] text-gray-500 font-bold">
            {formatDate(i.getValue())}
          </div>
        ),
      },
      {
        id: "status",
        header: "DURUM",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge
              status={row.original.status}
              statusId={row.original.statusId}
            />
          </div>
        ),
      },
      {
        id: "stage",
        header: "AŞAMA",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <CurrentStageBadge
              stage={row.original.approvalStage}
              statusId={row.original.statusId}
            />
          </div>
        ),
      },
      {
        id: "actions",
        header: "İŞLEMLER",
        cell: ({ row }) => (
          <TableActionsCell
            row={row}
            isIKGroup={isIKGroup}
            onViewCv={(data) => {
              setSelectedCvData(mapDtoToCvFormat(data.originalData));
              setShowCvModal(true);
            }}
            onSendToDept={handleSendToDepartment}
            onOpenDetail={(data) => {
              setActiveRow(data);
              setOpenModal(true);
            }}
          />
        ),
      },
    ],
    [
      isIKGroup,
      handleSendToDepartment,
      setSelectedCvData,
      setShowCvModal,
      setActiveRow,
      setOpenModal,
      setLightboxImage,
    ],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex } = table.getState().pagination;
  useEffect(() => {
    setPageInput(pageIndex + 1);
  }, [pageIndex]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          className="text-blue-600"
        />
      </div>
    );

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-4 min-h-screen bg-gray-50/50 font-sans">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
        {/* Üst Başlık ve Sekmeler Alanı */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="w-full lg:w-auto">
            <h1 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight uppercase">
              BAŞVURU YÖNETİMİ
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                TOPLAM{" "}
                <span className="text-sky-600">{filteredData.length}</span>{" "}
                BAŞVURU
              </p>
            </div>
          </div>

          {/* Sekmeler (Tablar) - Mobilde parmakla kaydırılabilir (horizontal scroll) */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap shadow-inner">
            {[
              { id: "all", label: "TÜMÜ" },
              { id: "new", label: "YENİ" },
              { id: "pending", label: "SÜREÇTE" },
              { id: "revision", label: "REVİZE" },
              { id: "approved", label: "ONAYLI" },
              { id: "rejected", label: "RED" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 lg:flex-none px-3 py-2 text-[10px] font-black rounded-lg transition-all duration-200 ${
                  tab === t.id
                    ? "bg-white shadow-sm text-blue-600 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arama ve Gelişmiş Filtre Satırı */}
        <div className="flex flex-row gap-2 relative">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            />
            <input
              type="text"
              placeholder="İsim veya ID ile hızlı ara..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-xs font-bold transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filtre Butonu */}
          <div className="relative" ref={filterPanelRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-full px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isFilterOpen ||
                JSON.stringify(activeFilters) !== JSON.stringify(initialFilters)
                  ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={faSliders} />
              <span className="hidden sm:inline">Gelişmiş Filtre</span>
            </button>

            {/* Filtre Dropdown Paneli - Mobilde ekranı kaplamaması için genişlik ayarı yapıldı */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 z-60 w-[calc(100vw-2rem)] sm:w-80 md:w-96 shadow-2xl">
                <AdvancedFilters
                  filters={filters}
                  lookups={lookups}
                  onFilterChange={(e) =>
                    setFilters({ ...filters, [e.target.name]: e.target.value })
                  }
                  onApply={() => {
                    setActiveFilters(filters);
                    setIsFilterOpen(false);
                  }}
                  onClear={() => {
                    setFilters(initialFilters);
                    setActiveFilters(initialFilters);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablo Konteynırı */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <ApplicationTable
          table={table}
          pageInput={pageInput}
          setPageInput={setPageInput}
          handleGoToPage={(e) => {
            if (e.key === "Enter") {
              const p = pageInput ? Number(pageInput) - 1 : 0;
              if (p >= 0 && p < table.getPageCount()) table.setPageIndex(p);
              else setPageInput(table.getState().pagination.pageIndex + 1);
            }
          }}
        />
      </div>

      {/* Modallar (Detay, CV ve Resim Önizleme) */}
      {openModal && activeRow && (
        <ApplicationModal
          data={{
            ...mapDtoToCvFormat(activeRow.originalData),
            id: activeRow.id,
            date: activeRow.date,
            status: activeRow.status,
            originalData: activeRow.originalData,
            approvalStage: activeRow.approvalStage,
            statusId: activeRow.statusId,
          }}
          auth={auth}
          onClose={() => {
            setOpenModal(false);
            setActiveRow(null);
          }}
          onAction={fetchData}
        />
      )}

      {showCvModal && selectedCvData && (
        <CVViewModal
          applicationData={selectedCvData}
          onClose={() => {
            setShowCvModal(false);
            setSelectedCvData(null);
          }}
        />
      )}

      {/* Lightbox - Resim Önizleme */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border-4 border-white/10 object-contain"
            alt=""
          />
          <button className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl p-2 transition-colors">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </div>
  );
}

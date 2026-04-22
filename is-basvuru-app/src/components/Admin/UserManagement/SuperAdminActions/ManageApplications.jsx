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
  faChevronLeft,
  faChevronRight,
  faListOl,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ManageApplications() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  // Sayfalama (Pagination) stateleri
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [pageInput, setPageInput] = useState(1);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await basvuruService.getAll();

      if (res && res.success) {
        const actualArray = res.data || [];

        // Tablonun arama ve sıralama yapabilmesi için veriyi temiz bir formata çeviriyoruz
        const mappedData = actualArray.map((item) => {
          const ad = item.personel?.ad || item.personel?.adi || "";
          const soyad = item.personel?.soyad || item.personel?.soyadi || "";
          return {
            id: item.id,
            personelId: item.personelId || item.personel?.id,
            tamAd: `${ad} ${soyad}`.trim() || "İSİMSİZ KAYIT",
            basvuruTarihi: item.basvuruTarihi,
            originalData: item,
          };
        });

        setList(mappedData);
      }
    } catch {
      toast.error("Başvuru listesi yüklenemedi.");
      setList([]);
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

  // --- TABLO SÜTUNLARI (COLUMNS) ---
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "BAŞVURU NO",
        cell: ({ row }) => (
          <span className="text-[10px] sm:text-[11px] font-black text-emerald-600 font-mono bg-emerald-50/50 px-2 sm:px-3 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
            #{row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "tamAd",
        header: "ADAY BİLGİLERİ",
        cell: ({ row }) => (
          <div className="flex flex-col min-w-35 sm:min-w-0">
            <span className="text-xs sm:text-sm font-black text-gray-800 uppercase italic leading-tight">
              {row.original.tamAd}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 tracking-tight">
              PERSONEL ID:{" "}
              <span className="text-gray-500 font-mono">
                #{row.original.personelId}
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "basvuruTarihi",
        header: "BAŞVURU TARİHİ",
        cell: ({ row }) => (
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 whitespace-nowrap">
            {new Date(row.original.basvuruTarihi).toLocaleDateString("tr-TR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">EYLEMLER</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <button
              onClick={() => handleDelete(row.original.id, row.original.tamAd)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 border border-rose-100 shrink-0 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  // --- TANSTACK TABLE KURULUMU ---
  const table = useReactTable({
    data: list,
    columns,
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Sayfa numarası inputu ile table state'ini senkronize et
  const { pageIndex } = table.getState().pagination;
  useEffect(() => {
    setPageInput(pageIndex + 1);
  }, [pageIndex]);

  const handleGoToPage = () => {
    const page = pageInput ? Number(pageInput) - 1 : 0;
    if (page >= 0 && page < table.getPageCount()) table.setPageIndex(page);
    else setPageInput(table.getState().pagination.pageIndex + 1);
  };

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
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm outline-none focus:ring-4 focus:ring-rose-50 transition-all font-bold placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Tablo Konteynırı */}
      <div className="bg-white rounded-2xl sm:rounded-4xl md:rounded-4xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-4 sm:py-5 sm:px-6 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-16 sm:p-20 text-center animate-pulse text-rose-600 font-black text-xs sm:text-sm"
                  >
                    VERİLER YÜKLENİYOR...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-16 sm:p-20 text-center text-xs font-black text-gray-300 uppercase tracking-widest"
                  >
                    Kayıt Bulunamadı
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-rose-50/20 transition-all group border-l-4 border-l-transparent hover:border-l-rose-500"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-3 px-4 sm:py-5 sm:px-6 align-middle whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- DATATABLE SAYFALAMA (PAGINATION) BÖLÜMÜ --- */}
        {!loading && list.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Toplam <span className="text-rose-600">{list.length}</span>{" "}
                Kayıt
              </span>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <FontAwesomeIcon
                  icon={faListOl}
                  className="text-gray-300 text-[10px]"
                />
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="bg-transparent text-[10px] font-black text-gray-500 uppercase outline-none cursor-pointer"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className="flex-1 md:flex-none w-9 h-9 border border-gray-100 rounded-xl flex items-center justify-center bg-white hover:bg-rose-600 hover:text-white disabled:opacity-30 transition-all shadow-sm active:scale-90"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>

              <div className="flex items-center bg-gray-50 rounded-xl px-2 h-9 border border-gray-200 shadow-inner">
                <input
                  type="number"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
                  className="w-8 text-center text-xs font-bold bg-transparent border-none focus:ring-0 text-gray-700"
                />
                <span className="text-[10px] font-black text-gray-400 mr-1">
                  / {table.getPageCount() || 1}
                </span>
                <button
                  onClick={handleGoToPage}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-rose-600 shadow-sm border border-gray-100 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px]"
                  />
                </button>
              </div>

              <button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                className="flex-1 md:flex-none w-9 h-9 border border-gray-100 rounded-xl flex items-center justify-center bg-white hover:bg-rose-600 hover:text-white disabled:opacity-30 transition-all shadow-sm active:scale-90"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Yasal Uyarı */}
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

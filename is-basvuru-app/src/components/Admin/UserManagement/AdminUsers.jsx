import React, { useEffect, useState, useMemo, useCallback } from "react";
import { panelUserService } from "../../../services/panelUserService";
import { tanimlamalarService } from "../../../services/tanimlamalarService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  faTrash,
  faPlus,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faSort,
  faSortUp,
  faSortDown,
  faArrowLeft,
  faArrowRight,
  faXmark,
  faEdit,
  faFilter,
  faEraser,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createAdminUsersSchema } from "../../../schemas/AdminUsersSchema";
import { getAuthUser } from "../../../auth/session";

const FormItem = ({ label, children, required }) => (
  <div>
    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pageInput, setPageInput] = useState(1);
  const [columnFilters, setColumnFilters] = useState([]);

  const [lookups, setLookups] = useState({
    subeler: [],
    alanlar: [],
    departmanlar: [],
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roles = [
    { id: 1, name: "SuperAdmin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "IkAdmin" },
    { id: 4, name: "Ik" },
    { id: 5, name: "GenelMudur" },
    { id: 6, name: "DepartmanMudur" },
  ];

  const authUser = getAuthUser();
  const currentUserRole = authUser?.userInfo?.rolAdi || authUser?.rolAdi || "";
  const availableRoles = useMemo(() => {
    if (currentUserRole !== "SuperAdmin") {
      // id: 1 olan (SuperAdmin) rolünü listeden çıkarıyoruz
      return roles.filter((r) => r.id !== 1);
    }
    // Kullanıcı SuperAdmin ise hepsini görebilir
    return roles;
  }, [currentUserRole, roles]);

  const currentUserHierarchy = useMemo(() => {
    const roleObj = roles.find((r) => r.name === currentUserRole);
    return roleObj ? roleObj.id : 99;
  }, [currentUserRole, roles]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, subeRes, alanRes, depRes] = await Promise.all([
        panelUserService.getAll(),
        tanimlamalarService.getSubeler(),
        tanimlamalarService.getMasterAlanlar(),
        tanimlamalarService.getMasterDepartmanlar(),
      ]);
      if (userRes.success) setUsers(userRes.data);
      setLookups({
        subeler: subeRes.data || [],
        alanlar: alanRes.data || [],
        departmanlar: depRes.data || [],
      });
    } catch {
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
  };

  const setFilter = (columnId, value) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const initialForm = {
    id: null,
    kullaniciAdi: "",
    adi: "",
    soyadi: "",
    kullaniciSifre: "",
    rolId: 2,
    subeId: "",
    masterAlanId: "",
    masterDepartmanId: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Zod Doğrulaması (İstediğin temada hata gösterimi)
    const schema = createAdminUsersSchema(isEditing);
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    try {
      // 2. Payload Hazırlığı (Büyük/Küçük harf değişimi yapılmaz, backend halleder)
      const payload = {
        ...formData,
        rolId: Number(formData.rolId),
        subeId: formData.subeId ? Number(formData.subeId) : null,
        masterAlanId: formData.masterAlanId
          ? Number(formData.masterAlanId)
          : null,
        masterDepartmanId: formData.masterDepartmanId
          ? Number(formData.masterDepartmanId)
          : null,
      };

      let res = isEditing
        ? await panelUserService.update(payload)
        : await panelUserService.create(payload);

      if (res.success) {
        toast.success("İşlem başarılı.");
        handleCloseModal();
        fetchData();
      } else {
        toast.error(res.message || "İşlem başarısız.");
      }
    } catch {
      toast.error("Hata oluştu.");
    }
  };

  const handleDelete = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sil",
      cancelButtonText: "İptal",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      const res = await panelUserService.delete(id);
      if (res.success) {
        toast.success("Kullanıcı silindi.");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    }
  }, []);

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      kullaniciAdi: user.kullaniciAdi,
      adi: user.adi,
      soyadi: user.soyadi,
      kullaniciSifre: "",
      rolId: user.rolId,
      subeId: user.subeId || "",
      masterAlanId: user.masterAlanId || "",
      masterDepartmanId: user.masterDepartmanId || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData(initialForm);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "adi",
        header: "Ad Soyad",
        cell: (i) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">
              {i.row.original.adi} {i.row.original.soyadi}
            </span>
            <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 w-fit border border-blue-100">
              @{i.row.original.kullaniciAdi}{" "}
              <span className="text-gray-400 mx-1">|</span> ID:{" "}
              {i.row.original.id}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "subeAdi",
        header: "Şube",
        cell: (i) => (
          <div className="text-xs text-gray-700">{i.getValue() || "-"}</div>
        ),
      },
      {
        accessorKey: "masterAlanAdi",
        header: "Alan",
        cell: (i) => (
          <div className="text-xs text-gray-700">{i.getValue() || "-"}</div>
        ),
      },
      {
        accessorKey: "masterDepartmanAdi",
        header: "Departman",
        cell: (i) => (
          <div className="text-xs text-gray-700">{i.getValue() || "-"}</div>
        ),
      },
      {
        accessorKey: "rolAdi",
        header: "Rol",
        cell: (i) => (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-white shadow-sm text-indigo-600 border-indigo-100 italic">
            {i.getValue()}
          </span>
        ),
        filterFn: (row, columnId, filterValue) => {
          const rowValue = row.getValue(columnId);
          if (!rowValue) return false;

          return (
            rowValue.toString().toLowerCase() ===
            filterValue.toString().toLowerCase()
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">İşlemler</div>,
        cell: (i) => {
          const targetRoleName = i.row.original.rolAdi;
          const targetRoleObj = roles.find((r) => r.name === targetRoleName);
          const targetHierarchy = targetRoleObj ? targetRoleObj.id : 99;

          const hasPermission = currentUserHierarchy <= targetHierarchy;

          return (
            <div className="flex gap-1 justify-end">
              {hasPermission ? (
                <>
                  <button
                    onClick={() => handleEdit(i.row.original)}
                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
                    title="Düzenle"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(i.row.original.id)}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-all"
                    title="Sil"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              ) : (
                <span className="text-[10px] font-bold text-gray-300 px-2 py-1 italic">
                  Yetkisiz İşlem
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [roles, currentUserHierarchy, handleDelete],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleGoToPage = () => {
    const page = pageInput ? Number(pageInput) - 1 : 0;
    if (page >= 0 && page < table.getPageCount()) table.setPageIndex(page);
    else setPageInput(table.getState().pagination.pageIndex + 1);
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-4 min-h-screen bg-gray-50/30">
      {/* Üst Panel */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 border-b-4 border-b-blue-500">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Başlık ve Geri Butonu */}
          <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
            <button
              onClick={() => navigate("/admin/panel")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm border shrink-0 active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1 className="text-lg sm:text-xl font-black text-gray-800 uppercase tracking-tighter truncate">
              Personel <span className="text-blue-600">Yönetimi</span>
            </h1>
          </div>

          {/* Arama, Filtre ve Ekle Butonları */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="relative group w-full sm:flex-1 xl:w-64">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Genel arama..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex-1 sm:flex-none px-4 h-11 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold text-xs ${
                  showFilterPanel
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Filtre</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(initialForm);
                  setShowModal(true);
                }}
                className="flex-2 sm:flex-none bg-blue-600 text-white px-5 h-11 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtre Paneli */}
        {showFilterPanel && (
          <div className="mt-4 pt-4 border-t border-dashed grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Rol
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                value={table.getColumn("rolAdi")?.getFilterValue() || ""}
                onChange={(e) => setFilter("rolAdi", e.target.value)}
              >
                <option value="">Tüm Roller</option>
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Şube
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                value={table.getColumn("subeAdi")?.getFilterValue() || ""}
                onChange={(e) => setFilter("subeAdi", e.target.value)}
              >
                <option value="">Tüm Şubeler</option>
                {lookups.subeler.map((s) => (
                  <option key={s.id} value={s.subeAdi}>
                    {s.subeAdi}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Alan
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                value={table.getColumn("masterAlanAdi")?.getFilterValue() || ""}
                onChange={(e) => setFilter("masterAlanAdi", e.target.value)}
              >
                <option value="">Tüm Alanlar</option>
                {lookups.alanlar.map((a) => (
                  <option key={a.id} value={a.masterAlanAdi}>
                    {a.masterAlanAdi}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Departman
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                value={
                  table.getColumn("masterDepartmanAdi")?.getFilterValue() || ""
                }
                onChange={(e) =>
                  setFilter("masterDepartmanAdi", e.target.value)
                }
              >
                <option value="">Tüm Departmanlar</option>
                {lookups.departmanlar.map((d) => (
                  <option key={d.id} value={d.masterDepartmanAdi}>
                    {d.masterDepartmanAdi}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-100 text-gray-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
              >
                <FontAwesomeIcon icon={faEraser} className="mr-1" /> Temizle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zebra Tablo Kapsayıcısı */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-4 px-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() ? (
                          <FontAwesomeIcon
                            icon={
                              header.column.getIsSorted() === "asc"
                                ? faSortUp
                                : faSortDown
                            }
                            className="text-blue-500"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faSort}
                            className="opacity-10"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/40 transition-colors group`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-3.5 px-5 align-middle text-sm whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {!loading && users.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Toplam <span className="text-blue-600">{users.length}</span>{" "}
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
                className="flex-1 md:flex-none w-9 h-9 border border-gray-100 rounded-xl flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm active:scale-90"
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
                  / {table.getPageCount()}
                </span>
                <button
                  onClick={handleGoToPage}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm border border-gray-100 hover:bg-blue-600 hover:text-white transition-all"
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
                className="flex-1 md:flex-none w-9 h-9 border border-gray-100 rounded-xl flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm active:scale-90"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Personel Formu */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-100 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] shadow-2xl overflow-hidden border border-gray-100 flex flex-col transform animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 sm:px-8 py-5 sm:py-6 border-b flex items-center justify-between shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tighter uppercase">
                {isEditing ? "Personeli Güncelle" : "Yeni Personel"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-gray-200 active:scale-90"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormItem label="Adı" required>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={formData.adi}
                    onChange={(e) =>
                      setFormData({ ...formData, adi: e.target.value })
                    }
                  />
                </FormItem>
                <FormItem label="Soyadı" required>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={formData.soyadi}
                    onChange={(e) =>
                      setFormData({ ...formData, soyadi: e.target.value })
                    }
                  />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormItem label="Kullanıcı Adı" required>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={formData.kullaniciAdi}
                    onChange={(e) => {
                      const val = e.target.value.replace(
                        /[^a-zA-Z0-9_\-.]/g,
                        "",
                      );
                      setFormData({ ...formData, kullaniciAdi: val });
                    }}
                  />
                  <p className="text-[9px] text-gray-400 ml-1 italic mt-1 leading-tight">
                    * Sadece harf, rakam ve . - _ kullanılabilir.
                  </p>
                </FormItem>
                <FormItem
                  label={`Şifre ${isEditing ? "(Opsiyonel)" : ""}`}
                  required={!isEditing}
                >
                  <input
                    required={!isEditing}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                    value={formData.kullaniciSifre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kullaniciSifre: e.target.value,
                      })
                    }
                  />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormItem label="Yetki Rolü" required>
                  <select
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.rolId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rolId: parseInt(e.target.value),
                      })
                    }
                  >
                    {availableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </FormItem>
                <FormItem label="Bağlı Şube">
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.subeId}
                    onChange={(e) =>
                      setFormData({ ...formData, subeId: e.target.value })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {lookups.subeler.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.subeAdi}
                      </option>
                    ))}
                  </select>
                </FormItem>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormItem label="Sektörel Alan">
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.masterAlanId}
                    onChange={(e) =>
                      setFormData({ ...formData, masterAlanId: e.target.value })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {lookups.alanlar.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.masterAlanAdi}
                      </option>
                    ))}
                  </select>
                </FormItem>
                <FormItem label="Departman">
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.masterDepartmanId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        masterDepartmanId: e.target.value,
                      })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {lookups.departmanlar.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.masterDepartmanAdi}
                      </option>
                    ))}
                  </select>
                </FormItem>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3.5 text-xs font-black text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest border border-gray-200 active:scale-95"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3.5 text-xs font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

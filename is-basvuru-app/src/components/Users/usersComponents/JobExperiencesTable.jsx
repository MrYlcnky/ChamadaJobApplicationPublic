import { useState, forwardRef, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import JobExperiencesAddModal from "../addModals/JobExperiencesAddModal";
import { formatDate } from "../modalHooks/dateUtils";

const formatMoney = (val) => {
  if (val == null || val === "") return "-";
  const n = Number(String(val).replace(",", "."));
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const JobExperiencesTable = forwardRef(({ definitions }, ref) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const rows = useWatch({ control, name: "experience" }) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const notify = (msg) => toast.success(msg);

  const openCreate = () => {
    setModalMode("create");
    setSelectedRow(null);
    setSelectedIndex(-1);
    setModalOpen(true);
  };

  const openEdit = (row, index) => {
    setModalMode("edit");
    setSelectedRow(row);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = (newData) => {
    // Yeni kayıtlara ID: 0 atıyoruz
    const itemToAdd = { ...newData, id: 0 };
    const updatedList = [...rows, itemToAdd];
    setValue("experience", updatedList, {
      shouldDirty: true,
      shouldValidate: true,
    });
    notify(t("toast.saved"));
    closeModal();
  };

  const handleUpdate = (updatedData) => {
    if (selectedIndex > -1) {
      const updatedList = [...rows];
      // 🔥 KRİTİK DÜZELTME: Mevcut ID'yi koruyoruz
      updatedList[selectedIndex] = {
        ...rows[selectedIndex],
        ...updatedData,
      };
      setValue("experience", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.updated"));
    }
    closeModal();
  };

  const handleDelete = async (row, index) => {
    const res = await Swal.fire({
      title: t("jobExp.confirm.title"),
      text: t("jobExp.confirm.text", {
        company: row.isAdi,
        role: row.pozisyon,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("common.cancel"),
      confirmButtonText: t("common.deleteYes"),
    });

    if (res.isConfirmed) {
      const updatedList = rows.filter((_, i) => i !== index);
      setValue("experience", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.deleted"));
    }
  };

  useImperativeHandle(ref, () => ({ openCreate }));

  return (
    <div className="">
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 ">{t("jobExp.cols.company")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.department")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.position")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.duty")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.salary")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.start")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.end")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.leaveReason")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.country")}</th>
                <th className="px-4 py-3 ">{t("jobExp.cols.city")}</th>
                <th className="px-4 py-3 text-right ">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index} className="bg-white border-t">
                  <td className="px-4 py-3 font-medium truncate">
                    {item.isAdi}
                  </td>
                  <td className="px-4 py-3 truncate">{item.departman}</td>
                  <td className="px-4 py-3 truncate">{item.pozisyon}</td>
                  <td className="px-4 py-3 truncate">{item.gorev}</td>
                  <td className="px-4 py-3 truncate">
                    {formatMoney(item.ucret)}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {formatDate(item.baslangicTarihi)}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {item.halenCalisiyor
                      ? t("jobExp.badges.ongoing")
                      : formatDate(item.bitisTarihi)}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {item.ayrilisSebebi || "-"}
                  </td>

                  {/* Ülke ve Şehir */}
                  <td className="px-4 py-3 truncate">{item.ulkeAdi}</td>
                  <td className="px-4 py-3 truncate">{item.sehirAdi}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item, index)}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item, index)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JobExperiencesAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
        definitions={definitions}
      />
    </div>
  );
});

export default JobExperiencesTable;

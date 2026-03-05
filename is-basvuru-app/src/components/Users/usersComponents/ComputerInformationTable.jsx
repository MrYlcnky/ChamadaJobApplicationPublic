import { useState, forwardRef, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ComputerInformationAddModal from "../addModals/ComputerInformationAddModal";

// Helper: ID -> Text
const getYetkinlikLabel = (val, t) => {
  const map = {
    1: t("computer.levels.veryPoor"),
    2: t("computer.levels.poor"),
    3: t("computer.levels.medium"),
    4: t("computer.levels.good"),
    5: t("computer.levels.veryGood"),
  };
  return map[Number(val)] || val;
};

const ComputerInformationTable = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const rows = useWatch({ control, name: "computer" }) || [];

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

  const handleSave = (newData) => {
    // Yeni kayıtlara ID: 0 atıyoruz
    const itemToAdd = { ...newData, id: 0 };
    const updatedList = [...rows, itemToAdd];
    setValue("computer", updatedList, {
      shouldDirty: true,
      shouldValidate: true,
    });
    notify(t("toast.saved"));
    setModalOpen(false);
  };

  const handleUpdate = (updatedData) => {
    if (selectedIndex > -1) {
      const updatedList = [...rows];
      // 🔥 KRİTİK DÜZELTME: Mevcut ID'yi koruyoruz
      updatedList[selectedIndex] = {
        ...rows[selectedIndex],
        ...updatedData,
      };
      setValue("computer", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.updated"));
    }
    setModalOpen(false);
  };

  const handleDelete = async (row, index) => {
    const res = await Swal.fire({
      title: t("computer.delete.title"),
      text: t("computer.delete.text", { name: row.programAdi }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("actions.delete"),
    });

    if (res.isConfirmed) {
      const updatedList = rows.filter((_, i) => i !== index);
      setValue("computer", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.deleted"));
    }
  };

  useImperativeHandle(ref, () => ({ openCreate }));

  return (
    <div>
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("computer.table.program")}</th>
                <th className="px-4 py-3">{t("computer.table.level")}</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("computer.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => (
                <tr key={idx} className="bg-white border-t table-fixed">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 max-w-35 truncate"
                    title={item.programAdi}
                  >
                    {item.programAdi}
                  </td>

                  <td className="px-4 py-3 text-gray-800 max-w-30 truncate">
                    {getYetkinlikLabel(item.yetkinlik, t)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        title={t("actions.update")}
                        onClick={() => openEdit(item, idx)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => handleDelete(item, idx)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 active:scale-[0.98] transition cursor-pointer"
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

      <ComputerInformationAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

export default ComputerInformationTable;

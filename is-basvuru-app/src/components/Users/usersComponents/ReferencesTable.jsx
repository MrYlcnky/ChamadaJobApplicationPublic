import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReferenceAddModal from "../addModals/ReferenceAddModal";

const ReferencesTable = forwardRef(function ReferencesTable(props, ref) {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const rows = useWatch({ control, name: "references" }) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const notify = (msg) => toast.success(msg);

  const getKurumLabel = (val) => {
    if (String(val) === "1") return t("references.options.inHouse");
    if (String(val) === "2") return t("references.options.external");
    return val;
  };

  const confirmDelete = async (row) => {
    const res = await Swal.fire({
      title: t("references.delete.title"),
      text: t("references.delete.text", {
        first: row.referansAdi,
        last: row.referansSoyadi,
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("common.cancel"),
      confirmButtonText: t("common.deleteYes"),
    });
    return res.isConfirmed;
  };

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
    setValue("references", updatedList, {
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
      setValue("references", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.updated"));
    }
    closeModal();
  };

  const handleDelete = async (row, index) => {
    const isConfirmed = await confirmDelete(row);
    if (isConfirmed) {
      const updatedList = rows.filter((_, i) => i !== index);
      setValue("references", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.deleted"));
    }
  };

  useImperativeHandle(ref, () => ({
    openCreate,
    getData: () => rows,
    fillData: (data) => {
      if (Array.isArray(data)) {
        setValue("references", data);
      }
    },
  }));

  return (
    <div className="">
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm table-fixed">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("references.table.orgType")}</th>
                <th className="px-4 py-3">{t("references.table.firstName")}</th>
                <th className="px-4 py-3">{t("references.table.lastName")}</th>
                <th className="px-4 py-3">{t("references.table.workplace")}</th>
                <th className="px-4 py-3">{t("references.table.role")}</th>
                <th className="px-4 py-3">{t("references.table.phone")}</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => (
                <tr key={idx} className="bg-white border-t table-fixed">
                  <td
                    className="px-4 py-3 font-medium text-gray-800 truncate"
                    title={getKurumLabel(item.calistigiKurum)}
                  >
                    {getKurumLabel(item.calistigiKurum)}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate">
                    {item.referansAdi}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate">
                    {item.referansSoyadi}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate">
                    {item.referansIsYeri}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate">
                    {item.referansGorevi}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate">
                    {item.referansTelefon}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item, idx)}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item, idx)}
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
      <ReferenceAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

export default ReferencesTable;

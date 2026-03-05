import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageAddModal from "../addModals/LanguageAddModal";

const getLevelLabel = (val) => {
  const levels = ["", "A1", "A2", "B1", "B2", "C1", "C2"];
  return levels[Number(val)] || val;
};

const LanguageTable = forwardRef(function LanguageTable({ definitions }, ref) {
  const { t } = useTranslation();

  // --- 1. Context Bağlantısı ---
  const { control, setValue } = useFormContext();
  const rows = useWatch({ control, name: "languages" }) || [];

  // --- 2. Local Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const notify = (msg) => toast.success(msg);

  // --- 3. Actions ---
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
    setValue("languages", updatedList, {
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
      setValue("languages", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.updated"));
    }
    closeModal();
  };

  const handleDelete = async (row, index) => {
    let languageName = row.dilAdiGosterim || row.digerDilAdi || "";

    if (!languageName && row.dilId && definitions?.diller) {
      const found = definitions.diller.find((d) => d.id === row.dilId);
      if (found) languageName = found.dilAdi;
    }

    const res = await Swal.fire({
      title: t("languages.delete.title"),
      text: t("languages.delete.text", { language: languageName }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("common.deleteYes"),
    });

    if (res.isConfirmed) {
      const updatedList = rows.filter((_, i) => i !== index);
      setValue("languages", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.deleted"));
    }
  };

  // --- 4. Expose Methods ---
  useImperativeHandle(ref, () => ({
    openCreate,
    getData: () => rows,
    fillData: (data) => {
      if (Array.isArray(data)) {
        setValue("languages", data);
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
                <th className="px-4 py-3">{t("languages.table.language")}</th>
                <th className="px-4 py-3">{t("languages.table.speaking")}</th>
                <th className="px-4 py-3">{t("languages.table.listening")}</th>
                <th className="px-4 py-3">{t("languages.table.reading")}</th>
                <th className="px-4 py-3">{t("languages.table.writing")}</th>
                <th className="px-4 py-3">{t("languages.table.learnedHow")}</th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("languages.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => {
                let displayLanguage = item.dilAdiGosterim || item.digerDilAdi;
                if (!displayLanguage && item.dilId && definitions?.diller) {
                  const found = definitions.diller.find(
                    (d) => d.id === item.dilId,
                  );
                  if (found) displayLanguage = found.dilAdi;
                }

                return (
                  <tr key={index} className="bg-white border-t">
                    <td
                      className="px-4 py-3 font-medium text-gray-800 max-w-30 truncate"
                      title={displayLanguage}
                    >
                      {displayLanguage}
                    </td>
                    <td className="px-4 py-3 truncate">
                      {getLevelLabel(item.konusma)}
                    </td>
                    <td className="px-4 py-3 truncate">
                      {getLevelLabel(item.dinleme)}
                    </td>
                    <td className="px-4 py-3 truncate">
                      {getLevelLabel(item.okuma)}
                    </td>
                    <td className="px-4 py-3 truncate">
                      {getLevelLabel(item.yazma)}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-50 truncate"
                      title={item.ogrenilenKurum}
                    >
                      {item.ogrenilenKurum}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={t("actions.update")}
                          onClick={() => openEdit(item, index)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 active:scale-[0.98] transition cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          type="button"
                          aria-label={t("actions.delete")}
                          onClick={() => handleDelete(item, index)}
                          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 active:scale-[0.98] transition cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <LanguageAddModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedRow}
        definitions={definitions}
        onClose={closeModal}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </div>
  );
});

export default LanguageTable;

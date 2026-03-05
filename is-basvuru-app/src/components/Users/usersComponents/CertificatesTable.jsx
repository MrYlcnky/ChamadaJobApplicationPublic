import { useState, forwardRef, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CertificatesAddModal from "../addModals/CertificatesAddModal";
import { formatDate } from "../modalHooks/dateUtils";

const CertificateTable = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const rows = useWatch({ control, name: "certificates" }) || [];

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
    setValue("certificates", updatedList, {
      shouldDirty: true,
      shouldValidate: true,
    });
    notify(t("toast.saved"));
    setModalOpen(false);
  };

  const handleUpdate = (updatedData) => {
    if (selectedIndex > -1) {
      const updatedList = [...rows];
      // 🔥 KRİTİK DÜZELTME: Mevcut ID'yi koruyoruz (...rows[selectedIndex])
      updatedList[selectedIndex] = {
        ...rows[selectedIndex],
        ...updatedData,
      };
      setValue("certificates", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.updated"));
    }
    setModalOpen(false);
  };

  const handleDelete = async (row, index) => {
    const res = await Swal.fire({
      title: t("certificates.delete.title"),
      text: t("certificates.delete.text", { name: row.ad, org: row.kurum }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: t("actions.cancel"),
      confirmButtonText: t("actions.delete"),
    });

    if (res.isConfirmed) {
      const updatedList = rows.filter((_, i) => i !== index);
      setValue("certificates", updatedList, {
        shouldDirty: true,
        shouldValidate: true,
      });
      notify(t("toast.deleted"));
    }
  };

  useImperativeHandle(ref, () => ({ openCreate }));

  const dash = t("common.dash");

  return (
    <div>
      {rows.length !== 0 && (
        <div className="overflow-x-auto rounded-b-lg ring-1 ring-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{t("certificates.table.name")}</th>
                <th className="px-4 py-3">{t("certificates.table.org")}</th>
                <th className="px-4 py-3">
                  {t("certificates.table.duration")}
                </th>
                <th className="px-4 py-3">
                  {t("certificates.table.issuedAt")}
                </th>
                <th className="px-4 py-3">
                  {t("certificates.table.validUntil")}
                </th>
                <th className="px-4 py-3 text-right" style={{ width: 110 }}>
                  {t("certificates.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => {
                const issued = formatDate(item.verilisTarihi);
                const valid = item.gecerlilikTarihi
                  ? formatDate(item.gecerlilikTarihi)
                  : dash;

                return (
                  <tr key={idx} className="bg-white border-t table-fixed">
                    <td
                      className="px-4 py-3 font-medium text-gray-800 max-w-35 truncate"
                      title={item.ad}
                    >
                      {item.ad}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-35 truncate"
                      title={item.kurum}
                    >
                      {item.kurum}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-800 max-w-30 truncate"
                      title={item.sure}
                    >
                      {item.sure}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-30 truncate">
                      {issued}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-30 truncate">
                      {valid}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CertificatesAddModal
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

export default CertificateTable;

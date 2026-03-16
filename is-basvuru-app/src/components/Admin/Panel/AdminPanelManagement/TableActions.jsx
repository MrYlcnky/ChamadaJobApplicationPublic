// src/components/Admin/Panel/AdminPanelManagement/TableActions.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faArrowRight,
  faEye,
  faFlagCheckered,
  faUserTie,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

export const TableActionsCell = ({
  row,
  isIKGroup,
  onViewCv,
  onSendToDept,
  onOpenDetail,
}) => (
  <div className="flex items-center justify-center gap-2">
    <button
      onClick={() => onViewCv(row.original)}
      className="p-1.5 text-red-500 hover:text-red-700 transition-colors bg-red-50 rounded shadow-sm border border-red-100"
      title="CV Görüntüle / İndir"
    >
      <FontAwesomeIcon icon={faFilePdf} />
    </button>
    {isIKGroup && row.original.statusId === 1 && (
      <button
        onClick={() => onSendToDept(row.original.id)}
        className="px-2 py-1 bg-amber-500 text-white text-[9px] font-black rounded hover:bg-amber-600 flex items-center gap-1 transition-all uppercase shadow-sm"
        title="Departmana Sevk Et"
      >
        <FontAwesomeIcon icon={faArrowRight} /> Sevk
      </button>
    )}
    <button
      onClick={() => onOpenDetail(row.original)}
      className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 rounded shadow-sm border border-blue-100"
      title="Detayları Gör"
    >
      <FontAwesomeIcon icon={faEye} />
    </button>
  </div>
);

export const CurrentStageBadge = ({ stage, statusId }) => {
  // 1. Durum: Revize Talebi
  if (statusId === 5)
    return (
      <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase bg-orange-500/10 text-orange-600 border-orange-200">
        <FontAwesomeIcon icon={faRotateLeft} className="animate-spin-slow" />{" "}
        REVİZE TALEBİ
      </span>
    );

  // 2. Durum: Süreç Tamamlanmış (Onay veya Red)
  //  Artık süreç 5'te değil, 6'da tamamlanmış sayılıyor!
  if (statusId === 3 || statusId === 4 || stage === 6)
    return (
      <span className="flex items-center justify-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
        <FontAwesomeIcon
          icon={faFlagCheckered}
          className={statusId === 3 ? "text-emerald-500" : "text-rose-500"}
        />{" "}
        {statusId === 3 ? "TAMAMLANDI" : "REDDEDİLDİ"}
      </span>
    );

  // 3. Durum: Aktif Süreç Aşamaları (1-5)
  const stageMap = {
    1: {
      label: "İK SEVK BEKLİYOR",
      color: "text-sky-700 bg-sky-50 border-sky-200",
    },
    2: {
      label: "DEP. ONAYI BEKLİYOR",
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
    3: {
      label: "İK SON KONTROL",
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
    4: {
      label: "GM ONAYI BEKLİYOR",
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    //  5. Aşama (Mali İşler Müdürü)
    5: {
      label: "MİM ONAYI BEKLİYOR",
      color: "text-pink-700 bg-pink-50 border-pink-200",
    },
  };

  const info = stageMap[stage] || {
    label: "BEKLEMEDE",
    color: "text-gray-400 bg-gray-50",
  };

  return (
    <span
      className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase whitespace-nowrap ${info.color}`}
    >
      <FontAwesomeIcon icon={faUserTie} /> {info.label}
    </span>
  );
};

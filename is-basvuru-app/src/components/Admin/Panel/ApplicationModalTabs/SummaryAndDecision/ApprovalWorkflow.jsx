import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faBan,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// 🎯 YENİ: 5. Aşama (Mali İşler Müdürü Onayı) Eklendi
const STAGES = [
  { id: 1, label: "İK Ön Değerlendirme", roleType: "ik" },
  { id: 2, label: "Departman Onayı", roleType: "dm" },
  { id: 3, label: "İK Son Kontrol", roleType: "ik" },
  { id: 4, label: "Genel Müdür Onayı", roleType: "gm" },
  { id: 5, label: "Mali İşler Onayı", roleType: "mim" },
];

export default function ApprovalWorkflow({ currentStageId, statusId }) {
  const isApproved = statusId === 3;
  const isRejected = statusId === 4;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 bg-gray-800/30 border-b border-gray-800 flex items-center">
        <div className="w-1 h-3 bg-sky-500 rounded-full mr-2"></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Onay Akışı
        </span>
      </div>
      <div className="p-4">
        {/* 🎯 YENİ: lg:grid-cols-5 olarak güncellendi ki yan yana 5 tane sığsın */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAGES.map((s) => {
            const isPassed = s.id < currentStageId;
            const isCurrent = s.id === currentStageId;

            let containerClass =
              "bg-gray-800 border-gray-700 text-gray-500 opacity-60";
            let icon = <span className="font-mono">{s.id}</span>;

            if (isApproved) {
              containerClass =
                "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 opacity-100";
              icon = <FontAwesomeIcon icon={faCheckCircle} />;
            } else if (isRejected) {
              if (isCurrent) {
                containerClass =
                  "bg-red-500/10 border-red-500/30 text-red-500 opacity-100";
                icon = <FontAwesomeIcon icon={faBan} />;
              } else if (isPassed) {
                containerClass =
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 opacity-100";
                icon = <FontAwesomeIcon icon={faCheckCircle} />;
              }
            } else {
              if (isPassed) {
                containerClass =
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 opacity-100";
                icon = <FontAwesomeIcon icon={faCheckCircle} />;
              } else if (isCurrent) {
                containerClass =
                  "bg-sky-500/10 border-sky-500/50 text-sky-400 ring-1 ring-sky-500/30 opacity-100 shadow-[0_0_15px_rgba(14,165,233,0.15)]";
                icon = <FontAwesomeIcon icon={faClock} spin />;
              }
            }

            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${containerClass}`}
              >
                <div
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isCurrent && !isApproved && !isRejected ? "border-sky-500 text-sky-400" : "border-current"}`}
                >
                  {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

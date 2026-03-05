import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faInfoCircle,
  faCheck,
  faBan,
  faShare,
  faEdit,
  faFileLines,
  faRotateLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../../utils/dateFormatter";

const LOG_TYPE_MAP = {
  YeniBasvuru: {
    label: "YENİ BAŞVURU",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: faFileLines,
  },
  Sevk: {
    label: "SEVK EDİLDİ",
    color: "bg-sky-100 text-sky-700 border-sky-200",
    icon: faShare,
  },
  Onay: {
    label: "ONAYLANDI",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: faCheck,
  },
  Red: {
    label: "REDDEDİLDİ",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: faBan,
  },
  Guncelleme: {
    label: "GÜNCELLEME",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: faEdit,
  },
  // Yedek tipler (backend ileride farklı gönderirse diye)
  Revize: {
    label: "REVİZE TALEBİ",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: faRotateLeft,
  },
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 px-2 rounded transition-colors">
      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
        {label}
      </span>
      <span className="text-xs font-medium text-gray-300 text-right break-all max-w-[60%]">
        {value || "-"}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      <div className="px-4 py-2.5 bg-gray-800/30 border-b border-gray-800 flex items-center">
        <div className="w-1 h-3 bg-sky-500 rounded-full mr-2"></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export default function ApplicationSummary({ data, logs, loadingLogs }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SOL TARA: BAŞVURU ÖZETİ */}
      <Section title="Başvuru Özeti">
        <div className="space-y-0.5">
          <Row
            label="Ad Soyad"
            value={data.name || `${data.ad} ${data.soyad}`}
          />
          <Row
            label="Şubeler"
            value={
              data.jobDetails?.subeler?.map((x) => x.label).join(", ") ||
              data.branches?.join(", ") ||
              data.subeler
            }
          />
          <Row
            label="Alanlar"
            value={
              data.jobDetails?.alanlar?.map((x) => x.label).join(", ") ||
              data.areas?.join(", ") ||
              data.alanlar
            }
          />
          <Row
            label="Departmanlar"
            value={
              data.jobDetails?.departmanlar?.map((x) => x.label).join(", ") ||
              data.departments?.join(", ") ||
              data.departmanlar
            }
          />
          <Row
            label="Pozisyonlar"
            value={
              data.jobDetails?.departmanPozisyonlari
                ?.map((x) => x.label)
                .join(", ") ||
              data.roles?.join(", ") ||
              data.pozisyonlar
            }
          />
          <Row
            label="Eğitim"
            value={
              data.education?.map((x) => x.seviye).join(", ") ||
              data.educations?.join(", ") ||
              "Belirtilmemiş"
            }
          />
        </div>
      </Section>

      {/* SAĞ TARAF: İŞLEM GEÇMİŞİ */}
      <Section title="İşlem Geçmişi">
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {loadingLogs ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <FontAwesomeIcon icon={faSpinner} spin size="lg" />
              <span className="ml-2 text-xs uppercase">
                Loglar Yükleniyor...
              </span>
            </div>
          ) : logs && logs.length > 0 ? (
            [...logs].map((log, i) => {
              const desc =
                log.islemAciklama || log.IslemAciklama || log.aciklama || "-";
              const operatorName =
                log.panelKullaniciAdSoyad || log.islemYapanPersonel || "Sistem";

              // Map üzerinden tipi buluyoruz, yoksa varsayılan dönüyoruz
              const logTypeKey = log.islemTipiAdi || log.IslemTipiAdi;
              const typeInfo = LOG_TYPE_MAP[logTypeKey] || {
                label: logTypeKey || "İŞLEM",
                color: "bg-gray-100 text-gray-600 border-gray-200",
                icon: faClock,
              };

              return (
                <div key={i} className="flex gap-3 relative group">
                  {/* Sol Dikey Çizgi */}
                  <div className="absolute left-2.75 top-8 bottom-0 w-px bg-gray-800 group-last:hidden"></div>

                  {/* İkon Yuvası */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${typeInfo.color.replace("bg-", "bg-opacity-20 ")}`}
                  >
                    <FontAwesomeIcon
                      icon={typeInfo.icon}
                      size="xs"
                      className="opacity-80"
                    />
                  </div>

                  {/* Kart İçeriği */}
                  <div className="flex-1 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-[11px] text-sky-400 uppercase tracking-tight">
                        {operatorName}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">
                        {formatDate(log.islemTarihi || log.IslemTarihi)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed italic mb-2">
                      "{desc}"
                    </p>

                    {/* Log Tipi Etiketi */}
                    <div className="flex items-center">
                      <span
                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50">
              <FontAwesomeIcon icon={faInfoCircle} className="mb-2 text-xl" />
              <span className="text-xs font-bold uppercase">
                Henüz işlem kaydı yok
              </span>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

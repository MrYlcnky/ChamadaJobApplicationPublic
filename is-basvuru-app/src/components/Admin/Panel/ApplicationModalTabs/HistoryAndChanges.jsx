import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeCommit,
  faChevronDown,
  faChevronUp,
  faCalendarDays,
  faUser,
  faInfoCircle,
  faArrowRight,
  faFileSignature,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../../utils/dateFormatter";

// Aşama ID -> İsim Eşleşmesi
const STAGE_NAMES = {
  1: "İK Değerlendirme",
  2: "Departman Onayı",
  3: "İK Son Kontrol",
  4: "Genel Müdür Onayı",
  5: "İşe Alındı",
};

// Durum ID -> İsim Eşleşmesi
const STATUS_NAMES = {
  1: "Yeni Başvuru",
  2: "Devam Ediyor",
  3: "Onaylandı",
  4: "Reddedildi",
  5: "Revize Talebi",
};

export default function HistoryAndChanges({ processLogs, cvLogs }) {
  const [openIndexes, setOpenIndexes] = useState([0]);

  // 🎯 1. ADIM: VERİLERİ "VERSİYON" MANTIĞINA GÖRE GRUPLA
  const versionList = useMemo(() => {
    if (!cvLogs || cvLogs.length === 0) return [];

    // A) CV Loglarını Tarihe Göre (Yeniden Eskiye)
    const sortedCvLogs = [...cvLogs].sort((a, b) => {
      const dateA = new Date(a.degisiklikTarihi || a.DegisiklikTarihi);
      const dateB = new Date(b.degisiklikTarihi || b.DegisiklikTarihi);
      return dateB - dateA;
    });

    // B) Versiyon Gruplama
    const versions = [];
    let currentGroup = {
      id: 0,
      changes: [],
      date:
        sortedCvLogs[0]?.degisiklikTarihi || sortedCvLogs[0]?.DegisiklikTarihi,
      user: "Bilinmeyen",
      processNotes: [],
      stageId: 1,
      statusId: 2, // Varsayılan: Devam Ediyor
    };

    sortedCvLogs.forEach((log, index) => {
      const prevLog = sortedCvLogs[index - 1];
      const logDate = new Date(log.degisiklikTarihi || log.DegisiklikTarihi);
      const prevLogDate = prevLog
        ? new Date(prevLog.degisiklikTarihi || prevLog.DegisiklikTarihi)
        : null;

      // 30 dk fark varsa yeni versiyon
      const isNewVersion = prevLog && prevLogDate - logDate > 30 * 60 * 1000;

      if (isNewVersion) {
        versions.push(currentGroup);
        currentGroup = {
          id: 0,
          changes: [],
          date: logDate,
          user: "Bilinmeyen",
          processNotes: [],
          stageId: 1,
          statusId: 2,
        };
      }
      currentGroup.changes.push(log);
    });
    versions.push(currentGroup);

    // C) Dinamik Durum ve Aşama Bulma
    const totalVersions = versions.length;

    // Process loglarını Eskiden Yeniye sırala
    const sortedProcessLogs = [...(processLogs || [])].sort((a, b) => {
      const dateA = new Date(a.islemTarihi || a.IslemTarihi);
      const dateB = new Date(b.islemTarihi || b.IslemTarihi);
      return dateA - dateB;
    });

    versions.forEach((v, i) => {
      v.id = totalVersions - i;
      const vDate = new Date(v.date);

      // 🔥 FIX: Backend'den gelen veri büyük/küçük harf olabilir. Hepsini kontrol et.
      const lastStatusLog = sortedProcessLogs
        .filter((p) => new Date(p.islemTarihi || p.IslemTarihi) <= vDate)
        .pop();

      if (lastStatusLog) {
        // Hem camelCase hem PascalCase kontrolü yapıyoruz
        v.stageId = Number(
          lastStatusLog.basvuruOnayAsamasi ||
            lastStatusLog.BasvuruOnayAsamasi ||
            1,
        );
        v.statusId = Number(
          lastStatusLog.basvuruDurum || lastStatusLog.BasvuruDurum || 2,
        );
      }

      // Versiyon Notlarını Eşle
      const nextV = versions[i - 1];
      const nextVDate = nextV
        ? new Date(nextV.date)
        : new Date(8640000000000000);

      const notes = sortedProcessLogs.filter((p) => {
        const pDate = new Date(p.islemTarihi || p.IslemTarihi);
        return pDate >= vDate.getTime() - 60000 && pDate < nextVDate;
      });

      v.processNotes = notes.reverse();

      // Kullanıcı Adı
      if (
        notes.length > 0 &&
        (notes[0].islemTipiAdi === "Güncelleme" ||
          notes[0].islemTipiAdi === "Revize")
      ) {
        v.user =
          notes[0].panelKullaniciAdSoyad || notes[0].PanelKullaniciAdSoyad;
      } else {
        v.user = "Aday / İK İşlemi";
      }
    });

    return versions;
  }, [cvLogs, processLogs]);

  const toggleAccordion = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  if (!versionList || versionList.length === 0) {
    return (
      <div className="p-5 sm:p-8 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30 flex flex-col items-center justify-center">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="mb-2 sm:mb-3 text-xl sm:text-2xl opacity-50"
        />
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2">
          Henüz versiyonlanmış bir veri değişikliği bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4 space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* BAŞLIK */}
      <div className="flex items-center gap-3 px-1">
        <FontAwesomeIcon
          icon={faCodeCommit}
          className="text-sky-500 text-lg sm:text-xl"
        />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Başvuru Versiyon Geçmişi
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
            Toplam{" "}
            <span className="text-sky-400 font-bold">{versionList.length}</span>{" "}
            versiyon kaydı.
          </p>
        </div>
      </div>

      {/* VERSİYON KARTLARI */}
      {versionList.map((version, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={version.id}
            className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "border-sky-500/50 bg-gray-900 shadow-2xl shadow-sky-900/20"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}
          >
            {/* HEADER */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer outline-none group gap-2"
            >
              <div className="flex items-center gap-3 sm:gap-5 w-full">
                {/* Versiyon ID Kutusu */}
                <div
                  className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 shrink-0 ${
                    isOpen
                      ? "bg-sky-600 text-white border-sky-500"
                      : "bg-gray-800 text-gray-500 border-gray-700 group-hover:border-gray-600"
                  }`}
                >
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-60">
                    VER.
                  </span>
                  <span className="text-xl sm:text-2xl font-bold leading-none mt-0.5">
                    {version.id}
                  </span>
                </div>

                {/* Kullanıcı ve Etiketler */}
                <div className="text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
                    <h4
                      className={`text-sm sm:text-base font-bold truncate ${isOpen ? "text-white" : "text-gray-300"}`}
                    >
                      {version.user}
                    </h4>

                    {version.stageId > 0 && (
                      <span className="bg-gray-700/50 text-gray-300 border border-gray-600 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase flex items-center gap-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faLayerGroup} size="xs" />
                        {STAGE_NAMES[version.stageId] ||
                          `${version.stageId}. Aşama`}
                      </span>
                    )}

                    {version.statusId === 2 && (
                      <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase whitespace-nowrap">
                        Devam Ediyor
                      </span>
                    )}
                    {version.statusId === 3 && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase whitespace-nowrap">
                        Onaylandı
                      </span>
                    )}
                    {version.statusId === 4 && (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase whitespace-nowrap">
                        Reddedildi
                      </span>
                    )}
                    {version.statusId === 5 && (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase whitespace-nowrap">
                        Revize
                      </span>
                    )}

                    {index === 0 && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase sm:ml-auto whitespace-nowrap">
                        Güncel
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-[10px]"
                      />
                      {formatDate(version.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={faFileSignature}
                        className="text-[10px]"
                      />
                      {version.changes.length} Değişiklik
                    </span>
                  </div>
                </div>
              </div>

              <FontAwesomeIcon
                icon={isOpen ? faChevronUp : faChevronDown}
                className={`transition-transform duration-300 shrink-0 ml-2 ${isOpen ? "text-sky-500" : "text-gray-600"}`}
              />
            </button>

            {/* BODY (Açılır Kısım) */}
            {isOpen && (
              <div className="border-t border-gray-800 bg-black/20 p-4 sm:p-6 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* SOL: Değişiklik Tablosu */}
                  <div className="lg:col-span-2">
                    <h5 className="text-[10px] sm:text-[11px] font-black text-amber-500 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500"></span>
                      Veri Değişiklikleri
                    </h5>

                    {/* Tablo Yatay Kaydırma Kapsayıcısı */}
                    <div className="rounded-lg border border-gray-700/50 overflow-x-auto no-scrollbar w-full">
                      <table className="w-full text-left text-[10px] sm:text-xs min-w-125">
                        <thead className="bg-gray-800 text-gray-400 font-bold uppercase">
                          <tr>
                            <th className="px-3 sm:px-4 py-2.5 sm:py-3 w-1/3 whitespace-nowrap">
                              Alan Adı
                            </th>
                            <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-rose-400/80 whitespace-nowrap">
                              Eski Değer
                            </th>
                            <th className="px-1 py-2.5 sm:py-3 text-center"></th>
                            <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-emerald-400/80 whitespace-nowrap">
                              Yeni Değer
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900/40">
                          {version.changes.map((change, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-800/30 transition-colors"
                            >
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3 align-top">
                                <span className="block text-gray-300 font-bold mb-0.5">
                                  {change.degisenAlanAdi ||
                                    change.DegisenAlanAdi}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-gray-600">
                                  {change.degisenTabloAdi ||
                                    change.DegisenTabloAdi}
                                </span>
                              </td>
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-rose-300/80 align-top line-through decoration-rose-500/30 break-all min-w-30">
                                {change.eskiDeger || change.EskiDeger || "-"}
                              </td>
                              <td className="px-1 py-2.5 sm:py-3 text-center align-top text-gray-600 pt-3 sm:pt-3.5">
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-[8px] sm:text-[10px]"
                                />
                              </td>
                              <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-emerald-400 font-medium align-top break-all min-w-30">
                                {change.yeniDeger || change.YeniDeger || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SAĞ: Yönetici Notları */}
                  <div className="lg:col-span-1 lg:border-l lg:border-t-0 border-t border-gray-800 lg:pl-6 pt-5 lg:pt-0">
                    <h5 className="text-[10px] sm:text-[11px] font-black text-sky-500 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-500"></span>
                      Yönetici İşlemleri
                    </h5>
                    <div className="space-y-3 sm:space-y-4">
                      {version.processNotes.length > 0 ? (
                        version.processNotes.map((note, nIdx) => (
                          <div
                            key={nIdx}
                            className="bg-gray-800/40 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 shrink-0">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-[9px] sm:text-[10px]"
                                  />
                                </div>
                                <span className="text-[11px] sm:text-xs font-bold text-gray-200 truncate">
                                  {note.panelKullaniciAdSoyad ||
                                    note.PanelKullaniciAdSoyad}
                                </span>
                              </div>
                              <span
                                className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0
                                ${
                                  (note.islemTipiAdi || note.IslemTipiAdi) ===
                                  "Onay"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : (note.islemTipiAdi ||
                                          note.IslemTipiAdi) === "Red"
                                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                                      : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                                }`}
                              >
                                {note.islemTipiAdi || note.IslemTipiAdi}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-400 italic leading-relaxed mb-2 wrap-break-word">
                              "{note.islemAciklama || note.IslemAciklama}"
                            </p>
                            <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono text-right">
                              {formatDate(note.islemTarihi || note.IslemTarihi)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-dashed border-gray-800 text-center bg-gray-900/20">
                          <span className="text-[9px] sm:text-[10px] text-gray-500">
                            Bu versiyon için sistem/yönetici notu bulunmuyor.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import React, { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGavel,
  faXmark,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { formatDate } from "../../../utils/dateFormatter";
import { basvuruService } from "../../../services/basvuruService";
import { gorevAtamaService } from "../../../services/gorevAtamaService"; // YENİ EKLENDİ

import ApprovalWorkflow from "./ApplicationModalTabs/SummaryAndDecision/ApprovalWorkflow";
import DecisionArea from "./ApplicationModalTabs/SummaryAndDecision/DecisionArea";
import ApplicationSummary from "./ApplicationModalTabs/ApplicationSummary";
import HistoryAndChanges from "./ApplicationModalTabs/SummaryAndDecision/HistoryAndChanges";
import ReadOnlyApplicationView from "./ApplicationModalTabs/ReadOnlyApplicationView";
import JobOfferDetails from "./ApplicationModalTabs/SummaryAndDecision/JobOfferDetails";

export default function ApplicationModal({ data, auth, onClose, onAction }) {
  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [cvLogs, setCvLogs] = useState([]);

  const rawData = data.originalData || {};
  const currentStageId = Number(
    data.approvalStage || rawData.basvuruOnayAsamasi || 1,
  );
  const statusId = Number(data.statusId || rawData.basvuruDurum || 1);
  const personelId =
    rawData.personelId || rawData.PersonelId || rawData.personel?.id || 0;

  // 🎯 YENİ: Görev Atama Form State'i (JobOfferDetails'i buradan yöneteceğiz)
  const [jobOfferData, setJobOfferData] = useState({
    id: 0,
    masterDepartmanId: auth?.masterDepartmanId || "",
    gorevId: "",
    netUcret: "",
    talepEdilenGorevGenelButcesi: "",
    baslangicTarihi: "",
    talepNedeni: 1,
    yerineAlinacakKisiAdSoyad: "",
  });

  const hasUserAction = useMemo(() => {
    if (!logs || logs.length === 0) return false;
    const currentUserId = Number(
      auth?.id || auth?.userId || auth?.personelId || auth?.Id,
    );

    return logs.some((log) => {
      const logUserId = Number(
        log.panelKullaniciId ||
          log.PanelKullaniciId ||
          log.kullaniciId ||
          log.islemYapanId ||
          log.ekleyenId,
      );

      return logUserId === currentUserId;
    });
  }, [logs, auth]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllLogs = async () => {
      if (!data?.id) return;

      setLoadingLogs(true);
      try {
        const [processRes, cvRes] = await Promise.all([
          basvuruService.getBasvuruLogs(data.id),
          personelId ? basvuruService.getCvLogs(personelId) : { data: [] },
        ]);

        if (isMounted) {
          setLogs(
            Array.isArray(processRes) ? processRes : processRes.data || [],
          );
          setCvLogs(Array.isArray(cvRes) ? cvRes : cvRes.data || []);
        }
      } catch (error) {
        console.error("Log çekme hatası:", error);
      } finally {
        if (isMounted) setLoadingLogs(false);
      }
    };

    fetchAllLogs();
    return () => {
      isMounted = false;
    };
  }, [data.id, personelId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const userRole = useMemo(() => {
    const rid = Number(auth?.rolId ?? auth?.roleId);
    if ([1, 2, 3, 4].includes(rid)) return "ik";
    if (rid === 6) return "dm";
    if (rid === 5) return "gm";
    if (rid === 7) return "mim";
    return "guest";
  }, [auth]);

  const canAction = useMemo(() => {
    if ([3, 4, 5].includes(statusId)) return false; // 5: RevizeTalebi varken kimse normal işlem yapamaz
    const STAGES_ROLES = { 1: "ik", 2: "dm", 3: "ik", 4: "gm", 5: "mim" };
    return STAGES_ROLES[currentStageId] === userRole;
  }, [statusId, currentStageId, userRole]);

  const handleProcess = async (actionType) => {
    // 1. Karakter sınırı kontrolü (En az 13 karakter)
    if (!note || note.trim().length < 13) {
      Swal.fire({
        icon: "warning",
        title: "Açıklama Yetersiz",
        text: "En az 13 karakter giriniz.",
        background: "#1f2937",
        color: "#fff",
      });
      return;
    }

    const isDM = Number(auth?.rolId || auth?.roleId) === 6;
    const isDepartmanOnayi = currentStageId === 2;

    // 🎯 2. GÖREV ATAMA FORMU KONTROLÜ (Sadece DM Onaylıyorsa)
    if (actionType === "approve" && isDM && isDepartmanOnayi) {
      if (
        !jobOfferData.gorevId ||
        !jobOfferData.netUcret ||
        !jobOfferData.talepEdilenGorevGenelButcesi ||
        !jobOfferData.baslangicTarihi
      ) {
        Swal.fire({
          icon: "warning",
          title: "Eksik Görev Bilgileri",
          text: "Lütfen adayı onaylamadan önce Görev, Başlama Tarihi, Ücret ve Bütçe alanlarını eksiksiz doldurun.",
          background: "#1f2937",
          color: "#fff",
        });
        return;
      }
      if (
        Number(jobOfferData.talepNedeni) === 2 &&
        !jobOfferData.yerineAlinacakKisiAdSoyad.trim()
      ) {
        Swal.fire({
          icon: "warning",
          title: "Eksik Bilgi",
          text: "Lütfen kimin yerine alınacağını yazınız.",
          background: "#1f2937",
          color: "#fff",
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      // 🎯 3. ÖNCE GÖREV BİLGİLERİNİ VERİTABANINA KAYDET
      if (actionType === "approve" && isDM && isDepartmanOnayi) {
        const atamaPayload = {
          ...jobOfferData,
          personelId: personelId,
          netUcret: Number(jobOfferData.netUcret),
          talepEdilenGorevGenelButcesi: Number(
            jobOfferData.talepEdilenGorevGenelButcesi,
          ),
          talepNedeni: Number(jobOfferData.talepNedeni),
        };

        if (jobOfferData.id) {
          await gorevAtamaService.update(atamaPayload);
        } else {
          await gorevAtamaService.create(atamaPayload);
        }
      }
      // GEÇMİŞ TARİH KONTROLÜ
      if (actionType === "approve" && isDM && isDepartmanOnayi) {
        const selectedDate = new Date(jobOfferData.baslangicTarihi);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Sadece tarih karşılaştırması için saati sıfırla

        if (selectedDate < today) {
          Swal.fire({
            icon: "error",
            title: "Geçersiz Tarih",
            text: "İşe başlama tarihi bugünden önce olamaz.",
            background: "#1f2937",
            color: "#fff",
          });
          return;
        }
      }

      // 4. SONRA BAŞVURU DURUMUNU İLERLET
      let newStatus = statusId;
      let newStage = currentStageId;

      if (actionType === "approve_revision") {
        newStatus = 2; // BasvuruDurum.DevamEdiyor = 2

        const lastRevReq = [...logs]
          .sort((a, b) => Number(b.id || b.Id) - Number(a.id || a.Id))
          .find(
            (l) =>
              Number(l.basvuruDurum || l.BasvuruDurum) === 5 ||
              Number(l.islemTipi || l.IslemTipi) === 10,
          );

        if (lastRevReq) {
          const requesterRolId = Number(lastRevReq.rolId || lastRevReq.RolId);

          if ([1, 2, 3, 4].includes(requesterRolId)) {
            newStage = 1;
          } else if (requesterRolId === 6) {
            newStage = 2; // Departman_Onayi
          } else if (requesterRolId === 5) {
            newStage = 4; // Genel_Mudur_Onayi
          } else if (requesterRolId === 7) {
            newStage = 5; // Mali_Isler_Mudur_Onayi
          } else {
            newStage = Number(
              lastRevReq.basvuruOnayAsamasi ||
                lastRevReq.BasvuruOnayAsamasi ||
                1,
            );
          }
        } else {
          newStage = 1;
        }
      } else if (actionType === "approve") {
        if (currentStageId === 5) {
          newStage = 6; // İşe Alındı
          newStatus = 3; // Onaylandı
        } else {
          newStage = currentStageId + 1; // Bir sonraki aşama
          newStatus = 2;
        }
      } else if (actionType === "reject") {
        newStatus = 4; // Reddedildi
      } else if (actionType === "request_revision") {
        newStatus = 5; // Revize Talebi
      }

      const payload = {
        Id: data.id,
        PersonelId: personelId,
        BasvuruDurum: newStatus,
        BasvuruOnayAsamasi: newStage,
        IslemAciklama:
          actionType === "request_revision" ? `REVİZE TALEBİ: ${note}` : note,
      };

      await basvuruService.updateStatus(payload);

      Swal.fire({
        icon: "success",
        title: "İşlem Başarılı",
        timer: 1500,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#fff",
      });

      onAction?.();
      onClose();
    } catch (error) {
      console.error("SİSTEM HATASI:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "İşlem başarısız.",
        background: "#1f2937",
        color: "#fff",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center sm:p-4 p-0 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-7xl h-full flex flex-col bg-gray-900 sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
              {data.name || `${data.ad} ${data.soyad}`}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border uppercase ${statusId === 4 ? "bg-red-500/10 text-red-500 border-red-500/20" : statusId === 3 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-sky-500/10 text-sky-500 border-sky-500/20"}`}
              >
                {data.status || "Süreçte"}
              </span>
            </h3>
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1 font-bold uppercase">
              <span className="font-mono text-gray-600">ID: #{data.id}</span>
              <span>Tarih: {formatDate(data.date)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-6 bg-gray-900 border-b border-gray-800 overflow-x-auto">
          <TabButton
            icon={faGavel}
            label="Özet & Karar"
            isActive={activeTab === "summary"}
            onClick={() => setActiveTab("summary")}
          />
          <TabButton
            icon={faHistory}
            label="Geçmiş"
            isActive={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
          <TabButton
            icon={faFileLines}
            label="Form"
            isActive={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-900">
          {activeTab === "summary" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ApprovalWorkflow
                currentStageId={currentStageId}
                statusId={statusId}
              />

              <JobOfferDetails
                personelId={personelId}
                auth={auth}
                currentStageId={currentStageId}
                jobOfferData={jobOfferData} // 🎯 YENİ PROP
                setJobOfferData={setJobOfferData} // 🎯 YENİ PROP
              />

              <DecisionArea
                note={note}
                setNote={setNote}
                canAction={canAction}
                isProcessing={isProcessing}
                currentStageId={currentStageId}
                statusId={statusId}
                onProcess={handleProcess}
                isIKGroup={auth?.rolId <= 3}
                hasUserAction={hasUserAction}
              />

              <ApplicationSummary
                data={data}
                logs={logs}
                loadingLogs={loadingLogs}
              />
            </div>
          )}
          {activeTab === "history" && (
            <HistoryAndChanges processLogs={logs} cvLogs={cvLogs} />
          )}
          {activeTab === "details" && <ReadOnlyApplicationView data={data} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? "text-sky-400 bg-sky-500/5" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"}`}
    >
      <FontAwesomeIcon icon={icon} className={isActive ? "text-sky-500" : ""} />{" "}
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />
      )}
    </button>
  );
}

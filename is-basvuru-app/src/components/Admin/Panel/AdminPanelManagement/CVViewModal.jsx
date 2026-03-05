import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import html2pdf from "html2pdf.js"; // Gelişmiş kütüphanemiz
import CVTemplate from "./CVTemplate";

export default function CVViewModal({ applicationData, onClose }) {
  const templateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!templateRef.current) return;
    setIsDownloading(true);

    try {
      const element = templateRef.current;

      // html2pdf Akıllı Ayarları
      const opt = {
        margin: [10, 0, 10, 0], // [Üst, Sağ, Alt, Sol] sayfa boşlukları
        filename: `Basvuru_${applicationData?.personal?.ad || "CV"}.pdf`,
        image: { type: "jpeg", quality: 1 }, // En yüksek kalite
        html2canvas: {
          scale: 2,
          useCORS: true,
          scrollY: 0, // Sayfayı aşağı kaydırmış olsan bile tepeden çeker
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        // EN ÖNEMLİ KISIM: Tablo satırlarının ve başlıkların ortadan kesilmesini engeller
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      // PDF'i oluştur ve indir
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Hatası:", error);
      alert("PDF oluşturulurken bir sorun oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-hidden backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 gap-3 sm:gap-0 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
            Başvuru Önizleme
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`
                flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white transition-all flex-1 sm:flex-none
                ${
                  isDownloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95"
                }
              `}
            >
              {isDownloading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} /> <span>PDF İndir</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors border border-gray-200 sm:border-transparent shrink-0"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content (Responsive & Scrollable) */}
        <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-4 md:p-8 custom-scrollbar">
          <div className="w-full min-w-max flex justify-center pb-8 sm:pb-0">
            {/* A4 Kağıdı */}
            <div
              className="bg-white shadow-2xl mx-auto shrink-0 ring-1 ring-gray-200"
              style={{
                width: "210mm",
                minHeight: "297mm",
                height: "auto",
              }}
            >
              {/* Referans noktası */}
              <div ref={templateRef} className="w-full h-full">
                <CVTemplate data={applicationData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVTemplate from "./CVTemplate";

export default function CVViewModal({ applicationData, onClose }) {
  const templateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!templateRef.current) return;
    setIsDownloading(true);

    try {
      // 1. Şablonu Klonla (Orijinal görünümü bozmamak için)
      const originalElement = templateRef.current;
      const clone = originalElement.cloneNode(true);

      // A4 Boyutları (96 DPI için yaklaşık px değerleri)
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;
      // Sayfa altından bırakılacak güvenli boşluk (Kesilmeyi önler)
      const PAGE_MARGIN_BOTTOM = 80; // 60px -> 80px'e çıkarıldı (Daha güvenli)
      const PAGE_MARGIN_TOP = 40; // Yeni sayfa başlangıç boşluğu

      // Klon Ayarları
      clone.style.width = `${A4_WIDTH_PX}px`;
      clone.style.position = "absolute";
      clone.style.top = "-10000px";
      clone.style.left = "0";
      clone.style.zIndex = "-1";
      clone.style.padding = "0";

      document.body.appendChild(clone);

      // 2. AKILLI SAYFALAMA ALGORİTMASI
      const contentDiv = clone.firstElementChild;
      // PDF kenar boşluklarını (Padding) burada veriyoruz
      contentDiv.style.padding = "40px";
      contentDiv.style.width = "100%";
      contentDiv.style.boxSizing = "border-box";

      const childNodes = Array.from(contentDiv.children);

      let currentHeight = 40; // Başlangıçtaki üst padding

      childNodes.forEach((child) => {
        const childHeight = child.offsetHeight;
        const style = window.getComputedStyle(child);
        const marginTop = parseInt(style.marginTop) || 0;
        const marginBottom = parseInt(style.marginBottom) || 0;

        const totalChildHeight = childHeight + marginTop + marginBottom;

        // Sayfa sonuna kalan mesafe
        const positionOnPage = currentHeight % A4_HEIGHT_PX;
        const remainingOnPage = A4_HEIGHT_PX - positionOnPage;

        // Eğer eleman sayfaya sığmıyorsa (veya çok sıkışıyorsa)
        if (
          totalChildHeight > remainingOnPage - PAGE_MARGIN_BOTTOM &&
          totalChildHeight < A4_HEIGHT_PX
        ) {
          // Araya boşluk (Spacer) ekle
          const spacer = document.createElement("div");
          // Kalan boşluğu doldur + Yeni sayfanın üst boşluğunu ekle
          const spacerHeight = remainingOnPage + PAGE_MARGIN_TOP;

          spacer.style.height = `${spacerHeight}px`;
          spacer.style.display = "block";
          spacer.style.width = "100%";
          spacer.style.backgroundColor = "transparent";

          // Boşluğu elemandan önce ekle
          contentDiv.insertBefore(spacer, child);

          // Yüksekliği güncelle
          currentHeight += spacerHeight;
        }

        // Elemanın yüksekliğini ekle
        currentHeight += totalChildHeight;
      });

      // 3. Fotoğraf Çek
      const totalHeight = clone.offsetHeight;
      const canvas = await html2canvas(clone, {
        scale: 2, // Yüksek kalite
        useCORS: true,
        width: A4_WIDTH_PX,
        height: totalHeight,
        windowWidth: A4_WIDTH_PX,
        windowHeight: totalHeight,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      // 4. PDF Oluştur
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeightInPdf;
      let position = 0;

      // İlk Sayfa
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;

      // Diğer Sayfalar
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Basvuru_${applicationData?.name || "CV"}.pdf`);
    } catch (error) {
      console.error("PDF Hatası:", error);
      alert("PDF oluşturulurken bir sorun oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60  p-4 overflow-hidden">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 gap-3 sm:gap-0">
          <h3 className="text-lg font-bold text-gray-800 text-center sm:text-left">
            Başvuru Önizleme
          </h3>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all w-full sm:w-auto
                ${
                  isDownloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md active:scale-95"
                }
              `}
            >
              {isDownloading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />{" "}
                  <span className="hidden sm:inline">Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} /> <span>PDF İndir</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors border border-gray-200 sm:border-transparent"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content (Responsive & Scrollable) */}
        <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-4 md:p-8 flex justify-center items-start">
          {/* Wrapper: Mobilde yatay scroll sağlar */}
          <div className="w-full overflow-x-auto flex justify-center min-h-full">
            {/* A4 Kağıdı */}
            <div
              className="bg-white shadow-2xl mx-auto shrink-0"
              style={{
                width: "210mm", // Sabit A4 genişliği (Responsive olması için scale yerine scroll kullanıyoruz)
                minHeight: "297mm", // En az 1 sayfa boyu
                height: "auto", // İçerik uzadıkça uzasın (Kesilmeyi önler)
                // Padding yok, CVTemplate içinde hallediyoruz (veya PDF oluştururken)
              }}
            >
              {/* Referans noktası */}
              <div ref={templateRef}>
                <CVTemplate data={applicationData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

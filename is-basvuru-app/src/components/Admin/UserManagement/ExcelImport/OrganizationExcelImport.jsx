import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { tanimlamalarService } from "../../../../services/tanimlamalarService";

export default function OrganizationExcelImport({
  onImportSuccess,
  activeTab = "sirket",
  currentList = [],
  lookups = {},
}) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const getConfig = () => {
    switch (activeTab) {
      case "program":
        return {
          title: "Program Dağıtımı",
          cols: ["Şube", "Departman", "Program Adı"],
          desc: "Belirli bir şubedeki departmana toplu program atar.",
          template: [
            {
              Şube: "Chamada Girne",
              Departman: "Cage",
              "Program Adı": "DrReports",
            },
          ],
        };
      case "oyun":
        return {
          title: "Oyun Dağıtımı",
          cols: ["Şube", "Departman", "Oyun Adı"],
          desc: "Belirli bir şubedeki departmana toplu oyun atar.",
          template: [
            {
              Şube: "Chamada Girne",
              Departman: "Canlı Oyun",
              "Oyun Adı": "Blackjack",
            },
          ],
        };
      case "gorev":
        return {
          title: "Görev Dağıtımı",
          cols: ["Departman", "Görev Adı"],
          desc: "Şubeden bağımsız olarak Master Departmanlara toplu görev atar.",
          template: [{ Departman: "F&B", "Görev Adı": "A Garson" }],
        };
      case "sirket":
      default:
        return {
          title: "Şirket Hiyerarşisi",
          cols: ["Şube", "Alan", "Departman", "Pozisyon"],
          desc: "Tüm hiyerarşik zinciri (Şube > Alan > Departman > Pozisyon) kurar.",
          template: [
            {
              Şube: "Chamada Girne",
              Alan: "Casino",
              Departman: "Bilgi İşlem",
              Pozisyon: "IT Supervisor",
            },
          ],
        };
    }
  };

  const config = getConfig();

  const textColors = [
    "text-blue-600",
    "text-amber-600",
    "text-emerald-600",
    "text-indigo-600",
  ];
  const tooltipColors = [
    "text-blue-300",
    "text-amber-300",
    "text-emerald-300",
    "text-indigo-300",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const allRows = rawData
          .slice(1)
          .filter(
            (row) =>
              row &&
              row.length > 0 &&
              row.some(
                (cell) =>
                  cell !== undefined &&
                  cell !== null &&
                  cell.toString().trim() !== "",
              ),
          );

        const validRows = [];
        const invalidRows = [];
        const duplicateRows = [];
        const alreadyExistsRows = [];
        const uniqueSet = new Set();

        allRows.forEach((row, index) => {
          const excelRowNumber = index + 2;

          let rowData = {};
          let missingFields = [];
          let key = "";
          let existsInSystem = false;
          let isValidHierarchy = true;

          if (activeTab === "sirket") {
            rowData = {
              Sube: row[0]?.toString().trim(),
              Alan: row[1]?.toString().trim(),
              Departman: row[2]?.toString().trim(),
              Pozisyon: row[3]?.toString().trim(),
            };
            if (!rowData.Sube) missingFields.push("Şube");
            if (!rowData.Alan) missingFields.push("Alan");
            if (!rowData.Departman) missingFields.push("Departman");
            if (!rowData.Pozisyon) missingFields.push("Pozisyon");

            key = `${rowData.Sube}|${rowData.Alan}|${rowData.Departman}|${rowData.Pozisyon}`;

            existsInSystem = currentList.some(
              (item) =>
                item.subeAdi?.toLowerCase() === rowData.Sube?.toLowerCase() &&
                item.alanAdi?.toLowerCase() === rowData.Alan?.toLowerCase() &&
                item.departmanAdi?.toLowerCase() ===
                  rowData.Departman?.toLowerCase() &&
                item.pozisyonAdi?.toLowerCase() ===
                  rowData.Pozisyon?.toLowerCase(),
            );
          } else if (activeTab === "program") {
            rowData = {
              Sube: row[0]?.toString().trim(),
              Departman: row[1]?.toString().trim(),
              ProgramAdi: row[2]?.toString().trim(),
            };
            if (!rowData.Sube) missingFields.push("Şube");
            if (!rowData.Departman) missingFields.push("Departman");
            if (!rowData.ProgramAdi) missingFields.push("Program Adı");

            key = `${rowData.Sube}|${rowData.Departman}|${rowData.ProgramAdi}`;

            existsInSystem = currentList.some(
              (item) =>
                item.subeAdi?.toLowerCase() === rowData.Sube?.toLowerCase() &&
                item.departmanAdi?.toLowerCase() ===
                  rowData.Departman?.toLowerCase() &&
                (item.masterProgramAdi || item.programAdi)?.toLowerCase() ===
                  rowData.ProgramAdi?.toLowerCase(),
            );

            if (missingFields.length === 0) {
              const subeVarMi = lookups.subeler?.some(
                (s) =>
                  (s.SubeAdi || s.subeAdi)?.toLowerCase() ===
                  rowData.Sube.toLowerCase(),
              );
              const deptVarMi = lookups.masterDepartmanlar?.some(
                (d) =>
                  (
                    d.MasterDepartmanAdi || d.masterDepartmanAdi
                  )?.toLowerCase() === rowData.Departman.toLowerCase(),
              );

              if (!subeVarMi) {
                invalidRows.push({
                  Satır: excelRowNumber,
                  Hata: `'${rowData.Sube}' adlı Şube bulunamadı.`,
                });
                isValidHierarchy = false;
              } else if (!deptVarMi) {
                invalidRows.push({
                  Satır: excelRowNumber,
                  Hata: `'${rowData.Departman}' adlı Departman bulunamadı.`,
                });
                isValidHierarchy = false;
              }
            }
          } else if (activeTab === "oyun") {
            rowData = {
              Sube: row[0]?.toString().trim(),
              Departman: row[1]?.toString().trim(),
              OyunAdi: row[2]?.toString().trim(),
            };
            if (!rowData.Sube) missingFields.push("Şube");
            if (!rowData.Departman) missingFields.push("Departman");
            if (!rowData.OyunAdi) missingFields.push("Oyun Adı");

            key = `${rowData.Sube}|${rowData.Departman}|${rowData.OyunAdi}`;

            existsInSystem = currentList.some(
              (item) =>
                item.subeAdi?.toLowerCase() === rowData.Sube?.toLowerCase() &&
                item.departmanAdi?.toLowerCase() ===
                  rowData.Departman?.toLowerCase() &&
                (item.masterOyunAdi || item.oyunAdi)?.toLowerCase() ===
                  rowData.OyunAdi?.toLowerCase(),
            );

            if (missingFields.length === 0) {
              const subeVarMi = lookups.subeler?.some(
                (s) =>
                  (s.SubeAdi || s.subeAdi)?.toLowerCase() ===
                  rowData.Sube.toLowerCase(),
              );
              const deptVarMi = lookups.masterDepartmanlar?.some(
                (d) =>
                  (
                    d.MasterDepartmanAdi || d.masterDepartmanAdi
                  )?.toLowerCase() === rowData.Departman.toLowerCase(),
              );

              if (!subeVarMi) {
                invalidRows.push({
                  Satır: excelRowNumber,
                  Hata: `'${rowData.Sube}' adlı Şube bulunamadı.`,
                });
                isValidHierarchy = false;
              } else if (!deptVarMi) {
                invalidRows.push({
                  Satır: excelRowNumber,
                  Hata: `'${rowData.Departman}' adlı Departman bulunamadı.`,
                });
                isValidHierarchy = false;
              }
            }
          } else if (activeTab === "gorev") {
            rowData = {
              Departman: row[0]?.toString().trim(),
              GorevAdi: row[1]?.toString().trim(),
            };
            if (!rowData.Departman) missingFields.push("Departman");
            if (!rowData.GorevAdi) missingFields.push("Görev Adı");

            key = `${rowData.Departman}|${rowData.GorevAdi}`;

            existsInSystem = currentList.some(
              (item) =>
                item.departmanAdi?.toLowerCase() ===
                  rowData.Departman?.toLowerCase() &&
                (item.masterGorevAdi || item.gorevAdi)?.toLowerCase() ===
                  rowData.GorevAdi?.toLowerCase(),
            );

            if (missingFields.length === 0) {
              const deptVarMi = lookups.masterDepartmanlar?.some(
                (d) =>
                  (
                    d.MasterDepartmanAdi || d.masterDepartmanAdi
                  )?.toLowerCase() === rowData.Departman.toLowerCase(),
              );

              if (!deptVarMi) {
                invalidRows.push({
                  Satır: excelRowNumber,
                  Hata: `'${rowData.Departman}' adlı Master Departman bulunamadı.`,
                });
                isValidHierarchy = false;
              }
            }
          }

          if (!isValidHierarchy) {
            return;
          } else if (existsInSystem) {
            alreadyExistsRows.push({
              Satır: excelRowNumber,
              Hata: "Sistemde Zaten Var",
            });
          } else if (missingFields.length > 0) {
            invalidRows.push({
              Satır: excelRowNumber,
              Hata: `Eksik: ${missingFields.join(", ")}`,
            });
          } else {
            const lowerKey = key.toLowerCase();
            if (uniqueSet.has(lowerKey)) {
              duplicateRows.push({
                Satır: excelRowNumber,
                Hata: "Excel İçi Kopya",
              });
            } else {
              uniqueSet.add(lowerKey);
              validRows.push(rowData);
            }
          }
        });

        if (
          validRows.length === 0 &&
          alreadyExistsRows.length === 0 &&
          invalidRows.length === 0
        ) {
          toast.error("Excel'de okunacak veri bulunamadı.");
          return;
        }

        // 🎯 GÜNCELLENEN SWAL HTML KISMI (EŞLEŞMEYENLER LİSTESİ)
        const confirm = await Swal.fire({
          title: "İlişki Analizi Tamamlandı",
          html: `
            <div class="text-left text-sm space-y-2 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div class="flex justify-between border-b pb-1">
                <span class="text-gray-500 font-bold">Toplam Okunan Satır:</span>
                <span class="font-black text-blue-600">${allRows.length}</span>
              </div>

              ${
                alreadyExistsRows.length > 0
                  ? `<div class="flex justify-between border-b pb-1 bg-cyan-50 p-1 rounded text-cyan-700">
                      <span class="font-bold">Sistemde Zaten Kayıtlı:</span>
                      <span class="font-black">${alreadyExistsRows.length}</span>
                    </div>`
                  : ""
              }

              ${
                invalidRows.length > 0
                  ? `<div class="flex justify-between border-b pb-1 bg-red-50 p-1 rounded text-red-600">
                      <span class="font-bold">Eşleşmeyen / Hatalı Satır:</span>
                      <span class="font-black">${invalidRows.length}</span>
                    </div>`
                  : ""
              }

              ${
                duplicateRows.length > 0
                  ? `<div class="flex justify-between border-b pb-1 bg-amber-50 p-1 rounded text-amber-600">
                      <span class="font-bold">Excel İçi Kopya (Elenen):</span>
                      <span class="font-black">${duplicateRows.length}</span>
                    </div>`
                  : ""
              }

              <div class="flex justify-between border-b pb-1 pt-1">
                <span class="text-gray-600 font-black uppercase">Net Aktarılacak:</span>
                <span class="font-black ${validRows.length > 0 ? "text-emerald-600" : "text-gray-400"} text-lg">${validRows.length}</span>
              </div>
              
              ${
                validRows.length === 0 && alreadyExistsRows.length > 0
                  ? `<p class="text-[11px] text-cyan-600 mt-3 font-bold text-center leading-tight">Bu Excel'deki tüm veriler zaten sistemde mevcut. Yeni bir aktarım yapılmayacak.</p>`
                  : invalidRows.length > 0
                    ? `
                      <div class="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-xl text-left">
                        <p class="text-[11px] text-red-600 font-black mb-1 border-b border-red-200 pb-1">🚨 Hatalı Satır Detayları:</p>
                        <ul class="text-[10px] text-red-500 font-medium max-h-32 overflow-y-auto space-y-1 mt-1 pr-1 custom-scrollbar">
                          ${invalidRows.map((r) => `<li><b class="text-red-700">Satır ${r.Satır}:</b> ${r.Hata}</li>`).join("")}
                        </ul>
                      </div>
                    `
                    : `<p class="text-[10px] text-gray-400 mt-3 italic text-center leading-tight">Mevcut olanlar ve hatalılar otomatik es geçilip, sadece yeni veriler eklenecektir.</p>`
              }
            </div>
          `,
          icon:
            validRows.length === 0
              ? invalidRows.length > 0
                ? "error"
                : "info"
              : invalidRows.length > 0
                ? "warning"
                : "success",
          showCancelButton: validRows.length > 0,
          confirmButtonText: validRows.length > 0 ? "Evet, Aktar" : "Tamam",
          cancelButtonText: "İptal",
          confirmButtonColor: validRows.length > 0 ? "#059669" : "#3b82f6",
        });

        // Geliştirici için konsol kaydı her zaman faydalıdır, kalabilir.
        if (invalidRows.length > 0) {
          console.warn("EŞLEŞMEYEN / EKSİK KAYITLAR (Detaylı):", invalidRows);
        }

        if (confirm.isConfirmed && validRows.length > 0) {
          setIsImporting(true);
          let res;

          if (activeTab === "sirket")
            res = await tanimlamalarService.importOrganization(validRows);
          else if (activeTab === "program")
            res = await tanimlamalarService.importProgramBilgisi(validRows);
          else if (activeTab === "oyun")
            res = await tanimlamalarService.importOyunBilgisi(validRows);
          else if (activeTab === "gorev")
            res = await tanimlamalarService.importGorev(validRows);

          if (res?.success) {
            toast.success(res.message || "Veriler başarıyla aktarıldı!");
            if (onImportSuccess) onImportSuccess(); // Tabloyu yenile
          } else {
            toast.error(res?.message || "Aktarım sırasında hata oluştu.");
          }
        }
      } catch (error) {
        console.error("Excel okuma hatası:", error);
        toast.error("Dosya okunurken bir hata oluştu.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(config.template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sablon");
    XLSX.writeFile(wb, `${config.title.replace(/\s+/g, "_")}_Sablonu.xlsx`);
  };

  const triggerFileInputWithInfo = () => {
    if (isImporting) return;

    Swal.fire({
      title: `<span class="text-xl font-black text-gray-800">${config.title} Şablonu</span>`,
      html: `
        <div class="text-left text-sm text-gray-600 mt-2 space-y-3">
          <div class="bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-xs text-blue-700 leading-tight">
             <strong>Bilgi:</strong> ${config.desc}
          </div>
          <p>Lütfen yükleyeceğiniz Excel dosyasının <strong>sütun sırasının</strong> aşağıdaki gibi olduğundan emin olun:</p>
          <ul class="list-decimal list-inside font-bold text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
            ${config.cols.map((col, i) => `<li>${String.fromCharCode(65 + i)} Sütunu: <span class="${textColors[i] || "text-gray-600"}">${col}</span></li>`).join("")}
          </ul>
          <p class="text-[10px] italic text-gray-400">*İlk satır başlık olarak kabul edilir ve aktarılmaz.</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Anladım, Dosya Seç",
      cancelButtonText: "İptal",
      confirmButtonColor: "#059669",
    }).then((result) => {
      if (result.isConfirmed) {
        fileInputRef.current?.click();
      }
    });
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <button
        onClick={downloadTemplate}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95"
      >
        <FontAwesomeIcon icon={faDownload} />
        <span className="hidden sm:inline">Şablon İndir</span>
        <span className="sm:hidden">Şablon</span>
      </button>

      <div className="relative group flex-1 sm:flex-none">
        <button
          onClick={triggerFileInputWithInfo}
          disabled={isImporting}
          className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 disabled:opacity-50"
        >
          <FontAwesomeIcon
            icon={isImporting ? faSpinner : faFileExcel}
            spin={isImporting}
            className="group-hover:scale-110 transition-transform"
          />
          <span>{isImporting ? "Aktarılıyor..." : "Excel İçeri Aktar"}</span>
        </button>

        <div className="absolute top-full right-0 mt-3 w-56 bg-slate-800 text-white text-[10px] p-3.5 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
          <div className="font-bold text-emerald-400 mb-2 border-b border-slate-600 pb-1.5 uppercase tracking-widest">
            Sütun Sırası
          </div>
          <div className="space-y-1 text-slate-200 font-medium">
            {config.cols.map((col, i) => (
              <p key={i}>
                {i + 1}.{" "}
                <span
                  className={`${tooltipColors[i] || "text-gray-300"} font-bold`}
                >
                  {col}
                </span>
              </p>
            ))}
          </div>
          <div className="text-slate-400 italic mt-2.5 pt-2 border-t border-slate-700/50 text-[9px] leading-tight">
            *İlk satır (başlıklar) otomatik atlanır.
          </div>
          <div className="absolute bottom-full right-6 border-8 border-transparent border-b-slate-800"></div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheckCircle,
  faArrowRight,
  faBan,
  faRotateLeft,
  faXmark,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function DecisionArea({
  note,
  setNote,
  canAction,
  isProcessing,
  currentStageId,
  statusId,
  onProcess,
  isIKGroup,
  hasUserAction, // 🔥 ApplicationModal'dan gelen bilgi
}) {
  const isApproved = statusId === 3;
  const isRejected = statusId === 4;
  const isRevisionPending = statusId === 5; // BasvuruDurum.RevizeTalebi = 5

  const isNoteValid = note.trim().length >= 13;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 bg-gray-800/30 border-b border-gray-800 flex items-center">
        <div className="w-1 h-3 bg-sky-50 rounded-full mr-2"></div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Karar & Açıklama
        </span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative group">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isRevisionPending
                  ? "Revize talebi hakkında yönetici kararı..."
                  : "İşlem notunuzu buraya yazınız (En az 13 karakter)..."
              }
              disabled={
                isProcessing ||
                (!canAction && !isRevisionPending && !hasUserAction)
              }
              className={`w-full min-h-40 p-4 bg-gray-800/50 border rounded-xl text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-all resize-none focus:bg-gray-800 ${note.trim().length > 0 && !isNoteValid ? "border-red-500/50 focus:border-red-500" : "border-gray-700 focus:border-sky-500"}`}
            />

            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
              {!isNoteValid && note.trim().length > 0 && (
                <span className="text-[9px] text-red-400 font-bold flex items-center gap-1 animate-pulse">
                  <FontAwesomeIcon icon={faCircleExclamation} /> EN AZ 13
                  KARAKTER GİRMELİSİNİZ
                </span>
              )}
              <div
                className={`text-[9px] font-black px-2 py-1 rounded-md border transition-colors ${isNoteValid ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-900 text-gray-500 border-gray-700"}`}
              >
                {note.trim().length} / 13 KARAKTER
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-center gap-3">
            {isRevisionPending ? (
              isIKGroup ? (
                <>
                  <button
                    onClick={() => onProcess("approve_revision")}
                    disabled={!isNoteValid || isProcessing}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-3 transition-all shadow-lg ${isNoteValid && !isProcessing ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"}`}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} /> Revizeyi Onayla
                  </button>
                  <button
                    onClick={() => onProcess("reject_revision")}
                    disabled={!isNoteValid || isProcessing}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-3 transition-all border ${isNoteValid && !isProcessing ? "border-red-500/30 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"}`}
                  >
                    <FontAwesomeIcon icon={faXmark} /> Talebi Reddet
                  </button>
                </>
              ) : (
                <div className="p-4 border-2 border-dashed border-amber-800/50 rounded-xl text-center bg-amber-900/10">
                  <p className="text-[10px] font-bold text-amber-500 uppercase">
                    Revize Onayı Bekleniyor
                  </p>
                </div>
              )
            ) : canAction ? (
              <>
                <button
                  onClick={() => onProcess("approve")}
                  disabled={!isNoteValid || isProcessing}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-3 transition-all shadow-lg ${isNoteValid && !isProcessing ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"}`}
                >
                  {isProcessing ? (
                    <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={
                          currentStageId === 4 ? faCheckCircle : faArrowRight
                        }
                        size="lg"
                      />{" "}
                      {currentStageId === 1
                        ? "Departmana Sevk Et"
                        : "Onayla ve İlerlet"}
                    </>
                  )}
                </button>
                <button
                  onClick={() => onProcess("reject")}
                  disabled={!isNoteValid || isProcessing}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-3 transition-all border ${isNoteValid && !isProcessing ? "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/30" : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"}`}
                >
                  {isProcessing ? (
                    <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faBan} size="lg" /> Başvuruyu
                      Reddet
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-4 border-2 border-dashed border-gray-800 rounded-xl text-center bg-gray-800/20">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    {isApproved
                      ? "Onaylandı"
                      : isRejected
                        ? "Reddedildi"
                        : "Sıra Sizde Değil"}
                  </p>
                </div>
                {/*  Sadece işlem yapmışsa revize isteyebilir */}
                {hasUserAction && (
                  <button
                    onClick={() => onProcess("request_revision")}
                    disabled={!isNoteValid || isProcessing}
                    className={`w-full py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${isNoteValid && !isProcessing ? "bg-amber-600/20 border border-amber-600/30 text-amber-500 hover:bg-amber-600 hover:text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"}`}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} /> Revize Talebi Gönder
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useCallback } from "react";

/**
 * ESC ile kapatma + backdrop tıklayınca kapatma
 * @param {boolean} open - modal açık mı?
 * @param {function} onClose - kapatma callback'i
 * @param {object} dialogRef - içerideki modal kutusunun ref'i
 * @returns {function} onBackdropClick - backdrop'a verilecek handler
 */
export default function useModalDismiss(open, onClose, dialogRef) {
  // ESC ile kapatma
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Arka Plan Tıklayınca Kapat
  const onBackdropClick = useCallback(
    (e) => {
      if (dialogRef?.current && !dialogRef.current.contains(e.target)) {
        onClose?.();
      }
    },
    [dialogRef, onClose],
  );

  return onBackdropClick;
}

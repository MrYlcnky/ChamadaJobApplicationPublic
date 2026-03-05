// src/components/LanguageSwitcher.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LANGS = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const current = useMemo(
    () =>
      LANGS.find((l) => l.code === (i18n.resolvedLanguage || i18n.language)) ??
      LANGS[0],
    [i18n.resolvedLanguage, i18n.language]
  );

  const other = useMemo(
    () => LANGS.find((l) => l.code !== current.code) ?? LANGS[0],
    [current.code]
  );

  useEffect(() => {
    const onDoc = (e) => {
      if (!open) return;
      if (
        btnRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const alertError = (err) => {
    const isTr = (i18n.resolvedLanguage || i18n.language) === "tr";
    Swal.fire({
      icon: "error",
      title: isTr ? "Bir hata oluştu" : "An error occurred",
      text:
        (err && (err.message || String(err))) ||
        (isTr ? "Bilinmeyen hata" : "Unknown error"),
      confirmButtonText: isTr ? "Tamam" : "OK",
    });
  };

  const switchToOther = async () => {
    try {
      await i18n.changeLanguage(other.code);
    } catch (err) {
      alertError(err);
      return; // Dil değişmediyse menüyü kapatma
    }

    try {
      localStorage.setItem("app.lang", other.code);
    } catch (err) {
      alertError(err);
    }

    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mevcut dil (butonda) */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center h-9 min-w-9 px-2 gap-2 text-base rounded-lg hover:bg-white/10 focus:outline-none cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        title={current.label}
        aria-label={current.label}
      >
        {/* Bayrak */}
        <span className="text-xl leading-none">{current.flag}</span>
      </button>

      {/* Menü: sadece diğer dilin bayrağı */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-1 z-50 rounded-xl border border-white/10 bg-black/50 shadow-2xl p-1"
        >
          <button
            type="button"
            role="menuitem"
            onClick={switchToOther}
            className="flex items-center justify-center h-9 w-9 text-xl rounded-lg text-white hover:bg-white/20 focus:bg-white/20 focus:outline-none cursor-pointer"
            title={other.label}
            aria-label={`Switch to ${other.label}`}
          >
            {other.flag}
          </button>
        </div>
      )}
    </div>
  );
}

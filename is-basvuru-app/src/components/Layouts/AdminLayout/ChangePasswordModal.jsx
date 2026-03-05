// src/components/Layouts/AdminLayout/ChangePasswordModal.jsx

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faXmark,
  faSpinner,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { panelUserService } from "../../../services/panelUserService";

export default function ChangePasswordModal({ auth, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Tüm alanlar zorunludur.");
      return;
    }
    if (newPassword.length < 3) {
      setError("Yeni şifre en az 3 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: auth.id,
        eskiSifre: oldPassword,
        yeniSifre: newPassword,
        yeniSifreTekrar: confirmPassword,
      };

      const result = await panelUserService.ChangePassword(payload);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: result.message || "Şifreniz başarıyla değiştirildi.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#0ea5e9",
        });
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Şifre değiştirme hatası:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-900/60  transition-opacity"
        aria-hidden="true"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md max-h-[95vh] sm:max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Dekoratif Üst Çizgi */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 shrink-0"></div>

        {/* Header - Sabit Kalmalı */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} className="text-sky-500" />
              Şifre Değiştir
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Hesap güvenliğiniz için şifrenizi güncelleyin.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Form - Kaydırılabilir Alan */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar">
            <FormInput
              label="Mevcut Şifre"
              id="oldPassword"
              type="password"
              placeholder="Eski şifrenizi girin"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
            />

            <div className="relative py-2">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900 px-2 text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Yeni Bilgiler
                </span>
              </div>
            </div>

            <FormInput
              label="Yeni Şifre"
              id="newPassword"
              type="password"
              placeholder="Yeni şifre belirleyin"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />

            <FormInput
              label="Yeni Şifre (Tekrar)"
              id="confirmPassword"
              type="password"
              placeholder="Yeni şifreyi doğrulayın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1">
                <FontAwesomeIcon icon={faXmark} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer - Sabit Kalmalı */}
          <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-900/50 shrink-0">
            <div className="flex flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium text-xs sm:text-sm hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[1.5] px-3 py-2.5 rounded-xl bg-linear-to-r from-sky-600 to-blue-600 text-white font-bold text-xs sm:text-sm hover:from-sky-500 hover:to-blue-500 shadow-lg shadow-sky-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Kaydet"}
                <span className="hidden xs:inline">
                  {loading ? "Kaydediliyor..." : ""}
                </span>
                {!loading && <span className="inline xs:hidden">Onayla</span>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Göz İkonlu Modern Input Bileşeni
function FormInput({
  label,
  id,
  type,
  value,
  onChange,
  disabled,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5 group">
      <label
        htmlFor={id}
        className="block text-[11px] sm:text-xs font-semibold text-slate-400 ml-1 group-focus-within:text-sky-500 transition-colors"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <FontAwesomeIcon
            icon={faLock}
            className="text-slate-500 text-xs sm:text-sm group-focus-within:text-sky-500 transition-colors"
          />
        </div>

        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-800/40 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-sky-400 transition-colors focus:outline-none touch-manipulation"
            tabIndex="-1"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-xs sm:text-sm"
            />
          </button>
        )}
      </div>
    </div>
  );
}

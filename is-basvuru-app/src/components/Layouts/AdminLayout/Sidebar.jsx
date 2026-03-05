import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faHome,
  faUserShield,
  faTools,
  faClipboardList,
  faChevronDown,
  faSignOutAlt,
  faKey,
  faUsers,
  faBuilding,
  faGlobe,
  faListCheck,
  faTrashCan,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../../services/authService";

export default function Sidebar({
  isOpen,
  onClose,
  auth,
  isSuperAdmin,
  canManageUsers,
  canViewLogs,
  onOpenPasswordModal,
}) {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const menuLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-sky-600 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* Arka Plan Karartma */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-100 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Paneli */}
      <div
        className={`fixed top-0 left-0 h-full w-70 bg-gray-900 border-r border-gray-800 z-101 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header - Kullanıcı Bilgisi */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-white text-xl"
              />
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-white font-bold truncate text-sm">
                {auth?.adi} {auth?.soyadi}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-black">
                {auth?.rolAdi}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-2"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        {/* Menü Linkleri */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavLink
            to="/admin/panel"
            onClick={onClose}
            className={menuLinkClass}
          >
            <FontAwesomeIcon icon={faHome} className="w-5 text-center" />
            <span className="font-medium text-sm text-left flex-1">
              Başvuru Yönetimi
            </span>
          </NavLink>

          {/* SÜPER ADMİN BÖLÜMÜ */}
          {isSuperAdmin && (
            <div className="space-y-1">
              <button
                onClick={() => toggleSubMenu("super")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${openSubMenu === "super" ? "bg-red-600/10 text-red-500 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUserShield} className="w-5" />
                  <span className="font-medium text-sm">Süper Admin</span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs transition-transform ${openSubMenu === "super" ? "rotate-180" : ""}`}
                />
              </button>
              {openSubMenu === "super" && (
                <div className="pl-6 space-y-1 mt-1 border-l border-red-900/30 ml-6">
                  <SidebarSubLink
                    to="/admin/approval-logs"
                    icon={faListCheck}
                    label="KVKK & IP Logları"
                    onClick={onClose}
                  />
                  <SidebarSubLink
                    to="/admin/applications"
                    icon={faTrashCan}
                    label="Başvuruları Yönet"
                    onClick={onClose}
                  />
                </div>
              )}
            </div>
          )}

          {/* YÖNETİCİ İŞLEMLERİ BÖLÜMÜ */}
          {canManageUsers && (
            <div className="space-y-1">
              <button
                onClick={() => toggleSubMenu("admin")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${openSubMenu === "admin" ? "bg-blue-600/10 text-blue-500 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faTools} className="w-5" />
                  <span className="font-medium text-sm text-left">
                    Yönetici İşlemleri
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs transition-transform ${openSubMenu === "admin" ? "rotate-180" : ""}`}
                />
              </button>
              {openSubMenu === "admin" && (
                <div className="pl-6 space-y-1 mt-1 border-l border-blue-900/30 ml-6">
                  <SidebarSubLink
                    to="/admin/users"
                    icon={faUsers}
                    label="Personel Yönetimi"
                    onClick={onClose}
                  />
                  <SidebarSubLink
                    to="/admin/definitions"
                    icon={faBuilding}
                    label="Şirket Tanımları"
                    onClick={onClose}
                  />
                  <SidebarSubLink
                    to="/admin/form-definitions"
                    icon={faGlobe}
                    label="Form Tanımları"
                    onClick={onClose}
                  />
                </div>
              )}
            </div>
          )}

          {/* LOGLAR BÖLÜMÜ */}
          {canViewLogs && (
            <div className="space-y-1">
              <button
                onClick={() => toggleSubMenu("log")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${openSubMenu === "log" ? "bg-purple-600/10 text-purple-500 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="w-5 text-center"
                  />
                  <span className="font-medium text-sm">Log Yönetimi</span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs transition-transform ${openSubMenu === "log" ? "rotate-180" : ""}`}
                />
              </button>
              {openSubMenu === "log" && (
                <div className="pl-6 space-y-1 mt-1 border-l border-purple-900/30 ml-6">
                  <SidebarSubLink
                    to="/admin/logs"
                    icon={faClipboardList}
                    label="İK İşlem Logları"
                    onClick={onClose}
                  />
                  <SidebarSubLink
                    to="/admin/user-logs"
                    icon={faUsers}
                    label="Kullanıcı Logları"
                    onClick={onClose}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Şifre ve Çıkış */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/20">
          <button
            onClick={() => {
              onOpenPasswordModal();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm mb-2"
          >
            <FontAwesomeIcon icon={faKey} className="w-5" />
            <span className="font-medium">Şifre Değiştir</span>
          </button>
          <button
            onClick={() => {
              authService.logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-bold"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarSubLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
          isActive
            ? "text-sky-400 bg-sky-500/5"
            : "text-gray-500 hover:text-gray-300"
        }`
      }
    >
      <FontAwesomeIcon icon={icon} className="w-4 text-center" />
      <span className="text-left">{label}</span>
    </NavLink>
  );
}

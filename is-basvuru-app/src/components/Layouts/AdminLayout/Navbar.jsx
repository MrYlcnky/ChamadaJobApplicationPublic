import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faSignOutAlt,
  faKey,
  faClipboardList,
  faUsers,
  faCaretDown,
  faChevronRight,
  faUserShield,
  faTools,
  faBuilding,
  faGlobe,
  faHome,
  faListCheck,
  faTrashCan,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../../services/authService";
import { basvuruService } from "../../../services/basvuruService";
import ChangePasswordModal from "./ChangePasswordModal";
import Sidebar from "./Sidebar";
import logo from "../../../assets/group.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- DROPDOWN STATE'LERİ ---
  const [notifications, setNotifications] = useState([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogMenuOpen, setIsLogMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSuperAdminMenuOpen, setIsSuperAdminMenuOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const bellRef = useRef(null);
  const userMenuRef = useRef(null);
  const logMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  const superAdminMenuRef = useRef(null);

  // Dışarı tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target))
        setIsBellOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setIsUserMenuOpen(false);
      if (logMenuRef.current && !logMenuRef.current.contains(event.target))
        setIsLogMenuOpen(false);
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target))
        setIsAdminMenuOpen(false);
      if (
        superAdminMenuRef.current &&
        !superAdminMenuRef.current.contains(event.target)
      )
        setIsSuperAdminMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("authUser");
      setAuth(raw ? JSON.parse(raw) : null);
    } catch {
      setAuth(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const fetchNotifications = async () => {
      try {
        const res = await basvuruService.getNotifications();
        const formatted = (res?.data || []).map((n) => ({
          id: n.basvuruId,
          basvuruId: n.basvuruId,
          ad: `${n.personelAd} ${n.personelSoyad}`,
          tarih: new Date(n.basvuruTarihi).toLocaleDateString("tr-TR"),
          mesaj: "Yeni onay bekleyen başvuru.",
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [auth]);

  const displayNotifications = notifications.slice(0, 2);
  const extraCount = notifications.length - 2;

  const roleName = auth?.rolAdi;
  const roleId = auth?.rolId;
  const canViewLogs =
    ["SuperAdmin", "Admin", "IkAdmin"].includes(roleName) ||
    [1, 2, 3].includes(roleId);
  const canManageUsers =
    ["SuperAdmin", "Admin"].includes(roleName) || [1, 2].includes(roleId);
  const isSuperAdmin = roleName === "SuperAdmin" || roleId === 1;

  const dropdownBaseStyle =
    "absolute right-0 mt-3 origin-top-right rounded-2xl bg-white border border-gray-100 shadow-2xl z-50 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-top-2";

  return (
    <>
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 z-40 h-20 flex items-center text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              className="shrink-0 cursor-pointer group"
              onClick={() => navigate("/admin/panel")}
            >
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
            </div>

            {/* MASAÜSTÜ MENÜ */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/panel")}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-all font-medium text-sm"
              >
                <FontAwesomeIcon icon={faHome} className="text-xs" />
                <span>Başvuru Yönetimi</span>
              </button>

              {isSuperAdmin && (
                <div className="relative" ref={superAdminMenuRef}>
                  <button
                    onClick={() =>
                      setIsSuperAdminMenuOpen(!isSuperAdminMenuOpen)
                    }
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${isSuperAdminMenuOpen ? "bg-red-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"}`}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="text-xs" />
                    <span>Süper Admin</span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-[10px] transition-transform ${isSuperAdminMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isSuperAdminMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="p-2 space-y-1">
                        <DesktopSubLink
                          to="/admin/approval-logs"
                          icon={faListCheck}
                          label="KVKK & IP Logları"
                          sub="Onay geçmişi ve IP kayıtları"
                          onClick={() => setIsSuperAdminMenuOpen(false)}
                        />
                        <DesktopSubLink
                          to="/admin/applications"
                          icon={faTrashCan}
                          label="Başvuruları Yönet"
                          sub="Kayıtları kalıcı olarak sil"
                          onClick={() => setIsSuperAdminMenuOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {canManageUsers && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${isAdminMenuOpen ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"}`}
                  >
                    <FontAwesomeIcon icon={faTools} className="text-xs" />
                    <span>Yönetici İşlemleri</span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-[10px] transition-transform ${isAdminMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isAdminMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="p-2 space-y-1">
                        <DesktopSubLink
                          to="/admin/users"
                          icon={faUsers}
                          label="Personel Yönetimi"
                          sub="Yetkili kullanıcıları yönet"
                          onClick={() => setIsAdminMenuOpen(false)}
                        />
                        <DesktopSubLink
                          to="/admin/definitions"
                          icon={faBuilding}
                          label="Şirket Tanımları"
                          sub="Birim ve organizasyon ayarları"
                          onClick={() => setIsAdminMenuOpen(false)}
                        />
                        <DesktopSubLink
                          to="/admin/form-definitions"
                          icon={faGlobe}
                          label="Form Tanımları"
                          sub="Ülke, Şehir ve Dil ayarları"
                          onClick={() => setIsAdminMenuOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {canViewLogs && (
                <div className="relative" ref={logMenuRef}>
                  <button
                    onClick={() => setIsLogMenuOpen(!isLogMenuOpen)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${isLogMenuOpen ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"}`}
                  >
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className="text-xs"
                    />
                    <span>Loglar</span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-[10px] transition-transform ${isLogMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isLogMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="p-2 space-y-1">
                        <DesktopSubLink
                          to="/admin/logs"
                          icon={faClipboardList}
                          label="İK İşlem Logları"
                          sub="Başvuru işlem tarihçesi"
                          onClick={() => setIsLogMenuOpen(false)}
                        />
                        <DesktopSubLink
                          to="/admin/user-logs"
                          icon={faUsers}
                          label="Kullanıcı Logları"
                          sub="Sisteme giriş kayıtları"
                          onClick={() => setIsLogMenuOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SAĞ TARAF: BİLDİRİM & KULLANICI & MOBİL BUTON */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Bildirim Çanı */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className={`relative p-2.5 rounded-full transition-all ${isBellOpen ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800"}`}
              >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-rose-600 rounded-full text-[10px] font-bold text-white border-2 border-gray-900 flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* BİLDİRİM AÇILIR MENÜSÜ (MOBİLDE KÜÇÜLTÜLDÜ) */}
              {isBellOpen && (
                <div
                  className={`${dropdownBaseStyle} w-70 xs:w-[320px] sm:w-80 -right-4 sm:right-0 max-h-[60vh] sm:max-h-[70vh] flex flex-col shadow-2xl`}
                >
                  <div className="p-3 sm:p-4 bg-gray-50 border-b flex justify-between items-center shrink-0">
                    <span className="font-bold text-gray-800 text-xs sm:text-base">
                      Bildirimler
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Yeni
                    </span>
                  </div>
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {notifications.length > 0 ? (
                      <div className="p-1.5 sm:p-2 space-y-1">
                        {displayNotifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              navigate(`/admin/panel?openId=${n.basvuruId}`);
                              setIsBellOpen(false);
                            }}
                            className="w-full p-2 sm:p-3 hover:bg-gray-50 rounded-xl text-left flex gap-2 sm:gap-3 border-b border-gray-50 last:border-0 transition-colors"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0 text-[10px] sm:text-xs">
                              {n.ad.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex justify-between items-center">
                                <span className="font-bold truncate text-gray-800 text-[11px] sm:text-sm">
                                  {n.ad}
                                </span>
                                <span className="text-[8px] sm:text-[9px] text-gray-400 whitespace-nowrap ml-2">
                                  {n.tarih}
                                </span>
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                                {n.mesaj}
                              </div>
                            </div>
                          </button>
                        ))}
                        {extraCount > 0 && (
                          <div className="w-full py-2.5 sm:py-3 text-center text-[10px] sm:text-[11px] font-black text-gray-400 border-t border-gray-100 mt-1 uppercase tracking-tighter">
                            + {extraCount} Diğer Bekleyen Başvuru
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 sm:p-10 text-center text-gray-400 text-xs sm:text-sm italic">
                        Bildirim yok.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kullanıcı Menüsü */}
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-3 rounded-full pl-1 pr-3 py-1 transition-all border ${isUserMenuOpen ? "bg-gray-800 border-gray-700" : "border-transparent hover:bg-gray-800"}`}
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-gray-200 leading-none">
                    {auth?.adi}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase mt-0.5">
                    {auth?.rolAdi}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="text-[10px] text-gray-600"
                />
              </button>
              {isUserMenuOpen && (
                <div className={`${dropdownBaseStyle} w-60 right-0 mt-3`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsChangePasswordModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faKey} className="text-gray-400" />{" "}
                      Şifre Değiştir
                    </button>
                    <button
                      onClick={() => authService.logout()}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors mt-1 border-t border-gray-50 pt-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors ml-1"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        auth={auth}
        isSuperAdmin={isSuperAdmin}
        canManageUsers={canManageUsers}
        canViewLogs={canViewLogs}
        onOpenPasswordModal={() => setIsChangePasswordModalOpen(true)}
      />

      {isChangePasswordModalOpen && auth && (
        <ChangePasswordModal
          auth={auth}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </>
  );
}

function DesktopSubLink({ to, icon, label, sub, onClick }) {
  const getColorClasses = () => {
    // Tam eşleşme ve özel kontroller
    if (to === "/admin/approval-logs") return "bg-red-100 text-red-600";
    if (to === "/admin/applications") return "bg-orange-100 text-orange-600";
    if (to === "/admin/users") return "bg-sky-100 text-sky-600";
    if (to === "/admin/definitions") return "bg-amber-100 text-amber-600"; // Turuncu (Şirket)
    if (to === "/admin/form-definitions")
      return "bg-emerald-100 text-emerald-600"; // Yeşil (Form)
    if (to === "/admin/user-logs") return "bg-purple-100 text-purple-600"; // Mor (Kullanıcı Log)
    if (to === "/admin/logs") return "bg-blue-100 text-blue-600"; // Mavi (İK Logları)
    return "bg-gray-100 text-gray-600";
  };

  const classes = getColorClasses();
  const textCol = classes.split(" ")[1]; // text-red-600 gibi

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-gray-50 shadow-inner" : "text-gray-700 hover:bg-gray-50"}`
      }
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${classes}`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="text-left flex-1 font-sans">
        <span className={`block text-sm font-bold leading-none ${textCol}`}>
          {label}
        </span>
        <span className="block text-[10px] text-gray-400 mt-1">{sub}</span>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="text-[10px] opacity-20"
      />
    </NavLink>
  );
}

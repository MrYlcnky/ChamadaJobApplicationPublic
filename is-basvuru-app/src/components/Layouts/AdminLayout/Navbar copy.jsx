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
} from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../../services/authService";
import { basvuruService } from "../../../services/basvuruService";
import ChangePasswordModal from "./ChangePasswordModal";
import logo from "../../../assets/ch.ico";

// Dışarı tıklamayı algılayan hook
function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);

  // --- BİLDİRİM & DROPDOWN STATE'LERİ ---
  const [notifications, setNotifications] = useState([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogMenuOpen, setIsLogMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // 🔥 YENİ: Süper Admin Menü State'i
  const [isSuperAdminMenuOpen, setIsSuperAdminMenuOpen] = useState(false);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const bellRef = useRef(null);
  const userMenuRef = useRef(null);
  const logMenuRef = useRef(null);
  const adminMenuRef = useRef(null);
  const superAdminMenuRef = useRef(null); // 🔥 YENİ

  useOutsideAlerter(bellRef, () => setIsBellOpen(false));
  useOutsideAlerter(userMenuRef, () => setIsUserMenuOpen(false));
  useOutsideAlerter(logMenuRef, () => setIsLogMenuOpen(false));
  useOutsideAlerter(adminMenuRef, () => setIsAdminMenuOpen(false));
  useOutsideAlerter(superAdminMenuRef, () => setIsSuperAdminMenuOpen(false)); // 🔥 YENİ

  // Auth Bilgisini Al
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("authUser");
      const parsedAuth = raw ? JSON.parse(raw) : null;
      setAuth(parsedAuth);
    } catch {
      setAuth(null);
    }
  }, []);

  // --- BİLDİRİMLERİ SERVİSTEN ÇEK ---
  useEffect(() => {
    if (!auth) return;

    const fetchNotifications = async () => {
      try {
        const res = await basvuruService.getNotifications();
        const rawList = res?.data || [];

        const formatted = rawList.map((n) => ({
          id: n.basvuruId,
          basvuruId: n.basvuruId,
          ad: `${n.personelAd} ${n.personelSoyad}`,
          tarih: new Date(n.basvuruTarihi).toLocaleDateString("tr-TR"),
          mesaj: "Yeni onay bekleyen başvuru.",
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Bildirimler çekilemedi:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [auth]);

  // Bildirim Hesaplamaları
  const displayNotifications = notifications.slice(0, 2);
  const extraCount = notifications.length - 2;

  // --- YETKİ KONTROLLERİ ---
  const roleName = auth?.rolAdi;
  const roleId = auth?.rolId;

  const canViewLogs =
    ["SuperAdmin", "Admin", "IkAdmin"].includes(roleName) ||
    [1, 2, 3].includes(roleId);
  const canManageUsers =
    ["SuperAdmin", "Admin"].includes(roleName) || [1, 2].includes(roleId);

  // 🔥 YENİ: Sadece SuperAdmin Görebilsin (Kendi sistemindeki isme göre ayarla)
  const isSuperAdmin = roleName === "SuperAdmin" || roleId === 1;

  const dropdownBaseStyle =
    "absolute right-0 mt-3 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-top-2";

  return (
    <>
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
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

            <div className="flex items-center gap-3">
              {/* Home Butonu */}
              <button
                onClick={() => navigate("/admin/panel")}
                className="group flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 cursor-pointer text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faHome} className="text-sm" />
                </div>
                <span className="text-sm font-medium hidden md:block">
                  Başvuru Yönetimi
                </span>
              </button>

              {/* 🔥 YENİ: SÜPER ADMİN DROPDOWN 🔥 */}
              {isSuperAdmin && (
                <div className="relative" ref={superAdminMenuRef}>
                  <button
                    onClick={() =>
                      setIsSuperAdminMenuOpen(!isSuperAdminMenuOpen)
                    }
                    className={`group flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 cursor-pointer ${
                      isSuperAdminMenuOpen
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="text-sm" />
                    <span className="text-sm font-medium hidden md:block">
                      Süper Admin
                    </span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-xs transition-transform ${
                        isSuperAdminMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isSuperAdminMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          Özel İşlemler
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <NavLink
                          to="/admin/approval-logs"
                          onClick={() => setIsSuperAdminMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-red-50 text-red-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`
                          }
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faListCheck} />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-bold">
                              KVKK & IP Logları
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Adayların onay geçmişi ve IP kayıtları
                            </span>
                          </div>
                        </NavLink>

                        <NavLink
                          to="/admin/applications"
                          onClick={() => setIsSuperAdminMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`
                          }
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faTrashCan} />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-bold">
                              Başvuruları Yönet
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Kayıtları kalıcı olarak sil/kaldır
                            </span>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Yönetici İşlemleri Dropdown */}
              {canManageUsers && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className={`group flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 cursor-pointer ${
                      isAdminMenuOpen
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                    }`}
                  >
                    <FontAwesomeIcon icon={faTools} className="text-sm" />
                    <span className="text-sm font-medium hidden md:block">
                      Yönetici İşlemleri
                    </span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-xs transition-transform ${
                        isAdminMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isAdminMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          Sistem Yönetimi
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <NavLink
                          to="/admin/users"
                          onClick={() => setIsAdminMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`
                          }
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-bold">
                              Personel Yönetimi
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Yetkili kullanıcıları yönet
                            </span>
                          </div>
                        </NavLink>
                        <NavLink
                          to="/admin/definitions"
                          onClick={() => setIsAdminMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-amber-50 text-amber-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`
                          }
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faBuilding} />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-bold">
                              Şirket Tanımları
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Birim ve organizasyon yönetimi
                            </span>
                          </div>
                        </NavLink>
                        <NavLink
                          to="/admin/form-definitions"
                          onClick={() => setIsAdminMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`
                          }
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faGlobe} />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-bold">
                              Form Tanımları
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Ülke, Şehir, Dil ve Diğerleri
                            </span>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Loglar Dropdown */}
              {canViewLogs && (
                <div className="relative" ref={logMenuRef}>
                  <button
                    onClick={() => setIsLogMenuOpen(!isLogMenuOpen)}
                    className={`group flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 ${
                      isLogMenuOpen
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isLogMenuOpen
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-gray-800"
                      }`}
                    >
                      <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <span className="text-sm font-medium hidden md:block">
                      Loglar
                    </span>
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={`text-xs transition-transform ${
                        isLogMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isLogMenuOpen && (
                    <div className={`${dropdownBaseStyle} w-72`}>
                      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                        <span className="text-xs font-bold text-gray-400 uppercase">
                          Log Yönetimi
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            navigate("/admin/logs");
                            setIsLogMenuOpen(false);
                          }}
                          className="group flex w-full items-start gap-4 px-4 py-3 rounded-xl hover:bg-sky-50 transition-colors"
                        >
                          <div className="mt-1 w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faClipboardList} />
                          </div>
                          <div className="text-left flex-1">
                            <span className="block text-sm font-bold text-gray-800">
                              İK İşlem Logları
                            </span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">
                              Başvuru ve onay tarihçesi
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="text-gray-300 group-hover:text-sky-500 mt-2 text-xs"
                          />
                        </button>
                        <button
                          onClick={() => {
                            navigate("/admin/user-logs");
                            setIsLogMenuOpen(false);
                          }}
                          className="group flex w-full items-start gap-4 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors"
                        >
                          <div className="mt-1 w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <div className="text-left flex-1">
                            <span className="block text-sm font-bold text-gray-800">
                              Kullanıcı Logları
                            </span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">
                              Giriş kayıtları ve yetkiler
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="text-gray-300 group-hover:text-purple-500 mt-2 text-xs"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BİLDİRİM ÇANI DROPDOWN */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setIsBellOpen(!isBellOpen)}
                  className={`relative flex items-center gap-2 rounded-full px-3 py-2 transition-all ${
                    isBellOpen
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <div className="relative">
                    <FontAwesomeIcon icon={faBell} className="text-lg" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white border-2 border-gray-900 animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:block">
                    Bildirimler
                  </span>
                </button>
                {isBellOpen && (
                  <div className={`${dropdownBaseStyle} w-80`}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                      <h3 className="font-bold text-gray-800">Bildirimler</h3>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {notifications.length} Yeni
                      </span>
                    </div>
                    <div className="max-h-112.5 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        <div className="p-2 space-y-1">
                          {displayNotifications.map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                navigate(
                                  `/admin/panel?openId=${notif.basvuruId}`,
                                );
                                setIsBellOpen(false);
                              }}
                              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                            >
                              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 font-bold uppercase text-xs">
                                {notif.ad.substring(0, 2)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-gray-800 truncate">
                                    {notif.ad}
                                  </span>
                                  <span className="text-[10px] text-gray-400 italic">
                                    {notif.tarih}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-1">
                                  {notif.mesaj}
                                </p>
                              </div>
                            </button>
                          ))}
                          {extraCount > 0 && (
                            <div className="w-full py-2.5 text-center text-xs font-bold text-gray-400 border-t border-gray-100 mt-1 cursor-default select-none">
                              + {extraCount} Diğer Başvuru
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                          <FontAwesomeIcon
                            icon={faBell}
                            className="text-3xl mb-2 opacity-10"
                          />
                          <p className="text-sm font-medium">
                            Bekleyen işlem yok.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Kullanıcı Menüsü */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 rounded-full pl-1 pr-3 py-1 transition-all border ${
                    isUserMenuOpen
                      ? "bg-gray-800 border-gray-700"
                      : "border-transparent hover:bg-gray-800"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
                  </div>
                  <div className="hidden md:flex flex-col items-start text-xs font-bold text-gray-200">
                    <span>
                      {auth ? `${auth.adi} ${auth.soyadi}` : "Kullanıcı"}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      {auth?.rolAdi || "Personel"}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className={`text-gray-500 text-xs transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isUserMenuOpen && (
                  <div className={`${dropdownBaseStyle} w-60 right-0 mt-3`}>
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="text-xl"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {auth ? `${auth.adi} ${auth.soyadi}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {auth?.kullaniciAdi || ""}
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsChangePasswordModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <FontAwesomeIcon
                          icon={faKey}
                          className="text-gray-400"
                        />{" "}
                        Şifre Değiştir
                      </button>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          authService.logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} /> Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isChangePasswordModalOpen && auth && (
        <ChangePasswordModal
          auth={auth}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </>
  );
}

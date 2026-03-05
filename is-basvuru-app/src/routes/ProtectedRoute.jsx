import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthUser } from "../auth/session";
import Swal from "sweetalert2";

const UnauthorizedRedirect = () => {
  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "<span class='font-black text-gray-800'>Erişim Reddedildi</span>",
      html: "<span class='text-gray-500 text-sm font-medium'>Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</span>",
      confirmButtonText: "Anladım",
      confirmButtonColor: "#e11d48", // rose-600
      background: "#ffffff",
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        confirmButton:
          "rounded-xl px-6 py-2.5 font-bold uppercase tracking-wide",
      },
    });
  }, []); // Sadece bileşen ekrana geldiğinde 1 kere çalışır

  // Uyarıyı verip anında panele atar
  return <Navigate to="/admin/panel" replace />;
};

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const user = getAuthUser();
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // DTO'dan dönen veriye göre rol ID'sini alıyoruz (Backend'deki isimlendirmeye göre baş harfi büyük veya küçük olabilir)
    const userRoleId = user.rolId || user.RolId;

    // Eğer kullanıcının rolü, izin verilen roller listesinde YOKSA anasayfaya (panele) şutla
    if (!allowedRoles.includes(userRoleId)) {
      console.warn("Bu sayfaya erişim yetkiniz yok!");

      return <UnauthorizedRedirect />;
    }
  }
  return <Outlet />;
}

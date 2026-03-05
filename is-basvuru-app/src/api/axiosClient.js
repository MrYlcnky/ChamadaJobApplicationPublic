import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_API;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];

      // Accept kalabilir (istersen bırak)
      // config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// YANIT KONTROLÜ (INTERCEPTOR)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Yetkisiz erişim.");

      // 1. Tüm oturum verilerini temizle
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("authToken");

      // 2. Modern ve Şık SweetAlert2 Göster
      Swal.fire({
        icon: "warning",
        title:
          "<span class='font-black text-gray-800'>Oturum Süresi Doldu</span>",
        html: "<span class='text-gray-500 text-sm font-medium'>Güvenliğiniz için tekrar giriş yapmalısınız.</span>",
        confirmButtonText: "Tekrar Giriş Yap",
        confirmButtonColor: "#2563eb", // Tailwind blue-600
        background: "#ffffff",
        allowOutsideClick: false, // Dışarı tıklayarak kapatmayı engeller
        allowEscapeKey: false, // ESC tuşu ile kapatmayı engeller
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "rounded-xl px-6 py-2.5 font-bold uppercase tracking-wide",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // 3. Kullanıcı butona bastığında Login'e yönlendir
          window.location.href = "/login";
        }
      });
    }
    return Promise.reject(error);
  },
);

export default axiosClient;

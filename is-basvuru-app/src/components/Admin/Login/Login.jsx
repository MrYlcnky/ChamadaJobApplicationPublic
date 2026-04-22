import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faCircleNotch,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/hotels.png";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Şifre göster/gizle durumu
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Validasyon
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre alanları boş bırakılamaz.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 2. API İsteği
      const response = await authService.login(username, password);

      // 3. Başarı Kontrolü (Backend success: true dönmeli)
      if (response && response.success) {
        const { token, userInfo } = response.data;

        // 4. Token ve Kullanıcı Bilgilerini Kaydetme
        localStorage.setItem("token", token);
        sessionStorage.setItem("authUser", JSON.stringify(userInfo));
        localStorage.setItem("role", userInfo.rolAdi || "User");

        toast.success(`Hoşgeldiniz, ${userInfo.adi} ${userInfo.soyadi}`);

        // 5. Panele Yönlendirme
        navigate("/admin/panel");
      } else {
        // Backend "success: false" dediyse hatayı göster
        // response.message yoksa varsayılan mesaj gösterilir
        const failMsg =
          response.message || "Giriş başarısız. Bilgilerinizi kontrol edin.";
        setError(failMsg);
        toast.error(failMsg);
      }
    } catch (err) {
      console.error("Login hatası:", err);
      // Backend'den gelen hata mesajını veya genel hatayı yakala
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Sunucu hatası. Lütfen internet bağlantınızı kontrol edin.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4 font-sans animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/10"
        >
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner border border-gray-700">
              <img src={logo} alt="Logo" className="w-30 h-22 opacity-80" />
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tighter text-white uppercase">
              Admin <span className="text-blue-600">Paneli</span>
            </h1>
            <p className="text-xs font-bold text-gray-500 tracking-widest mt-2 uppercase">
              Yönetici Giriş Ekranı
            </p>
          </div>

          <div className="space-y-5">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3.5 text-white placeholder-gray-600 shadow-sm focus:border-blue-500 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-sm"
                placeholder="Kullanıcı adınızı giriniz"
                autoComplete="username"
              />
            </div>

            {/* Şifre Alanı */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3.5 text-white placeholder-gray-600 shadow-sm focus:border-blue-500 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-sm pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex="-1" // Tab ile odaklanmasın
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Hata Mesajı Alanı */}
            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 text-center border border-red-500/20 animate-pulse">
                <p className="text-xs font-bold text-red-400">{error}</p>
              </div>
            )}

            {/* Giriş Butonu */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center items-center gap-3 rounded-xl bg-blue-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className="animate-spin"
                    />
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <p className="text-[10px] text-gray-600 font-bold">
              &copy; {new Date().getFullYear()} Chamada Hotels. Tüm hakları
              saklıdır.
            </p>
            <p className="text-[10px] text-gray-500">
              Developed by{" "}
              <a
                href="https://chamadahotels.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold hover:text-[#0A66C2] transition-colors"
              >
                CHAMADA IT
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

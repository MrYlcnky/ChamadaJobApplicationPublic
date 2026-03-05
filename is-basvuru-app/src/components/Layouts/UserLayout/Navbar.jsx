import { Link } from "react-router-dom";
import logo from "../../../assets/group.png"; // Logo yolunu projene göre ayarla
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // Uyarı ikonu için (Opsiyonel)

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 bg-[#020617] border-b border-slate-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="shrink-0 group">
            <img
              src={logo}
              alt="Chamada Group"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]"
            />
          </Link>

          {/* Uyarı Mesajı */}
          <div className="flex-1 flex items-center p-3 rounded-lg border border-red-500/30 bg-red-900/20 backdrop-blur-sm animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-red-400">
              <span className="font-extrabold text-sm sm:text-base tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                DİKKAT: SİTE TEST AŞAMASINDADIR!
              </span>
              <span className="hidden sm:block w-px h-4 bg-red-500/50"></span>
              <span className="text-xs sm:text-sm font-medium text-red-300">
                Lütfen başvuru yapmayınız, bu süreçteki başvurularınız
                değerlendirilmeyecektir.
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

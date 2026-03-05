import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: faLinkedinIn,
      href: "https://www.linkedin.com/company/chamada-prestige-hotel/",
    },
    {
      name: "Facebook",
      icon: faFacebookF,
      href: "https://www.facebook.com/chamadahotels",
    },
    {
      name: "Instagram",
      icon: faInstagram,
      href: "https://www.instagram.com/chamadaprestige?igsh=dXZwMGltbm5jb2ts",
    },
    {
      name: "YouTube",
      icon: faYoutube,
      href: "https://www.youtube.com/channel/UC1J8r4_WzdXNneXZ6NWdhVw",
    },
  ];

  return (
    <footer className="relative bg-[#020617] pt-12 pb-8 overflow-hidden border-t border-slate-800">
      {/* Arkaplan Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-sky-500/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-50 bg-sky-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <h2 className="text-2xl font-extrabold tracking-wider text-white mb-8 drop-shadow-md">
            CHAMADA<span className="text-sky-500">GROUP</span>
          </h2>

          {/* Sosyal Medya (Navigasyon kalktığı için direkt burası geliyor) */}
          <div className="flex justify-center gap-4 mb-10">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 transition-all duration-300 hover:bg-sky-600 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                aria-label={item.name}
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg" />
              </a>
            ))}
          </div>

          {/* Alt Bilgi Barı */}
          <div className="w-full border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Sol: Telif Hakkı */}
            <p className="text-sm text-slate-500 text-center md:text-left order-2 md:order-1">
              &copy; {year} CHAMADA GROUP, Inc.
            </p>

            {/* Orta/Sağ: Geliştirici İmzası ve Durum */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-1 md:order-2">
              {/* İMZA ALANI */}
              <span className="text-sm text-slate-500">
                Developed by{" "}
                <a
                  href="https://www.linkedin.com/in/mehmetyalcinkya"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-sky-400 transition-colors font-semibold"
                >
                  Mehmet Yalçınkaya
                </a>
              </span>

              {/* Sistem Durumu (Test Aşamasında) */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Şu anda test aşamasında
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

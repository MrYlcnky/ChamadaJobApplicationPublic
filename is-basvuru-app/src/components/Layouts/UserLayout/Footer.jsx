import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import chIcon from "../../../assets/ch.ico";

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

      <div className="relative z-10 w-full bg-slate-950/40 backdrop-blur-md border-t border-slate-800/50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* 1. ÜST KISIM: Logo ve Alt Başlık */}
            <div className="flex flex-col items-center mb-8 group cursor-default">
              <h2 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-extrabold tracking-widest text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
                <img
                  src={chIcon}
                  alt="Chamada Icon"
                  className="w-10 h-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)] object-contain"
                />
                <span>
                  CHAMADA
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 ml-1">
                    GROUP
                  </span>
                </span>
              </h2>
              <div className="h-0.5 w-12 bg-sky-500/50 rounded-full mt-4 mb-2"></div>
            </div>

            {/* 2. ORTA KISIM: Sosyal Medya İkonları */}
            <div className="flex justify-center gap-4 mb-12">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-400 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-400 hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] overflow-hidden"
                  aria-label={item.name}
                >
                  {/* Hover anında arkadan gelen hafif parlama efekti */}
                  <div className="absolute inset-0 bg-linear-to-tr from-sky-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-lg relative z-10"
                  />
                </a>
              ))}
            </div>

            {/* 3. ALT KISIM: Alt Bilgi Barı */}
            <div className="w-full border-t border-slate-800/80 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Sol: Telif Hakkı */}
              <div className="text-sm font-medium text-slate-500 tracking-wide text-center md:text-left order-2 md:order-1">
                &copy; {year}{" "}
                <span className="text-slate-400">CHAMADA GROUP</span>, Inc. Tüm
                hakları saklıdır.
              </div>

              {/* Orta/Sağ: Geliştirici İmzası ve Sistem Durumu */}
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 order-1 md:order-2">
                {/* İmza Alanı */}
                <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <span className="opacity-70">Developed by</span>
                  <a
                    href="https://www.chamadahotels.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 hover:text-sky-400 transition-colors font-bold tracking-wide"
                  >
                    Chamada Group IT
                  </a>
                </span>

                {/* Ayırıcı Nokta (Sadece mobilden büyük ekranlarda görünür) */}
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-700"></div>

                {/* Sistem Durumu */}
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 shadow-inner">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                    Sistem Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

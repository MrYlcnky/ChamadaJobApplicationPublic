// src/components/Layouts/AdminLayout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    // Navbar ile uyumlu modern koyu tema
    <footer className="mt-auto py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-gray-800">
      <div className="max-w-400 mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-200">Chamada Group</span>.
          Tüm hakları saklıdır.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Yardım
            </span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">
              Gizlilik
            </span>
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700">
              v1.0.0
            </span>
          </div>

          {/* İmza */}
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="text-gray-500">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/mehmetyalcinkya"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Mehmet Yalçınkaya
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

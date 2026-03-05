// src/components/Layouts/AdminLayout/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    // Ana sayfa arka planını modern koyu (en koyu) yap
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Navbar />

      <main className="flex-1 w-full  mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

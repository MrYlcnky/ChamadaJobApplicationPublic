import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import { tanimlamalarService } from "../../../../services/tanimlamalarService"; // Yolu kendi projene göre ayarla
import { toast } from "react-toastify";

export default function KvkkModal({ isOpen, onClose, item, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    KvkkAciklamaTr: "",
    DogrulukAciklamaTr: "",
    ReferansAciklamaTr: "",
    KvkkAciklamaEn: "",
    DogrulukAciklamaEn: "",
    ReferansAciklamaEn: "",
  });

  // Modal açıldığında veya item değiştiğinde formu doldur
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          KvkkAciklamaTr: item.kvkkAciklamaTr || item.KvkkAciklamaTr || "",
          DogrulukAciklamaTr:
            item.dogrulukAciklamaTr || item.DogrulukAciklamaTr || "",
          ReferansAciklamaTr:
            item.referansAciklamaTr || item.ReferansAciklamaTr || "",
          KvkkAciklamaEn: item.kvkkAciklamaEn || item.KvkkAciklamaEn || "",
          DogrulukAciklamaEn:
            item.dogrulukAciklamaEn || item.DogrulukAciklamaEn || "",
          ReferansAciklamaEn:
            item.referansAciklamaEn || item.ReferansAciklamaEn || "",
        });
      } else {
        // Yeni ekleme ise içini boşalt
        setFormData({
          KvkkAciklamaTr: "",
          DogrulukAciklamaTr: "",
          ReferansAciklamaTr: "",
          KvkkAciklamaEn: "",
          DogrulukAciklamaEn: "",
          ReferansAciklamaEn: "",
        });
      }
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = !!item;
      const payload = { ...formData };

      if (isEdit) {
        payload.Id = item.id || item.Id;
      }

      const res = isEdit
        ? await tanimlamalarService.updateKvkk(payload)
        : await tanimlamalarService.createKvkk(payload);

      if (res.success) {
        toast.success(
          isEdit ? "KVKK metni güncellendi." : "KVKK metni eklendi.",
        );
        onSuccess(); // Listeyi yenilemek için
        onClose(); // Modalı kapat
      } else {
        toast.error(res.message || "Bir hata oluştu.");
      }
    } catch (error) {
      toast.error("İşlem sırasında sunucu hatası oluştu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 outline-none transition-all text-sm font-medium text-gray-700 resize-none";
  const labelClass =
    "text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 transition-opacity">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">
              {item ? "KVKK Düzenle" : "Yeni KVKK Ekle"}
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Lütfen Türkçe ve İngilizce metinleri eksiksiz doldurun.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50 focus:outline-none"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xl w-5 h-5" />
          </button>
        </div>

        {/* Body / Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form id="kvkkForm" onSubmit={handleSubmit} className="space-y-8">
            {/* TÜRKÇE ALANLAR */}
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-2 mb-4">
                Türkçe Metinler (TR)
              </h4>
              <div>
                <label className={labelClass}>
                  KVKK Aydınlatma Metni ve Açık Rıza Onayı (TR)
                </label>
                <textarea
                  required
                  name="KvkkAciklamaTr"
                  value={formData.KvkkAciklamaTr}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  placeholder="Türkçe KVKK Metni..."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Doğruluk ve Sorumluluk Beyanı (TR)
                  </label>
                  <textarea
                    required
                    name="DogrulukAciklamaTr"
                    value={formData.DogrulukAciklamaTr}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder="Türkçe Doğruluk ve Sorumluluk Beyanı..."
                  ></textarea>
                </div>
                <div>
                  <label className={labelClass}>
                    Referans Araştırma ve Doğrulama Onayı (TR)
                  </label>
                  <textarea
                    required
                    name="ReferansAciklamaTr"
                    value={formData.ReferansAciklamaTr}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder="Türkçe Referans İzni..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* İNGİLİZCE ALANLAR */}
            <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-4">
                İngilizce Metinler (EN)
              </h4>
              <div>
                <label className={labelClass}>
                  KVKK Aydınlatma Metni ve Açık Rıza Onayı (EN)
                </label>
                <textarea
                  required
                  name="KvkkAciklamaEn"
                  value={formData.KvkkAciklamaEn}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  placeholder="English KVKK Text..."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Doğruluk ve Sorumluluk Beyanı (EN)
                  </label>
                  <textarea
                    required
                    name="DogrulukAciklamaEn"
                    value={formData.DogrulukAciklamaEn}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder="English Truth Declaration..."
                  ></textarea>
                </div>
                <div>
                  <label className={labelClass}>
                    Referans Araştırma ve Doğrulama Onayı (EN)
                  </label>
                  <textarea
                    required
                    name="ReferansAciklamaEn"
                    value={formData.ReferansAciklamaEn}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder="English Reference Permission..."
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 shadow-sm transition-all focus:outline-none"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="kvkkForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {item ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

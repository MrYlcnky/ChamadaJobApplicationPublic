import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faMoneyBillWave,
  faCalendarAlt,
  faUserTie,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { gorevAtamaService } from "../../../../../services/gorevAtamaService";
import MuiDateStringField from "../../../../../components/Users/Date/MuiDateStringField";

export default function JobOfferDetails({
  personelId,
  auth,
  currentStageId,
  jobOfferData,
  setJobOfferData,
}) {
  const [loading, setLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [gorevler, setGorevler] = useState([]);

  // Sadece Rol=6 (Departman Mng) ve Aşama=2 ise formu düzenleyebilir
  const isDM = Number(auth?.rolId || auth?.roleId) === 6;
  const canEdit = isDM && Number(currentStageId) === 2;
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kendi departmanına ait görevleri çek
        if (canEdit && auth?.masterDepartmanId) {
          const gorevRes = await gorevAtamaService.getGorevlerByDepartmanId(
            auth.masterDepartmanId,
          );
          setGorevler(gorevRes?.data?.data || []);
        }

        // Mevcut atama kaydını çek
        const atamaRes = await gorevAtamaService.getByPersonelId(personelId);

        if (atamaRes?.data?.success && atamaRes?.data?.data) {
          const data = atamaRes.data.data;
          setExistingData(data);

          // Ebeveyn bileşendeki state'i (formu) mevcut verilerle doldur
          setJobOfferData({
            id: data.id,
            masterDepartmanId: data.masterDepartmanId,
            gorevId: data.gorevId,
            netUcret: data.netUcret,
            talepEdilenGorevGenelButcesi: data.talepEdilenGorevGenelButcesi,
            baslangicTarihi: data.baslangicTarihi
              ? data.baslangicTarihi.split("T")[0]
              : "",
            talepNedeni: data.talepNedeni,
            yerineAlinacakKisiAdSoyad: data.yerineAlinacakKisiAdSoyad || "",
          });
        }
      } catch {
        console.log("Atama kaydı bulunamadı veya henüz oluşturulmamış.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personelId, auth, canEdit, setJobOfferData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobOfferData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. YÜKLENİYOR DURUMU
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 animate-pulse">
        Görev detayları yükleniyor...
      </div>
    );
  }

  // 2. HENÜZ GİRİLMEMİŞ DURUM (İK vb. İçin)
  if (!canEdit && !existingData) {
    return (
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
        <FontAwesomeIcon
          icon={faBriefcase}
          className="text-4xl text-gray-600 mb-3"
        />
        <h4 className="text-gray-400 font-semibold">
          Henüz Görev Ataması Yapılmamış
        </h4>
        <p className="text-gray-500 text-sm mt-1">
          Departman yöneticisi tarafından değerlendirme aşamasında görev ve maaş
          bilgileri girilecektir.
        </p>
      </div>
    );
  }

  // 3. SADECE OKUNUR (READ-ONLY) DURUM (Genel Müdür, Mali İşler vb.)
  if (!canEdit && existingData) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
          <h4 className="text-sky-400 font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faBriefcase} /> Görev & Teklif Detayları
          </h4>
          <span className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
            Onaylayan:{" "}
            <strong className="text-gray-300">
              {existingData.onaylayanKullaniciAdSoyad}
            </strong>
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DetailItem
            icon={faBuilding}
            label="Departman"
            value={existingData.masterDepartmanAdi}
          />
          <DetailItem
            icon={faUserTie}
            label="Atanan Görev"
            value={existingData.gorevAdi}
          />
          <DetailItem
            icon={faCalendarAlt}
            label="Başlangıç Tarihi"
            value={new Date(existingData.baslangicTarihi).toLocaleDateString(
              "tr-TR",
            )}
          />
          <DetailItem
            icon={faMoneyBillWave}
            label="Önerilen Net Ücret"
            value={`₺ ${existingData.netUcret.toLocaleString("tr-TR")}`}
            highlight
          />
          <DetailItem
            icon={faMoneyBillWave}
            label="Kadro Bütçesi"
            value={`₺ ${existingData.talepEdilenGorevGenelButcesi.toLocaleString("tr-TR")}`}
          />
          <DetailItem
            icon={faBriefcase}
            label="Talep Nedeni"
            value={
              existingData.talepNedeni === 1
                ? "Yeni Kadro"
                : `Yerine (${existingData.yerineAlinacakKisiAdSoyad})`
            }
            badge={
              existingData.talepNedeni === 1
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-amber-500/20 text-amber-400"
            }
          />
        </div>
      </div>
    );
  }

  // 4. DEPARTMAN YÖNETİCİSİ FORMU (DÜZENLENEBİLİR)
  return (
    <div className="bg-gray-800 border border-sky-500/30 rounded-xl p-6 shadow-lg shadow-sky-900/10">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-700">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faBriefcase} className="text-sky-500" />
          Görev & Maaş Atama Formu
        </h4>
        <div className="flex items-center gap-3">
          {existingData && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded border border-emerald-500/30">
              Daha önce kaydedilmiş
            </span>
          )}
          <span className="text-xs text-sky-400 bg-sky-500/10 px-3 py-1 rounded border border-sky-500/20">
            Zorunlu Alanlar
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-500 font-semibold mb-1 uppercase">
            Departman
          </label>
          <div className="w-full bg-gray-900/50 border border-gray-700 text-gray-400 rounded-lg p-2.5 cursor-not-allowed flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-gray-600" />
            {existingData?.masterDepartmanAdi ||
              auth?.masterDepartmanAdi ||
              "Departman Bilgisi Bekleniyor..."}
          </div>
        </div>

        <div>
          <label className="block text-xs text-sky-400 font-semibold mb-1 uppercase">
            Atanacak Görev
          </label>
          <select
            name="gorevId"
            value={jobOfferData.gorevId}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-sky-500/50 text-white rounded-lg p-2.5 focus:border-sky-500"
          >
            <option value="">Görev Seçiniz...</option>
            {gorevler.map((g) => (
              <option key={g.id} value={g.id}>
                {g.masterGorevAdi}
              </option>
            ))}
          </select>
        </div>

        {/* Başlama Tarihi */}
        <div className="dark-date-picker">
          <MuiDateStringField
            label="Başlama Tarihi"
            variant="dark"
            name="baslangicTarihi"
            value={jobOfferData.baslangicTarihi}
            onChange={handleInputChange}
            displayFormat="dd.MM.yyyy"
            min={today}
          />
        </div>

        <div>
          <label className="block text-xs text-sky-400 font-semibold mb-2 uppercase">
            Talep Nedeni
          </label>
          <select
            name="talepNedeni"
            value={jobOfferData.talepNedeni}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:border-sky-500"
          >
            <option value={1}>Yeni Kadro</option>
            <option value={2}>Yerine Alım</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-sky-400 font-semibold mb-1 uppercase">
            Önerilen Net Ücret (₺)
          </label>
          <input
            type="number"
            name="netUcret"
            placeholder="Örn: 45000 ₺"
            value={jobOfferData.netUcret}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-sky-500/50 text-white rounded-lg p-2.5 focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs text-sky-400 font-semibold mb-1 uppercase">
            Pozisyon Standart Bütçesi (₺)
          </label>
          <input
            type="number"
            name="talepEdilenGorevGenelButcesi"
            placeholder="Örn: 50000 ₺"
            value={jobOfferData.talepEdilenGorevGenelButcesi}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-sky-500/50 text-white rounded-lg p-2.5 focus:border-sky-500"
          />
        </div>

        {Number(jobOfferData.talepNedeni) === 2 && (
          <div className="md:col-span-2 animate-in fade-in zoom-in duration-300 mt-2">
            <label className="block text-xs text-amber-400 font-semibold mb-1 uppercase">
              Kimin Yerine Alınıyor?
            </label>
            <input
              type="text"
              name="yerineAlinacakKisiAdSoyad"
              placeholder="Ayrılan personelin adını ve soyadını yazınız..."
              value={jobOfferData.yerineAlinacakKisiAdSoyad}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-amber-500/50 focus:border-amber-500 text-white rounded-lg p-2.5"
            />
          </div>
        )}
      </div>

      <div className="mt-5 p-3 bg-sky-900/20 border border-sky-500/20 rounded-lg flex items-start gap-3">
        <FontAwesomeIcon icon={faBriefcase} className="text-sky-400 mt-0.5" />
        <p className="text-xs text-sky-200/70 leading-relaxed">
          Formu doldurduktan sonra bilgilerin sisteme kaydedilmesi ve adayın bir
          sonraki aşamaya iletilmesi için ekranın altındaki{" "}
          <strong>"Onayla ve İlerlet"</strong> butonuna basmanız gerekmektedir.
        </p>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, highlight, badge }) {
  return (
    <div>
      <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">
        {label}
      </span>
      <div
        className={`flex items-center gap-3 font-semibold ${highlight ? "text-sky-400 text-lg" : "text-gray-200"}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={highlight ? "text-sky-500/50" : "text-gray-600"}
        />
        {badge ? (
          <span
            className={`px-2.5 py-0.5 rounded text-xs border ${badge} border-current`}
          >
            {value}
          </span>
        ) : (
          value || "-"
        )}
      </div>
    </div>
  );
}

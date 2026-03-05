// src/components/Admin/Panel/ReadOnlyApplicationView.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../Users/modalHooks/dateUtils";

export default function ReadOnlyApplicationView({ data }) {
  if (!data) return null;

  const NA = <span className="text-gray-500 text-sm italic">-</span>;
  const personal = data.personal || {};
  const education = data.education || [];
  const certificates = data.certificates || [];
  const computer = data.computer || [];
  const languages = data.languages || [];
  const experience = data.isDeneyimleri || data.experience || [];
  const references = data.references || [];
  const otherInfo = data.otherInfo || {};
  const jobDetails = data.jobDetails || {};
  return (
    <div className="space-y-6 pb-8">
      {/* 1. KİŞİSEL BİLGİLER */}
      <Section
        icon={faUser}
        title="1. Kişisel Bilgiler"
        className="break-inside-avoid"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Fotoğraf Alanı */}
          <div className="shrink-0 flex justify-center md:justify-start">
            {personal.foto ? (
              <img
                src={
                  personal.foto.startsWith("http") ||
                  personal.foto.startsWith("data:")
                    ? personal.foto
                    : `${import.meta.env.VITE_API_BASE_URL}/uploads/personel-fotograflari/${personal.foto}`
                }
                alt="Aday"
                className="w-32 h-40 object-cover rounded-lg border border-gray-600 shadow-lg"
              />
            ) : (
              <div className="w-32 h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 border border-gray-600">
                <FontAwesomeIcon icon={faUser} size="3x" />
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <Field
              label="Ad Soyad"
              value={`${personal.ad || ""} ${personal.soyad || ""}`}
            />
            <Field label="E-posta" value={personal.eposta} />
            <Field label="Telefon" value={personal.telefon} />
            <Field label="WhatsApp" value={personal.whatsapp} />

            <Field
              label="Doğum Tarihi"
              value={formatDate(personal.dogumTarihi)}
            />
            <Field label="Cinsiyet" value={personal.cinsiyet} />
            <Field label="Medeni Durum" value={personal.medeniDurum} />
            <Field label="Çocuk Sayısı" value={personal.cocukSayisi} />
            <Field label="Uyruk" value={personal.UyrukAdi || personal.uyruk} />
            <Field
              label="Doğum Yeri"
              value={
                [
                  personal.DogumUlkeAdi || personal.dogumUlke,
                  personal.DogumSehirAdi || personal.dogumSehir,
                  personal.DogumIlceAdi || personal.dogumIlce,
                ]
                  .filter(Boolean)
                  .join(" / ") || NA
              }
            />
            <Field
              label="İkametgah"
              value={
                [
                  personal.IkametgahUlkeAdi || personal.ikametUlke,
                  personal.IkametgahSehirAdi || personal.ikametSehir,
                  personal.IkametgahIlceAdi || personal.ikametIlce,
                ]
                  .filter(Boolean)
                  .join(" / ") || NA
              }
              className="sm:col-span-2"
            />
            <Field
              label="Adres"
              value={personal.adres}
              className="sm:col-span-3 break-inside-avoid"
            />
          </div>
        </div>
      </Section>

      {/* 2. EĞİTİM */}
      <div className="break-inside-avoid">
        <Section icon={faGraduationCap} title="2. Eğitim Bilgileri">
          <DataTable
            headers={["Seviye", "Okul", "Bölüm", "Tarih", "Durum", "GANO"]}
            rows={education.map((e) => [
              e.seviye,
              e.okul,
              e.bolum,
              `${formatDate(e.baslangic)} - ${formatDate(e.bitis)}`,
              e.diplomaDurum,
              `${e.gano || "-"}`,
            ])}
          />
        </Section>
      </div>

      {/* 3. SERTİFİKALAR */}
      <div className="break-inside-avoid">
        <Section icon={faAward} title="3. Sertifika ve Eğitimler">
          <DataTable
            headers={[
              "Eğitim Adı",
              "Kurum",
              "Süre",
              "Veriliş Tarihi",
              "Geçerlilik Tarihi",
            ]}
            rows={certificates.map((c) => [
              c.ad,
              c.kurum,
              c.sure,
              formatDate(c.verilisTarihi),
              formatDate(c.gecerlilikTarihi),
            ])}
          />
        </Section>
      </div>

      {/* 4. İş Deneyimleri */}
      <div className="break-inside-avoid">
        <Section
          icon={faBriefcase}
          title="4. İş Deneyimleri"
          count={experience.length}
        >
          <DataTable
            headers={[
              "Şirket / Departman",
              "Pozisyon / Görev",
              "Lokasyon",
              "Maaş",
              "Süre",
              "Ayrılma Nedeni",
            ]}
            rows={experience.map((e) => {
              const sirket =
                e.sirketAdi || e.SirketAdi || e.isAdi || e.IsAdi || "-";
              const departman = e.departman || e.Departman || "";
              const pozisyon = e.pozisyon || e.Pozisyon || "-";
              const gorev = e.gorev || e.Gorev || "";
              const ucret = e.ucret || e.Ucret;
              const sehir = e.sehirAdi || e.SehirAdi || "";
              const ulke = e.ulkeAdi || e.UlkeAdi || "";
              const baslangic = e.baslangicTarihi || e.BaslangicTarihi;
              const bitis = e.bitisTarihi || e.BitisTarihi;
              const neden =
                e.ayrilisSebep ||
                e.AyrilisSebep ||
                e.ayrilisSebebi ||
                e.AyrilisSebebi ||
                "-";

              return [
                <div className="flex flex-col">
                  <span className="font-bold text-gray-200">{sirket}</span>
                  {departman && (
                    <span className="text-[11px] text-gray-500 uppercase">
                      {departman}
                    </span>
                  )}
                </div>,

                <div className="flex flex-col">
                  <span className="text-sky-400 font-medium">{pozisyon}</span>
                  {gorev && (
                    <span
                      className="text-[11px] text-gray-500 italic line-clamp-1"
                      title={gorev}
                    >
                      {gorev}
                    </span>
                  )}
                </div>,

                <span className="text-xs">
                  {sehir && ulke ? `${sehir} / ${ulke}` : sehir || ulke || "-"}
                </span>,

                <span className="font-mono text-xs text-emerald-400">
                  {ucret ? `${Number(ucret).toLocaleString("tr-TR")} ₺` : "-"}
                </span>,

                <div className="flex flex-col text-[11px]">
                  <span>{formatDate(baslangic)}</span>
                  <span className="text-gray-500 font-bold">
                    {!bitis ? (
                      <span className="text-emerald-500 text-[10px] uppercase">
                        Devam Ediyor
                      </span>
                    ) : (
                      formatDate(bitis)
                    )}
                  </span>
                </div>,

                <span className="text-xs truncate max-w-37.5" title={neden}>
                  {neden}
                </span>,
              ];
            })}
          />
        </Section>
      </div>

      {/* 5. DİĞER (Grid Yapısı) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 break-inside-avoid">
        <Section
          icon={faLanguage}
          title="5. Yabancı Dil"
          count={languages.length}
        >
          <DataTable
            headers={["Dil", "K / D / O / Y", "Öğrenilen Kurum"]}
            rows={languages.map((l) => {
              const dilAdi = l.dil || l.Dil || l.dilAdi || l.DilAdi || "-";
              const getLvl = (val) => (val ? val : "-");

              return [
                dilAdi,
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-sky-400 font-bold">
                    {getLvl(l.konuşma || l.Konuşma || l.konusma || l.Konusma)}
                  </span>
                  <span className="text-gray-600">/</span>
                  <span>{getLvl(l.dinleme || l.Dinleme)}</span>
                  <span className="text-gray-600">/</span>
                  <span>{getLvl(l.okuma || l.Okuma)}</span>
                  <span className="text-gray-600">/</span>
                  <span>{getLvl(l.yazma || l.Yazma)}</span>
                </div>,
                l.ogrenilenKurum || l.OgrenilenKurum || "-",
              ];
            })}
          />
        </Section>
        <Section icon={faLaptopCode} title="6. Bilgisayar">
          <DataTable
            headers={["Program", "Yetkinlik"]}
            rows={computer.map((c) => [c.programAdi, c.yetkinlik])}
          />
        </Section>
      </div>

      {/* 7. REFERANSLAR */}
      <div className="break-inside-avoid">
        <Section
          icon={faPhoneVolume}
          title="7. Referanslar"
          count={references.length}
        >
          <DataTable
            headers={["Ad Soyad", "Kurum Tipi / İş Yeri", "Görev", "Telefon"]}
            rows={references.map((r) => [
              <span className="font-bold text-gray-200">
                {`${r.referansAdi || ""} ${r.referansSoyadi || ""}`.trim() ||
                  "-"}
              </span>,

              <div className="flex flex-col">
                <span className="text-sky-400 font-medium">
                  {r.calistigiKurum || "-"}
                </span>
                {r.referansIsYeri && (
                  <span className="text-[11px] text-gray-500 uppercase">
                    {r.referansIsYeri}
                  </span>
                )}
              </div>,

              r.referansGorevi || "-",

              <span className="font-mono text-xs">
                {r.referansTelefon || "-"}
              </span>,
            ])}
          />
        </Section>
      </div>

      {/* 8. DİĞER KİŞİSEL BİLGİLER */}
      <div className="break-inside-avoid">
        <Section icon={faUserCog} title="8. Diğer Kişisel Bilgiler">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Field
              label="Ehliyet"
              value={
                otherInfo.ehliyet !== "-"
                  ? `${otherInfo.ehliyet} (${(otherInfo.ehliyetTurleri || []).join(", ") || "Sınıf Belirtilmedi"})`
                  : "Yok"
              }
            />
            <Field
              label="KKTC Geçerli Belge"
              value={otherInfo.kktcGecerliBelge}
            />
            <Field label="Askerlik Durumu" value={otherInfo.askerlik} />
            <Field label="Sigara Kullanımı" value={otherInfo.sigara} />
            <Field
              label="Fiziksel Bilgiler"
              value={
                otherInfo.boy !== "-" || otherInfo.kilo !== "-"
                  ? `${otherInfo.boy} cm / ${otherInfo.kilo} kg`
                  : "-"
              }
            />
            <Field
              label="Adli Sicil / Dava Durumu"
              value={
                otherInfo.davaDurumu !== "Yok" && otherInfo.davaNedeni !== "-"
                  ? `${otherInfo.davaDurumu} (Neden: ${otherInfo.davaNedeni})`
                  : otherInfo.davaDurumu
              }
            />
            <Field
              label="Sağlık / Kalıcı Rahatsızlık"
              value={
                otherInfo.kaliciRahatsizlik !== "Yok" &&
                otherInfo.rahatsizlikAciklama !== "-"
                  ? `${otherInfo.kaliciRahatsizlik} - Açıklama: ${otherInfo.rahatsizlikAciklama}`
                  : otherInfo.kaliciRahatsizlik
              }
              className="md:col-span-2 lg:col-span-2"
            />
          </div>
        </Section>
      </div>

      {/* 9. İŞ BAŞVURU DETAYLARI */}
      <div className="break-inside-avoid">
        <Section icon={faFileSignature} title="9. İş Başvuru Detayları">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Field
              label="Tercih Edilen Şubeler"
              value={jobDetails.subeler?.map((o) => o.label).join(", ")}
            />
            <Field
              label="Başvurulan Alanlar"
              value={jobDetails.alanlar?.map((o) => o.label).join(", ")}
            />
            <Field
              label="Departmanlar"
              value={jobDetails.departmanlar?.map((o) => o.label).join(", ")}
            />
            <Field
              label="Hedeflenen Pozisyonlar"
              value={jobDetails.departmanPozisyonlari
                ?.map((o) => o.label)
                .join(", ")}
            />
            <Field
              label="Bilinmesi Gereken Programlar"
              value={jobDetails.programlar?.map((o) => o.label).join(", ")}
            />
            <Field
              label="Hakim Olunan Kağıt Oyunları"
              value={jobDetails.kagitOyunlari?.map((o) => o.label).join(", ")}
            />
            <Field
              label="Lojman Talebi"
              value={jobDetails.lojman}
              className={
                jobDetails.lojman === "Evet" ? "text-emerald-400 font-bold" : ""
              }
            />
            <Field
              label="Neden Bizi Tercih Ediyor?"
              value={jobDetails.tercihNedeni}
              className="sm:col-span-2 lg:col-span-3"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

// --- Alt Bileşenler ---

function Section({ icon, title, children }) {
  return (
    <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border-b border-gray-700 flex items-center gap-2 sm:gap-3">
        <FontAwesomeIcon
          icon={icon}
          className="text-sky-400 text-sm sm:text-base shrink-0"
        />
        <h4 className="font-semibold text-gray-200 text-xs sm:text-sm uppercase tracking-wide truncate">
          {title}
        </h4>
      </div>
      <div className="p-3 sm:p-4 md:p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
        {label}
      </p>
      {/* Hatalı olan 'wrap-break-word' sınıfı 'break-words' olarak düzeltildi */}
      <div className="text-xs sm:text-sm text-gray-200 font-medium wrap-break-word">
        {value || <span className="text-gray-600">-</span>}
      </div>
    </div>
  );
}

function DataTable({ headers, rows }) {
  if (!rows || rows.length === 0)
    return (
      <p className="text-xs sm:text-sm text-gray-500 italic px-1">
        Veri girilmemiş.
      </p>
    );

  return (
    <div className="overflow-x-auto no-scrollbar rounded-lg border border-gray-700 w-full">
      <table className="w-full text-left text-[10px] sm:text-sm">
        <thead className="bg-gray-800 text-gray-400 uppercase text-[9px] sm:text-xs">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-900/40">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-800/50 transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 whitespace-nowrap align-middle"
                >
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import {
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faGraduationCap,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
  //faHistory,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../../Users/modalHooks/dateUtils";

// === YARDIMCI BİLEŞENLER ===

const Section = ({ title, icon, children }) => (
  <div
    className="pdf-section"
    style={{
      marginTop: "20px",
      paddingTop: "10px",
      paddingBottom: "10px",
      breakInside: "avoid",
    }}
  >
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "1.25rem",
        fontWeight: "700",
        color: "#111827",
        borderBottom: "2px solid #E5E7EB",
        paddingBottom: "8px",
        marginBottom: "16px",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          backgroundColor: "#F3F4F6",
          borderRadius: "6px",
          marginRight: "12px",
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ width: "16px", height: "16px", color: "#4B5563" }}
        />
      </span>
      {title.toUpperCase()}
    </h2>
    <div style={{ fontSize: "0.925rem", color: "#374151", lineHeight: "1.5" }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, value, colSpan = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      marginBottom: "12px",
      gridColumn: colSpan ? "span 3" : "span 1",
    }}
  >
    <span
      style={{
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: "4px",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "0.95rem",
        fontWeight: "500",
        color: "#111827",
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </span>
  </div>
);

const Table = ({ headers, rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <p
        style={{ fontSize: "0.875rem", color: "#9CA3AF", fontStyle: "italic" }}
      >
        Veri girilmemiş.
      </p>
    );
  }
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.875rem",
      }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: "12px 8px",
                textAlign: "left",
                fontWeight: "600",
                color: "#374151",
                fontSize: "0.8rem",
                textTransform: "uppercase",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{
              borderBottom: "1px solid #F3F4F6",
              breakInside: "avoid",
            }}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "12px 8px",
                  color: "#4B5563",
                  verticalAlign: "top",
                }}
              >
                {/* Dizi (Array) gelirse virgülle ayır, yoksa direkt bas */}
                {Array.isArray(cell) ? cell.join(", ") : cell || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// === ANA BİLEŞEN ===

export default function CVTemplate({ data }) {
  // Veri yüklenmediyse boş bir container göster (Crash olmaması için)
  if (!data)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Veri Yükleniyor...
      </div>
    );

  const cv = data;
  // Güvenli veri erişimi (Optional Chaining ile garanti altına alma)
  const personal = cv.personal || {};
  const jobDetails = cv.jobDetails || {};
  const experience = cv.experience || [];
  const education = cv.education || [];
  const languages = cv.languages || [];
  const computer = cv.computer || [];
  const certificates = cv.certificates || [];
  const references = cv.references || [];
  const otherInfo = cv.otherInfo || {};
  //const notes = cv.notes || [];

  // Pozisyonları güvenli şekilde al
  const rolesDisplay = Array.isArray(jobDetails.departmanPozisyonlari)
    ? jobDetails.departmanPozisyonlari.map((p) => p.label).join(" / ")
    : "-";

  return (
    <div
      id="cv-to-print"
      style={{
        width: "100%",
        maxWidth: "210mm",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        color: "#1F2937",
        padding: "50px 40px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        lineHeight: "1.5",
        boxSizing: "border-box",
        wordWrap: "break-word",
      }}
    >
      {/* === BAŞLIK (HEADER) === */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
          borderBottom: "3px solid #111827",
        }}
      >
        <tbody>
          <tr>
            {/* SOL TARAF: İSİM ve İLETİŞİM */}
            <td style={{ verticalAlign: "top", paddingBottom: "30px" }}>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  color: "#111827",
                  margin: "0 0 8px 0",
                  lineHeight: "1.1",
                }}
              >
                {personal.ad} {personal.soyad}
              </h1>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  color: "#4B5563",
                  margin: "0 0 24px 0",
                }}
              >
                {rolesDisplay}
              </p>

              {/* İletişim Bilgileri */}
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "24px",
                        verticalAlign: "middle",
                        paddingBottom: "8px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ color: "#6B7280" }}
                      />
                    </td>
                    <td
                      style={{
                        color: "#374151",
                        fontSize: "0.925rem",
                        paddingBottom: "8px",
                      }}
                    >
                      {personal.telefon}
                      {personal.whatsapp && (
                        <span style={{ color: "#9CA3AF", marginLeft: "8px" }}>
                          • WA: {personal.whatsapp}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "24px",
                        verticalAlign: "middle",
                        paddingBottom: "8px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ color: "#6B7280" }}
                      />
                    </td>
                    <td
                      style={{
                        color: "#374151",
                        fontSize: "0.925rem",
                        paddingBottom: "8px",
                      }}
                    >
                      {personal.eposta}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "24px",
                        verticalAlign: "top",
                        paddingTop: "2px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{ color: "#6B7280" }}
                      />
                    </td>
                    <td
                      style={{
                        color: "#374151",
                        fontSize: "0.925rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {personal.adres}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* SAĞ TARAF: FOTOĞRAF */}
            <td
              style={{
                width: "160px",
                verticalAlign: "top",
                textAlign: "right",
                paddingBottom: "30px",
              }}
            >
              {personal.foto ? (
                <img
                  src={personal.foto}
                  alt="Profil"
                  style={{
                    width: "140px",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    display: "inline-block",
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  style={{
                    width: "140px",
                    height: "160px",
                    borderRadius: "8px",
                    backgroundColor: "#F3F4F6",
                    border: "1px solid #E5E7EB",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "auto",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ width: "64px", height: "64px", color: "#D1D5DB" }}
                  />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* === 1. KİŞİSEL BİLGİLER === */}
      <Section title="Kişisel Bilgiler" icon={faUser}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <Row label="Doğum Tarihi" value={formatDate(personal.dogumTarihi)} />
          <Row label="Cinsiyet" value={personal.cinsiyet} />
          <Row label="Medeni Durum" value={personal.medeniDurum} />
          <Row label="Çocuk Sayısı" value={personal.cocukSayisi} />
          <Row label="Uyruk" value={personal.uyruk} />
          <Row
            label="Doğum Yeri"
            value={` ${personal.dogumUlke || ""}/ ${personal.dogumSehir || ""}/ ${personal.dogumIlce || ""}`}
          />
          <Row
            label="İkamet Yeri"
            value={` ${personal.ikametUlke || ""}/ ${personal.ikametSehir || ""}/ ${personal.ikametIlce || ""}`}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 2. EĞİTİM BİLGİLERİ === */}
      <Section title="Eğitim Bilgileri" icon={faGraduationCap}>
        <Table
          headers={[
            "Seviye",
            "Okul",
            "Bölüm",
            "Başlangıç",
            "Bitiş",
            "Durum",
            "GANO",
          ]}
          rows={education.map((e) => [
            e.seviye,
            e.okul,
            e.bolum,
            formatDate(e.baslangic),
            formatDate(e.bitis),
            e.diplomaDurum,
            `${e.gano || "-"} / ${e.notSistemi}`,
          ])}
        />
      </Section>

      {/* === 3. SERTİFİKALAR === */}
      <Section title="Sertifika ve Eğitimler" icon={faAward}>
        <Table
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

      {/* === 4. BİLGİSAYAR BİLGİLERİ === */}
      <Section title="Bilgisayar Bilgileri" icon={faLaptopCode}>
        <Table
          headers={["Program Adı", "Yetkinlik"]}
          rows={computer.map((c) => [c.programAdi, c.yetkinlik])}
        />
      </Section>

      {/* === 5. YABANCI DİL === */}
      <Section title="Yabancı Dil Bilgisi" icon={faLanguage}>
        <Table
          headers={[
            "Dil",
            "Konuşma",
            "Dinleme",
            "Okuma",
            "Yazma",
            "Nasıl Öğrenildi",
          ]}
          rows={languages.map((l) => [
            l.dil,
            l.konusma,
            l.dinleme,
            l.okuma,
            l.yazma,
            l.ogrenilenKurum,
          ])}
        />
      </Section>

      {/* === 6. İŞ DENEYİMLERİ === */}
      <Section title="İş Deneyimleri" icon={faBriefcase}>
        <Table
          headers={[
            "Şirket",
            "Departman",
            "Pozisyon",
            "Başlangıç",
            "Bitiş",
            "Ayrılış Nedeni",
          ]}
          rows={experience.map((e) => [
            e.isAdi,
            e.departman,
            e.pozisyon,
            formatDate(e.baslangicTarihi),
            e.halenCalisiyor ? "Devam Ediyor" : formatDate(e.bitisTarihi),
            e.ayrilisSebebi,
          ])}
        />
      </Section>

      {/* === 7. REFERANSLAR === */}
      <Section title="Referanslar" icon={faPhoneVolume}>
        <Table
          headers={["Ad Soyad", "Kurum", "Görev", "Telefon", "Tipi"]}
          rows={references.map((r) => [
            `${r.referansAdi} ${r.referansSoyadi}`,
            r.referansIsYeri,
            r.referansGorevi,
            r.referansTelefon,
            r.calistigiKurum,
          ])}
        />
      </Section>

      {/* === 8. DİĞER KİŞİSEL BİLGİLER === */}
      <Section title="Diğer Kişisel Bilgiler" icon={faUserCog}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <Row label="KKTC Belgesi" value={otherInfo.kktcGecerliBelge} />
          <Row label="Askerlik Durumu" value={otherInfo.askerlik} />
          <Row
            label="Ehliyet"
            value={`${otherInfo.ehliyet || ""} (${(otherInfo.ehliyetTurleri || []).join(", ")})`}
          />
          <Row
            label="Boy / Kilo"
            value={`${otherInfo.boy || "-"} cm / ${otherInfo.kilo || "-"} kg`}
          />
          <Row label="Sigara Kullanımı" value={otherInfo.sigara} />
          <Row
            label="Dava Durumu"
            value={`${otherInfo.davaDurumu || ""} (${otherInfo.davaNedeni || "N/A"})`}
          />
          <Row
            label="Kalıcı Rahatsızlık"
            value={`${otherInfo.kaliciRahatsizlik || ""} (${otherInfo.rahatsizlikAciklama || "N/A"})`}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 9. İŞ BAŞVURU DETAYLARI === */}
      <Section title="İş Başvuru Detayları" icon={faFileSignature}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <Row
            label="Şubeler"
            value={jobDetails.subeler?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Alanlar"
            value={jobDetails.alanlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Departmanlar"
            value={jobDetails.departmanlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Pozisyonlar"
            value={jobDetails.departmanPozisyonlari
              ?.map((o) => o.label)
              .join(", ")}
          />
          <Row
            label="Programlar"
            value={jobDetails.programlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Kağıt Oyunları"
            value={
              jobDetails.kagitOyunlari?.map((o) => o.label).join(", ") || "-"
            }
          />
          <Row label="Lojman Talebi" value={jobDetails.lojman} />
          <Row
            label="Tercih Nedeni"
            value={jobDetails.tercihNedeni}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 10. İŞLEM GEÇMİŞİ (Opsiyonel) === */}
      {/*
      <Section title="İşlem Geçmişi" icon={faHistory}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={index}
                style={{
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #F3F4F6",
                  paddingBottom: "10px",
                  breakInside: "avoid",
                }}
              >
                <p
                  style={{
                    color: "#1F2937",
                    fontStyle: "italic",
                    marginBottom: "4px",
                  }}
                >
                  "{note.note}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#4B5563",
                    }}
                  >
                    - {note.user}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                    {note.date} ({note.action})
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
              Henüz bir işlem notu yok.
            </p>
          )}
        </div>
      </Section>
 */}
      {/* === 11. İMZALAR === */}
      <Section title="Onay ve İmzalar" icon={faPenSquare}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          {["Departman Müdürü", "Genel Müdür", "İnsan Kaynakları Müdürü"].map(
            (role) => (
              <div
                key={role}
                style={{
                  width: "30%",
                  textAlign: "center",
                  pageBreakInside: "avoid",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #374151",
                    height: "50px",
                    marginBottom: "10px",
                  }}
                ></div>
                <p
                  style={{
                    fontWeight: "700",
                    color: "#111827",
                    fontSize: "0.875rem",
                  }}
                >
                  {role}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    marginTop: "4px",
                  }}
                >
                  (İmza)
                </p>
              </div>
            ),
          )}
        </div>
      </Section>
    </div>
  );
}

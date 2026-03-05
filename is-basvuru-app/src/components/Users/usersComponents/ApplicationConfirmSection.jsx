import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUserShield,
  faPhoneVolume,
  faPaperPlane,
  faClipboardCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { tanimlamaService } from "../../../services/tanimlamalarService";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ApplicationConfirmSection = ({
  isValidPersonal,
  isValidEducation,
  isValidOtherInfo,
  isValidJobDetails,
  onSubmit,
  customButtonText,
  customButtonIcon,
}) => {
  const { t, i18n } = useTranslation();

  // Checkbox'ların durumu
  const [checks, setChecks] = useState({
    dogruluk: false,
    kvkk: false,
    referans: false,
  });

  // Metinler
  const [contentTexts, setContentTexts] = useState({
    dogruluk: t("confirm.cards.truth.text"),
    kvkk: t("confirm.cards.kvkk.text"),
    referans: t("confirm.cards.reference.text"),
  });

  // Sözleşme Modalı için State
  const [modalContent, setModalContent] = useState(null);

  const recaptchaRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  // 🔥 ÇEVİRİ MANTIĞI BURADA KURULDU 🔥
  // i18n.language (veya t) her değiştiğinde bu useEffect tekrar çalışır.
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await tanimlamaService.getKvkkList();
        const dataList = res?.data || res;

        if (Array.isArray(dataList) && dataList.length > 0) {
          const activeItem = dataList[0];

          // Şu anki dili al (örn: "tr" veya "en")
          const currentLang = (
            i18n.resolvedLanguage ||
            i18n.language ||
            "tr"
          ).toLowerCase();

          // İngilizceyse EN suffix'li kolonları, değilse TR suffix'li kolonları okur.
          // Eğer veritabanından boş gelirse (||) locale dosyasındaki varsayılan çeviriyi (t(...)) kullanır.
          setContentTexts({
            dogruluk:
              currentLang === "en"
                ? activeItem.dogrulukAciklamaEn || t("confirm.cards.truth.text")
                : activeItem.dogrulukAciklamaTr ||
                  t("confirm.cards.truth.text"),

            kvkk:
              currentLang === "en"
                ? activeItem.kvkkAciklamaEn || t("confirm.cards.kvkk.text")
                : activeItem.kvkkAciklamaTr || t("confirm.cards.kvkk.text"),

            referans:
              currentLang === "en"
                ? activeItem.referansAciklamaEn ||
                  t("confirm.cards.reference.text")
                : activeItem.referansAciklamaTr ||
                  t("confirm.cards.reference.text"),
          });
        }
      } catch (error) {
        console.error("KVKK metinleri yüklenemedi.", error);
      }
    };

    fetchContent();
  }, [t, i18n.language, i18n.resolvedLanguage]); // 👈 Dil değiştiğinde API'den gelen objenin içinden doğru dili seçmesi için burası kritik.

  // Karta tıklandığında Modalı aç (veya tiki kaldır)
  const handleCardClick = (id, title, text, isChecked) => {
    if (isChecked) {
      setChecks((prev) => ({ ...prev, [id]: false }));
    } else {
      setModalContent({ id, title, text });
    }
  };

  // Modaldan onay gelince çalışacak
  const handleModalAccept = () => {
    if (modalContent) {
      setChecks((prev) => ({ ...prev, [modalContent.id]: true }));
      setModalContent(null);
    }
  };

  const handleModalClose = () => {
    setModalContent(null);
  };

  const handleSubmit = async () => {
    const missingSections = [];

    if (!isValidPersonal) missingSections.push(t("sections.personal"));
    if (!isValidEducation) missingSections.push(t("sections.education"));
    if (!isValidOtherInfo) missingSections.push(t("sections.other"));
    if (!isValidJobDetails) missingSections.push(t("sections.jobDetails"));

    const allChecked = Object.values(checks).every(Boolean);
    if (!allChecked) missingSections.push(t("confirm.checks"));

    if (!recaptchaToken) missingSections.push("reCAPTCHA");

    if (missingSections.length > 0) {
      Swal.fire({
        icon: "error",
        title: t("confirm.missing.title"),
        html: `
          <div style="text-align:left">
            <p>${t("confirm.missing.bodyIntro")}</p>
            <ul style="margin-top:8px; line-height:1.6; font-weight:600; color:#ef4444">
              ${missingSections.map((s) => `<li>• ${s}</li>`).join("")}
            </ul>
          </div>
        `,
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
        confirmButtonText: t("actions.close"),
      });
      return;
    }

    if (onSubmit) {
      onSubmit(recaptchaToken, () => {
        recaptchaRef.current?.reset();
        setRecaptchaToken("");
        setChecks({ dogruluk: false, kvkk: false, referans: false });
      });
    } else {
      toast.success(t("confirm.toast.success"));
    }
  };

  const captchaHl = (i18n.resolvedLanguage || i18n.language || "tr")
    .slice(0, 2)
    .toLowerCase();

  return (
    <div className="mt-10 pb-20">
      <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-lg overflow-hidden transition-all hover:border-slate-600 hover:shadow-2xl">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-700/80 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/50 border border-slate-700 shadow-inner shrink-0">
            <FontAwesomeIcon
              icon={faClipboardCheck}
              className="text-slate-300 text-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 leading-tight">
              {t("confirm.sectionTitle")}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {t("confirm.sectionDesc")}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200/50 p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ConfirmCard
              id="dogruluk"
              icon={faCheckCircle}
              title={t("confirm.cards.truth.title")}
              text={contentTexts.dogruluk}
              checked={checks.dogruluk}
              onClickCard={handleCardClick}
            />
            <ConfirmCard
              id="kvkk"
              icon={faUserShield}
              title={t("confirm.cards.kvkk.title")}
              text={contentTexts.kvkk}
              checked={checks.kvkk}
              onClickCard={handleCardClick}
            />
            <ConfirmCard
              id="referans"
              icon={faPhoneVolume}
              title={t("confirm.cards.reference.title")}
              text={contentTexts.referans}
              checked={checks.referans}
              onClickCard={handleCardClick}
            />
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex flex-col md:flex-row items-center justify-center gap-30">
            <div className="recaptcha-wrap focus:outline-none focus:ring-0">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={SITE_KEY}
                onChange={(t) => setRecaptchaToken(t || "")}
                theme="light"
                size="normal"
                hl={captchaHl}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!recaptchaToken}
              className={`
                relative overflow-hidden group
                inline-flex items-center justify-center gap-3 px-8 py-4 
                rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ease-out
                ${
                  recaptchaToken
                    ? "bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white transform hover:-translate-y-1 hover:shadow-sky-500/25"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                }
              `}
            >
              <FontAwesomeIcon
                icon={customButtonIcon || faPaperPlane}
                className={`transition-transform duration-300 ${
                  recaptchaToken
                    ? "group-hover:translate-x-1 group-hover:-translate-y-1"
                    : ""
                }`}
              />
              <span>{customButtonText || t("confirm.submit")}</span>
              {recaptchaToken && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SÖZLEŞME OKUMA MODALI (AÇIK TEMA & MODERN) */}
      {modalContent && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transform transition-all scale-100 opacity-100 border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {modalContent.title}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-100 focus:outline-none flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xl w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {modalContent.text}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
              <button
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm transition-all focus:outline-none"
              >
                {t("actions.cancel")}
              </button>
              <button
                onClick={handleModalAccept}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 focus:outline-none"
              >
                {t("confirm.modal.accept", "Okudum, Onaylıyorum")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ConfirmCard({ id, icon, title, text, checked, onClickCard }) {
  const { t } = useTranslation();
  return (
    <div
      role="button"
      onClick={() => onClickCard(id, title, text, checked)}
      className={`
        relative flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none group h-full
        ${
          checked
            ? "bg-sky-50 border-sky-500 shadow-md ring-1 ring-sky-500"
            : "bg-white border-gray-200 hover:border-sky-400 hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start gap-4 h-full">
        <div className="relative mt-1">
          <div
            className={`
            w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${
              checked
                ? "bg-sky-500 border-sky-500"
                : "border-gray-300 bg-gray-50 group-hover:border-sky-400"
            }
          `}
          >
            {checked && (
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-white text-sm"
              />
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h4
            className={`text-sm font-bold mb-2 transition-colors ${
              checked ? "text-sky-700" : "text-gray-800"
            }`}
          >
            {title}
          </h4>
          <div
            className={`text-xs leading-relaxed transition-colors whitespace-pre-line line-clamp-3 pr-1 ${
              checked ? "text-sky-600" : "text-gray-500"
            }`}
          >
            {text}
          </div>

          {/* i18n t() fonksiyonunu buraya da uygulayabilirsin istersen. 
              Ben t() olmadan bıraktım çünkü orijinalinde direkt TR yazıyordu. 
              Eğer istiyorsan çeviri dosyana ekleyip t("confirm.cards.uncheck") yapabilirsin. */}
          <span className="text-[10px] text-sky-500 mt-2 font-semibold">
            {checked
              ? t("confirm.cards.truth.uncheck")
              : t("confirm.cards.truth.check")}
          </span>
        </div>

        <FontAwesomeIcon
          icon={icon}
          className={`absolute bottom-2 right-2 text-4xl transition-all duration-300 opacity-5 
          ${checked ? "text-sky-600 opacity-10 scale-110" : "text-gray-400"} group-hover:scale-105`}
        />
      </div>
    </div>
  );
}

export default ApplicationConfirmSection;

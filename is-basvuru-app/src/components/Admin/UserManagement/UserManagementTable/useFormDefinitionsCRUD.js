import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { tanimlamalarService } from "../../../../services/tanimlamalarService";

export function useFormDefinitionsCRUD({
  activeTab,
  list,
  lookups,
  currentTab,
  upperCaseTabs,
  fetchList,
  fetchLookups,
  setKvkkModalOpen,
  setSelectedKvkk,
  getValue,
}) {
  // --- EKLEME İŞLEMİ ---
  const handleAdd = async () => {
    if (activeTab === "kvkk") {
      setSelectedKvkk(null);
      setKvkkModalOpen(true);
      return;
    }

    const addedCountryIds =
      activeTab === "uyruk"
        ? list.map((item) => item.ulkeId || item.UlkeId)
        : [];

    const ulkelerOptions = lookups.ulkeler
      .map((u) => {
        const id = u.id || u.Id;
        const isAdded = addedCountryIds.includes(id);
        return `<option value="${id}" ${isAdded ? "disabled" : ""}>${u.UlkeAdi || u.ulkeAdi} ${isAdded ? "(Zaten Ekli)" : ""}</option>`;
      })
      .join("");

    let htmlContent = "";
    const labelClass =
      "text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5";
    const inputClass =
      "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 outline-none transition-all text-sm font-bold text-gray-700 uppercase";

    if (["dil", "kktc", "ehliyet", "ulke"].includes(activeTab)) {
      htmlContent = `<div class="text-left"><label class="${labelClass}">Tanım Adı</label><input id="swal-name" class="${inputClass}" placeholder="Adı yazınız..."></div>`;
    } else if (["uyruk", "sehir"].includes(activeTab)) {
      htmlContent = `
        <div class="text-left space-y-4">
            <div><label class="${labelClass}">Bağlı Olduğu Ülke</label><select id="swal-ulke" class="${inputClass} cursor-pointer shadow-none"><option value="" disabled selected>Ülke Seçiniz...</option>${ulkelerOptions}</select></div>
            <div><label class="${labelClass}">Tanım Adı</label><input id="swal-name" class="${inputClass}" placeholder="Adı yazınız..."></div>
        </div>`;
    } else if (activeTab === "ilce") {
      htmlContent = `
        <div class="text-left space-y-4">
            <div class="grid grid-cols-2 gap-3">
                <div><label class="${labelClass}">1. Ülke</label><select id="swal-ulke" class="${inputClass} cursor-pointer shadow-none"><option value="" disabled selected>Seçiniz...</option>${ulkelerOptions}</select></div>
                <div><label class="${labelClass}">2. Şehir</label><select id="swal-sehir" class="${inputClass} cursor-pointer disabled:opacity-50 shadow-none" disabled><option value="" disabled selected>Önce Ülke...</option></select></div>
            </div>
            <div><label class="${labelClass}">Tanım Adı</label><input id="swal-name" class="${inputClass}" placeholder="İlçe adını yazınız..."></div>
        </div>`;
    }

    const { value: formValues } = await Swal.fire({
      title: `<span class="text-xl font-black text-gray-800 uppercase tracking-tighter">${currentTab.single} EKLE</span>`,
      html: `<div class="mt-4">${htmlContent}</div>`,
      showCancelButton: true,
      confirmButtonText: "Ekle",
      confirmButtonColor: "#10b981",
      cancelButtonText: "İptal",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton:
          "px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest",
        cancelButton:
          "px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest",
      },
      didOpen: (popup) => {
        const input = popup.querySelector("#swal-name");
        if (input && upperCaseTabs.includes(activeTab)) {
          input.addEventListener(
            "input",
            (e) => (e.target.value = e.target.value.toLocaleUpperCase("tr-TR")),
          );
        }
        if (activeTab === "ilce") {
          const ulkeSelect = popup.querySelector("#swal-ulke");
          const sehirSelect = popup.querySelector("#swal-sehir");
          ulkeSelect.addEventListener("change", (e) => {
            const selectedUlkeId = parseInt(e.target.value);
            const filteredSehirler = lookups.sehirler.filter(
              (s) => (s.UlkeId || s.ulkeId) === selectedUlkeId,
            );
            sehirSelect.innerHTML =
              `<option value="" disabled selected>Şehir Seçiniz...</option>` +
              filteredSehirler
                .map(
                  (s) =>
                    `<option value="${s.id || s.Id}">${s.SehirAdi || s.sehirAdi}</option>`,
                )
                .join("");
            sehirSelect.disabled = false;
          });
        }
      },
      preConfirm: () => {
        const text = document.getElementById("swal-name").value;
        const ulkeId = document.getElementById("swal-ulke")?.value;
        const sehirId = document.getElementById("swal-sehir")?.value;
        if (!text)
          return Swal.showValidationMessage("Lütfen bir isim giriniz!");
        if (["uyruk", "sehir"].includes(activeTab) && !ulkeId)
          return Swal.showValidationMessage("Lütfen ülke seçiniz!");
        if (activeTab === "ilce" && !sehirId)
          return Swal.showValidationMessage("Lütfen şehir seçiniz!");
        return { text, ulkeId, sehirId };
      },
    });

    if (formValues) {
      const finalText = upperCaseTabs.includes(activeTab)
        ? formValues.text.toLocaleUpperCase("tr-TR")
        : formValues.text;
      const payload = { [currentTab.key]: finalText };
      if (activeTab === "uyruk" || activeTab === "sehir")
        payload.UlkeId = parseInt(formValues.ulkeId);
      if (activeTab === "ilce") payload.SehirId = parseInt(formValues.sehirId);

      try {
        let res;
        switch (activeTab) {
          case "uyruk":
            res = await tanimlamalarService.createUyruk(payload);
            break;
          case "ulke":
            res = await tanimlamalarService.createUlke(payload);
            break;
          case "sehir":
            res = await tanimlamalarService.createSehir(payload);
            break;
          case "ilce":
            res = await tanimlamalarService.createIlce(payload);
            break;
          case "dil":
            res = await tanimlamalarService.createDil(payload);
            break;
          case "kktc":
            res = await tanimlamalarService.createKktcBelge(payload);
            break;
          case "ehliyet":
            res = await tanimlamalarService.createEhliyetTuru(payload);
            break;
        }
        if (res?.success) {
          toast.success("Başarıyla eklendi.");
          fetchList();
          fetchLookups();
        } else toast.error(res?.message || "Hata oluştu.");
      } catch {
        toast.error("İşlem sırasında bir hata oluştu.");
      }
    }
  };

  // --- DÜZENLEME İŞLEMİ ---
  const handleEdit = async (item) => {
    if (activeTab === "kvkk") {
      setSelectedKvkk(item);
      setKvkkModalOpen(true);
      return;
    }
    const currentVal = getValue(item, currentTab.key);
    const { value: newText } = await Swal.fire({
      title: `<span class="text-xl font-black text-gray-800 uppercase tracking-tighter">DÜZENLE</span>`,
      input: "text",
      inputValue: currentVal,
      showCancelButton: true,
      confirmButtonText: "Güncelle",
      confirmButtonColor: "#f59e0b",
      customClass: {
        popup: "rounded-[2rem]",
        input: "swal2-modern-input uppercase font-bold",
      },
      didOpen: (popup) => {
        const input = popup.querySelector(".swal2-input");
        if (input && upperCaseTabs.includes(activeTab)) {
          input.addEventListener(
            "input",
            (e) => (e.target.value = e.target.value.toLocaleUpperCase("tr-TR")),
          );
        }
      },
    });

    if (newText && newText !== currentVal) {
      const finalText = upperCaseTabs.includes(activeTab)
        ? newText.toLocaleUpperCase("tr-TR")
        : newText;
      const payload = { id: item.id, [currentTab.key]: finalText };
      if (activeTab === "uyruk" || activeTab === "sehir")
        payload.UlkeId = item.UlkeId || item.ulkeId;
      if (activeTab === "ilce") payload.SehirId = item.SehirId || item.sehirId;
      try {
        let res;
        switch (activeTab) {
          case "uyruk":
            res = await tanimlamalarService.updateUyruk(payload);
            break;
          case "ulke":
            res = await tanimlamalarService.updateUlke(payload);
            break;
          case "sehir":
            res = await tanimlamalarService.updateSehir(payload);
            break;
          case "ilce":
            res = await tanimlamalarService.updateIlce(payload);
            break;
          case "dil":
            res = await tanimlamalarService.updateDil(payload);
            break;
          case "kktc":
            res = await tanimlamalarService.updateKktcBelge(payload);
            break;
          case "ehliyet":
            res = await tanimlamalarService.updateEhliyetTuru(payload);
            break;
        }
        if (res?.success) {
          toast.success("Güncellendi");
          fetchList();
          fetchLookups();
        } else toast.error(res?.message);
      } catch {
        toast.error("Hata.");
      }
    }
  };

  // --- SİLME İŞLEMİ ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Silinsin mi?",
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "İptal",
      customClass: { popup: "rounded-[2rem]" },
    });
    if (result.isConfirmed) {
      try {
        let res;
        switch (activeTab) {
          case "uyruk":
            res = await tanimlamalarService.deleteUyruk(id);
            break;
          case "ulke":
            res = await tanimlamalarService.deleteUlke(id);
            break;
          case "sehir":
            res = await tanimlamalarService.deleteSehir(id);
            break;
          case "ilce":
            res = await tanimlamalarService.deleteIlce(id);
            break;
          case "dil":
            res = await tanimlamalarService.deleteDil(id);
            break;
          case "kktc":
            res = await tanimlamalarService.deleteKktcBelge(id);
            break;
          case "ehliyet":
            res = await tanimlamalarService.deleteEhliyetTuru(id);
            break;
          case "kvkk":
            res = await tanimlamalarService.deleteKvkk(id);
            break;
        }
        if (res?.success) {
          toast.success("Silindi.");
          fetchList();
          fetchLookups();
        } else toast.error(res?.message || "Silinemedi.");
      } catch {
        toast.error("Hata.");
      }
    }
  };

  return { handleAdd, handleEdit, handleDelete };
}

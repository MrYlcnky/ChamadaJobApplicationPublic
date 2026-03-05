import axiosClient from "../api/axiosClient";

/**
 * API Helper: Veriyi normalize eder.
 * Backend'den gelen ServiceResponse wrapper'ını (success, data, message) çözer.
 */
const unwrap = (response) => {
  const d = response?.data;
  if (d == null)
    return { success: false, data: [], message: "Sunucudan yanıt alınamadı." };

  // Backend'den standart { data, success, message } dönüyorsa
  if (d.data !== undefined) {
    return {
      success: d.success ?? true,
      data: Array.isArray(d.data) ? d.data : d.data ? [d.data] : [],
      message: d.message,
    };
  }

  // Direkt array dönüyorsa
  if (Array.isArray(d)) return { success: true, data: d, message: null };

  return { success: false, data: [], message: "Beklenmeyen veri formatı." };
};

const toNum = (v) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const eqId = (a, b) => {
  const na = toNum(a);
  const nb = toNum(b);
  if (na == null || nb == null) return false;
  return na === nb;
};

const service = {
  // ============================================================
  // 1. COĞRAFİ VERİLER (Ülke, Şehir, İlçe)
  // ============================================================

  // GET
  getUlkeler: async () => unwrap(await axiosClient.get("/Ulke/GetAll")),
  getSehirler: async () => unwrap(await axiosClient.get("/Sehir/GetAll")),
  getIlceler: async () => unwrap(await axiosClient.get("/Ilce/GetAll")),

  getSehirlerByUlkeId: async (ulkeId) => {
    const response = await axiosClient.get(`/Sehir/GetByUlkeId/${ulkeId}`);
    return unwrap(response);
  },

  getIlcelerBySehirId: async (sehirId) => {
    // Backend endpoint'i varsa orayı kullan, yoksa filtrele:
    // const response = await axiosClient.get(`/Ilce/GetBySehirId/${sehirId}`);
    // return unwrap(response);

    // Geçici Client-Side Filtreleme (Backend endpoint yoksa):
    const res = await service.getIlceler();
    const sehirNum = toNum(sehirId);
    if (sehirNum == null) return res;
    return {
      ...res,
      data: res.data.filter((i) => eqId(i.sehirId ?? i.SehirId, sehirNum)),
    };
  },

  // CRUD - ÜLKE
  createUlke: async (data) =>
    unwrap(await axiosClient.post("/Ulke/Create", data)),
  updateUlke: async (data) =>
    unwrap(await axiosClient.put("/Ulke/Update", data)),
  deleteUlke: async (id) =>
    unwrap(await axiosClient.delete(`/Ulke/Delete/${id}`)),

  // CRUD - ŞEHİR
  createSehir: async (data) =>
    unwrap(await axiosClient.post("/Sehir/Create", data)),
  updateSehir: async (data) =>
    unwrap(await axiosClient.put("/Sehir/Update", data)),
  deleteSehir: async (id) =>
    unwrap(await axiosClient.delete(`/Sehir/Delete/${id}`)),

  // CRUD - İLÇE
  createIlce: async (data) =>
    unwrap(await axiosClient.post("/Ilce/Create", data)),
  updateIlce: async (data) =>
    unwrap(await axiosClient.put("/Ilce/Update", data)),
  deleteIlce: async (id) =>
    unwrap(await axiosClient.delete(`/Ilce/Delete/${id}`)),

  // ============================================================
  // 2. FORM TANIMLARI (Uyruk, Dil, Belge, Ehliyet, KVKK)
  // ============================================================

  // UYRUK
  getUyruklar: async () => unwrap(await axiosClient.get("/Uyruk/GetAll")),
  createUyruk: async (data) =>
    unwrap(await axiosClient.post("/Uyruk/Create", data)),
  updateUyruk: async (data) =>
    unwrap(await axiosClient.put("/Uyruk/Update", data)),
  deleteUyruk: async (id) =>
    unwrap(await axiosClient.delete(`/Uyruk/Delete/${id}`)),

  // YABANCI DİL
  getDiller: async () => unwrap(await axiosClient.get("/Dil/GetAll")),
  createDil: async (data) =>
    unwrap(await axiosClient.post("/Dil/Create", data)),
  updateDil: async (data) => unwrap(await axiosClient.put("/Dil/Update", data)),
  deleteDil: async (id) =>
    unwrap(await axiosClient.delete(`/Dil/Delete/${id}`)),

  // EHLİYET TÜRLERİ
  getEhliyetTurleri: async () =>
    unwrap(await axiosClient.get("/EhliyetTuru/GetAll")),
  createEhliyetTuru: async (data) =>
    unwrap(await axiosClient.post("/EhliyetTuru/Create", data)),
  updateEhliyetTuru: async (data) =>
    unwrap(await axiosClient.put("/EhliyetTuru/Update", data)),
  deleteEhliyetTuru: async (id) =>
    unwrap(await axiosClient.delete(`/EhliyetTuru/Delete/${id}`)),

  // KKTC BELGELERİ
  getKktcBelgeler: async () =>
    unwrap(await axiosClient.get("/KktcBelge/GetAll")), // Veya /KKTBelge/GetAll
  createKktcBelge: async (data) =>
    unwrap(await axiosClient.post("/KktcBelge/Create", data)),
  updateKktcBelge: async (data) =>
    unwrap(await axiosClient.put("/KktcBelge/Update", data)),
  deleteKktcBelge: async (id) =>
    unwrap(await axiosClient.delete(`/KktcBelge/Delete/${id}`)),

  // KVKK METİNLERİ
  getKvkkList: async () => unwrap(await axiosClient.get("/Kvkk/GetAll")),
  createKvkk: async (data) =>
    unwrap(await axiosClient.post("/Kvkk/Create", data)),
  updateKvkk: async (data) =>
    unwrap(await axiosClient.put("/Kvkk/Update", data)),
  deleteKvkk: async (id) =>
    unwrap(await axiosClient.delete(`/Kvkk/Delete/${id}`)),

  // ============================================================
  // 3. MASTER (İSİM HAVUZU) TANIMLARI
  // ============================================================

  // MASTER ALAN
  getMasterAlanlar: async () =>
    unwrap(await axiosClient.get("/MasterAlan/GetAll")),
  createMasterAlan: async (data) =>
    unwrap(await axiosClient.post("/MasterAlan/Create", data)),
  updateMasterAlan: async (data) =>
    unwrap(await axiosClient.put("/MasterAlan/Update", data)),
  deleteMasterAlan: async (id) =>
    unwrap(await axiosClient.delete(`/MasterAlan/Delete/${id}`)),

  // MASTER DEPARTMAN
  getMasterDepartmanlar: async () =>
    unwrap(await axiosClient.get("/MasterDepartman/GetAll")),
  createMasterDepartman: async (data) =>
    unwrap(await axiosClient.post("/MasterDepartman/Create", data)),
  updateMasterDepartman: async (data) =>
    unwrap(await axiosClient.put("/MasterDepartman/Update", data)),
  deleteMasterDepartman: async (id) =>
    unwrap(await axiosClient.delete(`/MasterDepartman/Delete/${id}`)),

  // MASTER POZİSYON
  getMasterPozisyonlar: async () =>
    unwrap(await axiosClient.get("/MasterPozisyon/GetAll")),
  createMasterPozisyon: async (data) =>
    unwrap(await axiosClient.post("/MasterPozisyon/Create", data)),
  updateMasterPozisyon: async (data) =>
    unwrap(await axiosClient.put("/MasterPozisyon/Update", data)),
  deleteMasterPozisyon: async (id) =>
    unwrap(await axiosClient.delete(`/MasterPozisyon/Delete/${id}`)),

  // MASTER PROGRAM
  getAllMasterPrograms: async () =>
    unwrap(await axiosClient.get("/MasterProgram/GetAll")),
  createMasterProgram: async (data) =>
    unwrap(await axiosClient.post("/MasterProgram/Create", data)),
  updateMasterProgram: async (data) =>
    unwrap(await axiosClient.put("/MasterProgram/Update", data)),
  deleteMasterProgram: async (id) =>
    unwrap(await axiosClient.delete(`/MasterProgram/Delete/${id}`)),

  // MASTER OYUN
  getAllMasterOyuns: async () =>
    unwrap(await axiosClient.get("/MasterOyun/GetAll")),
  createMasterOyun: async (data) =>
    unwrap(await axiosClient.post("/MasterOyun/Create", data)),
  updateMasterOyun: async (data) =>
    unwrap(await axiosClient.put("/MasterOyun/Update", data)),
  deleteMasterOyun: async (id) =>
    unwrap(await axiosClient.delete(`/MasterOyun/Delete/${id}`)),

  // ============================================================
  // 4. ŞİRKET ORGANİZASYON & HİYERARŞİ
  // ============================================================

  // ŞUBE
  getSubeler: async () => unwrap(await axiosClient.get("/Sube/GetAll")),
  createSube: async (data) =>
    unwrap(await axiosClient.post("/Sube/Create", data)),
  updateSube: async (data) =>
    unwrap(await axiosClient.put("/Sube/Update", data)),
  deleteSube: async (id) =>
    unwrap(await axiosClient.delete(`/Sube/Delete/${id}`)),

  // SUBE-ALAN (İlişki)
  getSubeAlanlar: async () => unwrap(await axiosClient.get("/SubeAlan/GetAll")),
  createSubeAlan: async (data) =>
    unwrap(await axiosClient.post("/SubeAlan/Create", data)),
  updateSubeAlan: async (data) =>
    unwrap(await axiosClient.put("/SubeAlan/Update", data)),
  deleteSubeAlan: async (id) =>
    unwrap(await axiosClient.delete(`/SubeAlan/Delete/${id}`)),

  // DEPARTMAN (İlişki: SubeAlan -> MasterDepartman)
  getDepartmanlar: async () =>
    unwrap(await axiosClient.get("/Departman/GetAll")),
  createDepartman: async (data) =>
    unwrap(await axiosClient.post("/Departman/Create", data)),
  updateDepartman: async (data) =>
    unwrap(await axiosClient.put("/Departman/Update", data)),
  deleteDepartman: async (id) =>
    unwrap(await axiosClient.delete(`/Departman/Delete/${id}`)),

  // DEPARTMAN-POZİSYON (İlişki: Departman -> MasterPozisyon)
  getDepartmanPozisyonlar: async () =>
    unwrap(await axiosClient.get("/DepartmanPozisyon/GetAll")),
  createDepartmanPozisyon: async (data) =>
    unwrap(await axiosClient.post("/DepartmanPozisyon/Create", data)),
  updateDepartmanPozisyon: async (data) =>
    unwrap(await axiosClient.put("/DepartmanPozisyon/Update", data)),
  deleteDepartmanPozisyon: async (id) =>
    unwrap(await axiosClient.delete(`/DepartmanPozisyon/Delete/${id}`)),

  // PROGRAM BİLGİSİ (Organizasyona Bağlı)
  getProgramlar: async () =>
    unwrap(await axiosClient.get("/ProgramBilgisi/GetAll")),
  createProgramBilgisi: async (data) =>
    unwrap(await axiosClient.post("/ProgramBilgisi/Create", data)),
  updateProgramBilgisi: async (data) =>
    unwrap(await axiosClient.put("/ProgramBilgisi/Update", data)),
  deleteProgramBilgisi: async (id) =>
    unwrap(await axiosClient.delete(`/ProgramBilgisi/Delete/${id}`)),

  // OYUN BİLGİSİ (Organizasyona Bağlı)
  getOyunlar: async () => unwrap(await axiosClient.get("/OyunBilgisi/GetAll")),
  createOyunBilgisi: async (data) =>
    unwrap(await axiosClient.post("/OyunBilgisi/Create", data)),
  updateOyunBilgisi: async (data) =>
    unwrap(await axiosClient.put("/OyunBilgisi/Update", data)),
  deleteOyunBilgisi: async (id) =>
    unwrap(await axiosClient.delete(`/OyunBilgisi/Delete/${id}`)),

  // Hiyerarşi Görünümü
  getFullHierarchy: async () =>
    unwrap(await axiosClient.get("/DepartmanPozisyon/GetFullHierarchy")),
};

export const tanimlamalarService = service;
export const tanimlamaService = service;

export default service;

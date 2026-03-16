import axiosClient from "../api/axiosClient";

export const gorevAtamaService = {
  // Atama Detaylarını Getir
  getByPersonelId: (personelId) =>
    axiosClient.get(`/GorevAtamaDetay/GetByPersonelId/${personelId}`),

  // Yeni Atama Oluştur
  create: (data) => axiosClient.post("/GorevAtamaDetay/Create", data),

  // Atama Güncelle
  update: (data) => axiosClient.put("/GorevAtamaDetay/Update", data),

  // Select'leri doldurmak için gerekli Lookup (Master) veriler
  getMasterDepartmanlar: () => axiosClient.get("/MasterDepartman/GetAll"),

  getMasterGorevler: () => axiosClient.get("/MasterGorev/GetAll"),

  getGorevlerByMasterId: (masterGorevId) =>
    axiosClient.get(`/Gorev/GetByMasterGorevId/${masterGorevId}`),

  // Departman ID'sine göre o departmanın görevlerini getirir
  getGorevlerByDepartmanId: (masterDepartmanId) =>
    axiosClient.get(`/Gorev/GetByMasterDepartmanId/${masterDepartmanId}`),
};

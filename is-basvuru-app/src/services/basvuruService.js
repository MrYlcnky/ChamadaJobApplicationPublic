import axiosClient from "../api/axiosClient";

export const basvuruService = {
  // --- ADAY (USER) İŞLEMLERİ (PersonelController) ---

  create: async (formData) => {
    const response = await axiosClient.post("/Personel/Create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    /*const response = await axiosClient.put("/Personel/Update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });*/
    const response = await axiosClient.put("/Personel/Update", formData);
    return response.data;
  },

  getByEmail: async (email) => {
    const response = await axiosClient.get("/Personel/basvurumu-getir", {
      params: { email },
    });
    return response.data;
  },

  // --- ADMİN (PANEL) İŞLEMLERİ (MasterBasvuruController) ---

  getAll: async () => {
    const response = await axiosClient.get("/MasterBasvuru/GetAll");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/MasterBasvuru/GetById/${id}`);
    return response.data;
  },

  updateStatus: async (statusData) => {
    // Backend'deki Put("Update") endpoint'ine göre güncellendi
    const response = await axiosClient.put("/MasterBasvuru/Update", statusData);
    return response.data;
  },

  getAllLogs: async () => {
    const response = await axiosClient.get("/Log/GetAllLogs");
    return response.data;
  },

  getBasvuruLogs: async (id) => {
    const response = await axiosClient.get(`/Log/GetBasvuruLogs/${id}`);
    return response.data;
  },

  getCvLogs: async (personelId) => {
    const response = await axiosClient.get(`/Log/GetCvLogs/${personelId}`);
    return response.data;
  },
  getNotifications: async () => {
    const response = await axiosClient.get("/MasterBasvuru/GetNotifications/");
    return response.data;
  },
  getBasvuruOnaylari: async () => {
    const response = await axiosClient.get("/Personel/OnayLoglari");
    return response.data;
  },

  deleteMasterBasvuru: async (id) => {
    const response = await axiosClient.delete(`/MasterBasvuru/Delete/${id}`);
    return response.data;
  },
};

export default basvuruService;

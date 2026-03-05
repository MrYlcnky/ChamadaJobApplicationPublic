import axiosClient from "../api/axiosClient";

export const panelUserService = {
  getAll: async () => {
    const response = await axiosClient.get("/PanelKullanici/GetAll");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/PanelKullanici/GetById/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await axiosClient.post("/PanelKullanici/Create", payload);
    return response.data;
  },

  update: async (payload) => {
    const response = await axiosClient.put("/PanelKullanici/Update", payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/PanelKullanici/Delete/${id}`);
    return response.data;
  },

  //Şifre Değiştirme
  ChangePassword: async (payload) => {
    const response = await axiosClient.post(
      "/PanelKullanici/ChangePassword",
      payload,
    );
    return response.data;
  },
};

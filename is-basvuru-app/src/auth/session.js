// src/auth/session.js
import axiosClient from "../api/axiosClient";

const AUTH_KEY = "authUser";
const TOKEN_KEY = "authToken";

// Kullanıcı oturumunu getir
export const getAuthUser = () => {
  try {
    const data = sessionStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Session storage okuma hatası", error);
    return null;
  }
};

// LOGIN: API'ye istek atar
export const login = async (username, password) => {
  try {
    // Backend'deki 'AdminLoginDto' yapısına uygun veri gönderiyoruz
    const response = await axiosClient.post("/KimlikDogrulama/giris", {
      kullaniciAdi: username,
      sifre: password
    });

    if (response.data && response.data.token) {
      // 1. Token'ı kaydet (axiosClient bunu otomatik okuyacak)
      sessionStorage.setItem(TOKEN_KEY, response.data.token);
      
      // 2. Kullanıcı bilgilerini kaydet
      // Backend yanıtında "kullaniciBilgileri" objesi dönüyor mu kontrol edin, 
      // dönmüyorsa response.data içinden uygun alanı seçin.
      const userData = response.data.kullaniciBilgileri || { 
        name: username, 
        role: "admin" // Geçici varsayılan, backend'den gelmeli
      };
      
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error("Giriş hatası:", error.response?.data || error.message);
    throw error; // Hatayı Login.jsx component'ine fırlat ki orada ekrana basabilsin
  }
};

// LOGOUT
export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
};
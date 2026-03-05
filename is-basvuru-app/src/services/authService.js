import axiosClient from "../api/axiosClient";

export const authService = {
  /**
   * Kullanıcı Giriş İşlemi
   * @param {string} username - Kullanıcı Adı
   * @param {string} password - Şifre
   */
  login: async (username, password) => {
    // Backend AdminLoginDto ile eşleşen payload
    const loginPayload = {
      kullaniciAdi: username,
      kullaniciSifre: password,
    };

    try {
      const response = await axiosClient.post("/Auth/login", loginPayload);
      const apiResponse = response.data;

      // Yanıt başarılıysa ve data içeriği varsa
      if (apiResponse && apiResponse.success && apiResponse.data) {
        const { token, userInfo } = apiResponse.data;

        if (token) {
          // 1. Token'ı localStorage'a kaydediyoruz (axiosClient her istekte buradan okuyacak)
          localStorage.setItem("token", token);

          // 2. Kullanıcı bilgilerini saklıyoruz (JSON string olarak)
          sessionStorage.setItem("authUser", JSON.stringify(userInfo));

          // 3. Rol bilgisini kolay erişim için ayrıca saklıyoruz
          if (userInfo && userInfo.rolAdi) {
            localStorage.setItem("role", userInfo.rolAdi);
          }
        }
      }

      // Login.jsx içindeki 'if (response.success)' kontrolü için tüm apiResponse'u döndürüyoruz
      return apiResponse;
    } catch (error) {
      console.error("AuthService Login Error:", error);
      // Hatanın Login.jsx içindeki catch bloğuna düşmesi için fırlatıyoruz
      throw error;
    }
  },

  /**
   * Çıkış İşlemi
   */
  logout: () => {
    // Kaydedilen tüm oturum verilerini temizle
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("authUser");

    // Kullanıcıyı giriş sayfasına yönlendir ve sayfayı yenile (State temizliği için)
    window.location.href = "/login";
  },

  /**
   * Şifre Sıfırlama Kodu Gönder
   */
  sendCode: async (eposta, isLoginCheck = false) => {
    const response = await axiosClient.post("/KimlikDogrulama/kod-gonder", {
      Eposta: eposta,
      kayitliKullaniciKontrolu: isLoginCheck,
    });
    return response.data;
  },

  /**
   * Gönderilen Kodu Doğrula
   */
  verifyCode: async (eposta, kod) => {
    const response = await axiosClient.post("/KimlikDogrulama/kod-dogrula", {
      Eposta: eposta,
      Kod: kod,
    });
    return response.data;
  },
};

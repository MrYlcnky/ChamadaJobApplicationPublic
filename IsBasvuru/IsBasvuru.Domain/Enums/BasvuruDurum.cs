namespace IsBasvuru.Domain.Enums
{
    public enum BasvuruDurum
    {
        YeniBasvuru = 1,  // Sisteme ilk düştü, henüz kimse dokunmadı
        DevamEdiyor = 2,  // İK onayladı ve süreci başlattı (Sevk edildi)
        Onaylandi = 3,    // Tüm süreçlerden başarıyla geçti
        Reddedildi = 4,   // Herhangi bir aşamada red yedi
        RevizeTalebi = 5  // 
    }
}
namespace IsBasvuru.Domain.Enums
{
    public enum LogIslemTipi
    {
        Ekleme = 1,
        Guncelleme = 2,
        Silme = 3,
        Hata = 4,
        Giris = 5,
        YeniBasvuru = 6,
        Sevk = 7,       // İK'nın departmana göndermesi
        Onay = 8,       // Departman veya Genel Müdür onayı
        Red = 9,        // Herhangi bir aşamada red
        Revize = 10     // Revize talebi (ileride gerekirse)
    }
}
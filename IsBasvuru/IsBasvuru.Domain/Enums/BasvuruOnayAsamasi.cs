namespace IsBasvuru.Domain.Enums
{
    public enum BasvuruOnayAsamasi
    {
        Ik_Ilk_Degerlendirme = 1, // Başvuru ilk buraya düşer (Senin istediğin 1. madde)
        Departman_Onayi = 2,      // İK sevk edince buraya geçer
        Ik_Son_Kontrol = 3,       // Departman onaylayınca tekrar İK'ya gelir
        Genel_Mudur_Onayi = 4,    // İK uygun bulursa GM'ye gönderir
        Mali_Isler_Mudur_Onayi = 5,  // GM onaylarsa Mali isler mudure gider
        Tamamlandi = 6           // Mali isler mudur onaylayınca süreç biter
        
    }
}
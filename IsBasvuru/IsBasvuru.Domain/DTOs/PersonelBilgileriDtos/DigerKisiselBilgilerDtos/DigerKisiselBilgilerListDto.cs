using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos
{
    public class DigerKisiselBilgilerListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        // KKTC Belge Bilgisi
        public int KktcBelgeId { get; set; }
        public required string KktcBelgeAdi { get; set; }

        // Enumlar ve Adları
        public SecimDurumu DavaDurumu { get; set; }
        public string? DavaDurumuAdi { get; set; }
        public string? DavaNedeni { get; set; }

        public SecimDurumu SigaraKullanimi { get; set; }
        public string? SigaraKullanimiAdi { get; set; }

        public AskerlikDurumu AskerlikDurumu { get; set; }
        public string? AskerlikDurumuAdi { get; set; }

        public SecimDurumu KaliciRahatsizlik { get; set; }
        public string? KaliciRahatsizlikAdi { get; set; }
        public string? KaliciRahatsizlikAciklama { get; set; }

        public SecimDurumu EhliyetDurumu { get; set; }
        public string? EhliyetDurumuAdi { get; set; }

        public int Boy { get; set; }
        public int Kilo { get; set; }
    }
}
using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos
{
    public class DigerKisiselBilgilerCreateDto
    {
        public int PersonelId { get; set; }

        public int KktcBelgeId { get; set; } // İlişkili tablo (Örn: Kimlik Kartı, Sürüş Ehliyeti vb.)

        public SecimDurumu DavaDurumu { get; set; } // Var/Yok
        public string? DavaNedeni { get; set; } // Varsa açıklama

        public SecimDurumu SigaraKullanimi { get; set; }
        public AskerlikDurumu AskerlikDurumu { get; set; } // Yapıldı/Tecilli/Muaf

        public SecimDurumu KaliciRahatsizlik { get; set; }
        public string? KaliciRahatsizlikAciklama { get; set; }

        public SecimDurumu EhliyetDurumu { get; set; } // Var/Yok


        public int Boy { get; set; }
        public int Kilo { get; set; }
    }
}
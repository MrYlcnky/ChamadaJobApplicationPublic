using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos
{
    public class DigerKisiselBilgilerUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public int KktcBelgeId { get; set; }

        public SecimDurumu DavaDurumu { get; set; }
        public string? DavaNedeni { get; set; }

        public SecimDurumu SigaraKullanimi { get; set; }
        public AskerlikDurumu AskerlikDurumu { get; set; }

        public SecimDurumu KaliciRahatsizlik { get; set; }
        public string? KaliciRahatsizlikAciklama { get; set; }

        public SecimDurumu EhliyetDurumu { get; set; }

        public int Boy { get; set; }
        public int Kilo { get; set; }
    }
}
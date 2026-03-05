using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos
{
    public class ReferansBilgisiCreateDto
    {
        public int PersonelId { get; set; }

        public ReferansKurum CalistigiKurum { get; set; } // Enum (Bünyemizde / Harici)
        public required string ReferansAdi { get; set; }
        public required string ReferansSoyadi { get; set; }
        public required string IsYeri { get; set; }
        public required string Gorev { get; set; }
        public required string ReferansTelefon { get; set; }
    }
}
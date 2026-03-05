using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos
{
    public class YabanciDilBilgisiUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public int? DilId { get; set; }
        public string? DigerDilAdi { get; set; }

        public DilSeviyesi KonusmaSeviyesi { get; set; }
        public DilSeviyesi YazmaSeviyesi { get; set; }
        public DilSeviyesi OkumaSeviyesi { get; set; }
        public DilSeviyesi DinlemeSeviyesi { get; set; }

        public required string NasilOgrenildi { get; set; }
    }
}
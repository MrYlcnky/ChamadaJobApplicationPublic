using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos
{
    public class YabanciDilBilgisiListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }

        public int DilId { get; set; }
        public required string DilAdi { get; set; } 
        public DilSeviyesi KonusmaSeviyesi { get; set; }
        public required string KonusmaSeviyesiAdi { get; set; }

        public DilSeviyesi YazmaSeviyesi { get; set; }
        public required string YazmaSeviyesiAdi { get; set; }

        public DilSeviyesi OkumaSeviyesi { get; set; }
        public required string OkumaSeviyesiAdi { get; set; }

        public DilSeviyesi DinlemeSeviyesi { get; set; }
        public required string DinlemeSeviyesiAdi { get; set; }

        public required string NasilOgrenildi { get; set; }
    }
}
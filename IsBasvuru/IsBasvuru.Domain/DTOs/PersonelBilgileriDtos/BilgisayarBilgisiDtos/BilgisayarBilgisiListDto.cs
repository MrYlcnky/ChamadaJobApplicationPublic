using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos
{
    public class BilgisayarBilgisiListDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }
        public required string ProgramAdi { get; set; }

        public required Yetkinlik Yetkinlik { get; set; }
        public required string YetkinlikAdi { get; set; } 
    }
}
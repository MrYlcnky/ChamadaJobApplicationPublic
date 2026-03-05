using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos
{
    public class BilgisayarBilgisiCreateDto
    {
        public int PersonelId { get; set; }
        public required string ProgramAdi { get; set; } 
        public Yetkinlik Yetkinlik { get; set; } 
    }
}
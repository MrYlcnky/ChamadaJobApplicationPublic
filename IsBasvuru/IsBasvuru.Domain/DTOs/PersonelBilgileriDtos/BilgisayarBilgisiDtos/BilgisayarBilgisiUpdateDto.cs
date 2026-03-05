using IsBasvuru.Domain.Enums;

namespace IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos
{
    public class BilgisayarBilgisiUpdateDto
    {
        public int Id { get; set; }
        public int PersonelId { get; set; }
        public required string ProgramAdi { get; set; }
        public Yetkinlik Yetkinlik { get; set; }
    }
}
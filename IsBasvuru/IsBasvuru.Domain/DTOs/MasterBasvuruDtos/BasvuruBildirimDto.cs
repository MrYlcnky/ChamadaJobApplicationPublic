namespace IsBasvuru.Domain.DTOs.MasterBasvuruDtos
{
    public class BasvuruBildirimDto
    {
        public int BasvuruId { get; set; }
        public int PersonelId { get; set; }
        public string? PersonelAd { get; set; }
        public string? PersonelSoyad { get; set; }
        public DateTime BasvuruTarihi { get; set; }
    }
}